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
import { EventEmitter } from "./lib/event-emiter";
import { makeLoginController } from "./main/factories/controller/login";
import { adaptFastifyRoute } from "./main/adapter/fastify-route-adapter";
import { env } from "./config/env";
import { getUserPermission } from "./utils/get-user-permission";
import { eventSchema } from "@next-acl/auth";

const app = Fastify().withTypeProvider<ZodTypeProvider>();
const eventEmitter = EventEmitter();

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

app.get(
  "/user/:userId",
  {
    schema: {
      params: z.object({
        userId: z.string().cuid2(),
      }),
    },
  },
  async (req, res) => {
    const { userId } = req.params;
    const [user] = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.id, userId));

    return {
      userId: user.id,
      role: user.role,
    };
  },
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

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, organizerId));

    const { cannot } = getUserPermission(user.id, user.role);

    if (cannot("create", "Event")) {
      throw new Error("You're not allowed");
    }

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
    const [eventData] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId));

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, organizerId));

    const { cannot } = getUserPermission(user.id, user.role);

    if (
      cannot("update", eventSchema.parse({ userId: eventData.organizerId }))
    ) {
      throw new Error("You're not allowed");
    }

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

    const [eventData] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId));

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    const { cannot } = getUserPermission(user.id, user.role);

    if (
      cannot("update", eventSchema.parse({ userId: eventData.organizerId }))
    ) {
      throw new Error("This event are not your!");
    }

    const [event] = await db
      .update(events)
      .set({
        status: "cancelado",
      })
      .where(and(eq(events.id, eventId), eq(events.organizerId, userId)));

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

    const [eventData] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId));

    const [user] = await db.select().from(users).where(eq(users.id, userId));

    const { cannot } = getUserPermission(user.id, user.role);

    if (
      cannot("delete", eventSchema.parse({ userId: eventData.organizerId }))
    ) {
      throw new Error("This event are not your!");
    }

    const [event] = await db
      .delete(events)
      .where(and(eq(events.id, eventId), eq(events.organizerId, userId)))
      .returning();

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

    const [eventData] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId));

    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    const { cannot } = getUserPermission(userData.id, userData.role);

    if (cannot("subscribe", "Event")) {
      throw new Error("You are not allowed to subscribe in event");
    }

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

    const [user] = await db
      .select({
        id: registration.id,
        name: users.name,
        email: users.email,
        registrationDate: registration.registrationDate,
      })
      .from(registration)
      .where(
        and(eq(registration.eventId, eventId), eq(registration.userId, userId)),
      )
      .leftJoin(users, eq(users.id, userId));

    eventEmitter.emit(eventId, {
      key: "user_registration",
      message: user,
    });

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

    const [eventData] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId));

    const [userData] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId));

    const { cannot } = getUserPermission(userData.id, userData.role);

    if (cannot("subscribe", "Event")) {
      throw new Error("You are not allowed to subscribe in event");
    }

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
      participants: sql<
        string[]
      >`COALESCE(array_remove(array_agg(${registration.userId}), NULL), ARRAY[]::text[])`.as(
        "participants",
      ),
      createdAt: events.createdAt,
    })
    .from(events)
    .leftJoin(
      eventAvailableSlotsCount,
      eq(eventAvailableSlotsCount.eventId, events.id),
    )
    .leftJoin(users, eq(users.id, events.organizerId))
    .leftJoin(registration, eq(registration.eventId, events.id))
    .groupBy(events.id, users.id, eventAvailableSlotsCount.slotsCount);

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
    "/notify/:eventId",
    { websocket: true },
    async function wsHandler(socket, req) {
      const { eventId } = req.params as { eventId: string };

      eventEmitter.on(eventId, socket);

      socket.onmessage = () => {};

      socket.onclose = () => {
        eventEmitter.off(eventId, socket);
      };
    },
  );
});

const PORT = env.PORT || 3000;

app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  console.log(`🚀 server listening on ${address}`);
});
