import dotenv from "dotenv";

dotenv.config();

import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import z from "zod";
import bcrypt from "bcrypt";
import { and, eq, sql } from "drizzle-orm";
import websocket from "@fastify/websocket";
import cors from "@fastify/cors";

import { db } from "./db";
import { events, registration, users } from "./db/schema";
import { Observer } from "./lib/observer";
import { makeLoginController } from "./main/factories/controller/login";
import { adaptFastifyRoute } from "./main/adapter/fastify-route-adapter";
import { env } from "./config/env";

const app = Fastify().withTypeProvider<ZodTypeProvider>();
const observer = new Observer();

app.register(cors, {
  origin: "*",
});
app.register(websocket);
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.post(
  "/login",
  {
    schema: {
      body: z.object({
        email: z.string().email(),
        password: z.string().min(6),
      }),
    },
  },
  adaptFastifyRoute(makeLoginController()),
);

app.post(
  "/users",
  {
    schema: {
      body: z.object({
        name: z.string().min(4),
        email: z.string().email(),
        password: z.string().min(6),
        role: z
          .enum(["participante", "visualizador", "organizador"])
          .default("participante"),
      }),
    },
  },
  async (req, reply) => {
    const { name, email, password, role } = req.body;

    const userAlreadyExists = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.email, email));

    if (userAlreadyExists[0]) {
      return reply
        .status(409)
        .send({ message: "Email already exists in system!" });
    }

    const passwordHashed = await bcrypt.hash(password, 12);

    const [user] = await db
      .insert(users)
      .values({ name, email, password: passwordHashed, role })
      .returning();

    return reply.send({ user });
  },
);

app.post(
  "/events",
  {
    schema: {
      body: z.object({
        title: z.string().min(1),
        description: z.string(),
        eventType: z.enum(["online", "presencial", "híbrido"]),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        location: z.string().min(2),
        availableSlots: z.coerce.number().min(1),
        status: z.enum(["ativo", "cancelado"]),
        organizerId: z.string().cuid2(),
      }),
    },
  },
  async (req, reply) => {
    const {
      title,
      description,
      location,
      availableSlots,
      eventType,
      status,
      startDate,
      endDate,
      organizerId,
    } = req.body;
    const [event] = await db
      .insert(events)
      .values({
        title,
        description,
        location,
        availableSlots,
        eventType,
        status,
        startDate,
        endDate,
        organizerId,
      })
      .returning();

    return reply.send({ event });
  },
);

app.put(
  "/event/:eventId",
  {
    schema: {
      params: z.object({
        eventId: z.string().cuid2(),
      }),
      body: z.object({
        title: z.string().min(1),
        description: z.string(),
        eventType: z.enum(["online", "presencial", "híbrido"]),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        location: z.string().min(2),
        availableSlots: z.coerce.number().min(1),
        status: z.enum(["ativo", "cancelado"]),
        organizerId: z.string().cuid2(),
      }),
    },
  },
  async (req, reply) => {
    const {
      title,
      description,
      location,
      availableSlots,
      eventType,
      status,
      startDate,
      endDate,
      organizerId,
    } = req.body;
    const { eventId } = req.params;
    const [event] = await db
      .update(events)
      .set({
        title,
        description,
        location,
        availableSlots,
        eventType,
        status,
        startDate,
        endDate,
        organizerId,
      })
      .where(eq(events.id, eventId))
      .returning();

    return reply.send({ event });
  },
);

app.patch(
  "/event/:eventId/cancel",
  {
    schema: {
      params: z.object({
        eventId: z.string().cuid2(),
      }),
      body: z.object({
        userId: z.string().cuid2(),
      }),
    },
  },
  async (req, reply) => {
    const { eventId } = req.params;
    const { userId } = req.body;
    const [event] = await db
      .update(events)
      .set({
        status: "cancelado",
      })
      .where(and(eq(events.id, eventId), eq(events.organizerId, userId)))
      .returning();

    console.log(event);

    if (!event) {
      return reply.status(400).send({ message: "this event are not your!" });
    }

    return reply.send({ event });
  },
);

app.delete(
  "/event/:eventId/:userId",
  {
    schema: {
      params: z.object({
        eventId: z.string().cuid2(),
        userId: z.string().cuid2(),
      }),
    },
  },
  async (req, reply) => {
    const { eventId, userId } = req.params;
    const [event] = await db
      .delete(events)
      .where(and(eq(events.id, eventId), eq(events.organizerId, userId)))
      .returning();

    if (!event) {
      return reply.status(400).send({ message: "this event are not your!" });
    }

    return reply.send({ event });
  },
);

app.patch(
  "/event/:eventId/subscribe",
  {
    schema: {
      params: z.object({
        eventId: z.string().cuid2(),
      }),
      body: z.object({
        userId: z.string().cuid2(),
      }),
    },
  },
  async (req, reply) => {
    const { userId } = req.body;
    const { eventId } = req.params;

    const eventAvailableSlotsCount = db.$with("event_available_slots_count").as(
      db
        .select({
          eventId: registration.eventId,
          slotsCount: sql`COUNT(${registration.id})`.as("slotsCount"),
        })
        .from(registration)
        .where(eq(registration.eventId, eventId))
        .groupBy(registration.eventId),
    );

    const result = await db
      .with(eventAvailableSlotsCount)
      .select({
        isAvailable: sql`COALESCE(${events.availableSlots}, 0) > COALESCE(${eventAvailableSlotsCount.slotsCount}, 0)`,
      })
      .from(events)
      .leftJoin(
        eventAvailableSlotsCount,
        eq(events.id, eventAvailableSlotsCount.eventId),
      )
      .where(eq(events.id, eventId))
      .limit(1);

    const { isAvailable } = result[0];

    if (!isAvailable) {
      return reply
        .status(410)
        .send({ message: "this spots for this event are sold out." });
    }

    const [alreadySubscribed] = await db
      .select()
      .from(registration)
      .where(
        and(eq(registration.userId, userId), eq(registration.eventId, eventId)),
      );

    if (alreadySubscribed) {
      return reply.status(403).send({
        error:
          "You cannot register for an event that you have already registered for.",
      });
    }

    const [data] = await db
      .insert(registration)
      .values({
        userId,
        eventId,
      })
      .returning();

    return reply.send({ registration: data });
  },
);

app.patch(
  "/event/:eventId/unsubscribe",
  {
    schema: {
      params: z.object({
        eventId: z.string().cuid2(),
      }),
      body: z.object({
        userId: z.string().cuid2(),
      }),
    },
  },
  async (req, reply) => {
    const { userId } = req.body;
    const { eventId } = req.params;

    await db
      .delete(registration)
      .where(
        and(eq(registration.eventId, eventId), eq(registration.userId, userId)),
      );
    return reply.status(204).send();
  },
);

app.get("/events", async (req, reply) => {
  const eventAvailableSlotsCount = db.$with("event_available_slots_count").as(
    db
      .select({
        eventId: registration.eventId,
        slotsCount: sql`COUNT(${registration.id})`.as("slotsCount"),
      })
      .from(registration)
      .groupBy(registration.eventId),
  );
  const result = await db
    .with(eventAvailableSlotsCount)
    .select({
      id: events.id,
      title: events.title,
      description: events.description,
      location: events.location,
      availableSlots: events.availableSlots,
      occupiedVacancies:
        sql`COALESCE(${eventAvailableSlotsCount.slotsCount}, 0)`.mapWith(
          Number,
        ),
      eventType: events.eventType,
      status: events.status,
      startDate: events.startDate,
      endDate: events.endDate,
      organizer: {
        id: users.id,
        name: users.name,
      },
      createdAt: events.createdAt,
    })
    .from(events)
    .leftJoin(
      eventAvailableSlotsCount,
      eq(eventAvailableSlotsCount.eventId, events.id),
    )
    .leftJoin(users, eq(users.id, events.organizerId));

  return reply.send(result);
});

app.get(
  "/event/:eventId",
  { schema: { params: z.object({ eventId: z.string().cuid2() }) } },
  async (req, reply) => {
    const { eventId } = req.params;
    const eventAvailableSlotsCount = db.$with("event_available_slots_count").as(
      db
        .select({
          eventId: registration.eventId,
          slotsCount: sql`COUNT(${registration.id})`.as("slotsCount"),
        })
        .from(registration)
        .groupBy(registration.eventId),
    );
    const [result] = await db
      .with(eventAvailableSlotsCount)
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        location: events.location,
        availableSlots: events.availableSlots,
        occupiedVacancies:
          sql`COALESCE(${eventAvailableSlotsCount.slotsCount}, 0)`.mapWith(
            Number,
          ),
        eventType: events.eventType,
        status: events.status,
        startDate: events.startDate,
        endDate: events.endDate,
        organizer: {
          id: users.id,
          name: users.name,
        },
        createdAt: events.createdAt,
      })
      .from(events)
      .where(eq(events.id, eventId))
      .leftJoin(
        eventAvailableSlotsCount,
        eq(eventAvailableSlotsCount.eventId, events.id),
      )
      .leftJoin(users, eq(users.id, events.organizerId));

    return reply.send(result);
  },
);

app.get(
  "/event/:eventId/participants",
  {
    schema: {
      params: z.object({
        eventId: z.string().cuid2(),
      }),
    },
  },
  async (req, res) => {
    const { eventId } = req.params;

    const participants = await db
      .select({
        id: registration.id,
        name: users.name,
        email: users.email,
        registrationDate: registration.registrationDate,
      })
      .from(registration)
      .where(eq(registration.eventId, eventId))
      .leftJoin(users, eq(users.id, registration.userId));

    return { participants };
  },
);

app.register(async (fastify) => {
  fastify.get(
    "/notify",
    { websocket: true },
    async function wsHandler(socket, req) {
      const { eventId } = req.params as { eventId: string };

      observer.subscribe(socket, eventId);

      socket.onmessage = () => {};

      socket.onclose = () => {
        observer.unsubscribe(socket, eventId);
      };
    },
  );
});

const PORT = env.PORT || 3000;

app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  console.log(`🚀 server listening on ${address}`);
});
