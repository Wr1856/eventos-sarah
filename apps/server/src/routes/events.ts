import type { FastifyInstance } from "fastify";
import { and, eq, sql } from "drizzle-orm";
import z from "zod";

import { db } from "../db";
import { events, registration, users } from "../db/schema";
import { EventEmitter } from "../lib/event-emiter";
import { getUserPermission } from "../utils/get-user-permission";
import { eventSchema } from "@next-acl/auth";

const eventEmitter = EventEmitter();

export async function registerRoutes(app: FastifyInstance) {
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
      } = req.body as {
        title: string;
        description: string;
        location: string;
        availableSlots: number;
        eventType: "online" | "presencial" | "híbrido";
        status: "ativo" | "cancelado";
        startDate: Date;
        endDate: Date;
        organizerId: string;
      };

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, organizerId));
      if (!user) {
        return reply.status(404).send({ error: "Organizer not found" });
      }

      const { cannot } = getUserPermission(user.id, user.role);

      if (cannot("create", "Event")) {
        return reply.status(403).send({ error: "You're not allowed" });
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
      } = req.body as {
        title: string;
        description: string;
        location: string;
        availableSlots: number;
        eventType: "online" | "presencial" | "híbrido";
        status: "ativo" | "cancelado";
        startDate: Date;
        endDate: Date;
        organizerId: string;
      };
      const { eventId } = req.params as { eventId: string };
      const [eventData] = await db
        .select()
        .from(events)
        .where(eq(events.id, eventId));
      if (!eventData) {
        return reply.status(404).send({ error: "Event not found" });
      }

      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, organizerId));

      if (!user) {
        return reply.status(404).send({ error: "Organizer not found" });
      }

      const { cannot } = getUserPermission(user.id, user.role);

      if (
        cannot("update", eventSchema.parse({ userId: eventData.organizerId }))
      ) {
        return reply.status(403).send({ error: "You're not allowed" });
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
      preHandler: [app.authenticate],
      schema: {
        params: z.object({
          eventId: z.string().cuid2(),
        }),
      },
    },
    async (req, reply) => {
      const { eventId } = req.params as { eventId: string };
      const userId = req.userId;

      const [eventData] = await db
        .select()
        .from(events)
        .where(eq(events.id, eventId));
      if (!eventData) {
        return reply.status(404).send({ error: "Event not found" });
      }

      const [user] = await db.select().from(users).where(eq(users.id, userId));

      if (!user) {
        return reply.status(404).send({ error: "Organizer not found" });
      }

      const { cannot } = getUserPermission(user.id, user.role);

      if (
        cannot("update", eventSchema.parse({ userId: eventData.organizerId }))
      ) {
        return reply.status(403).send({ error: "This event are not your!" });
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
    "/event/:eventId",
    {
      preHandler: [app.authenticate],
      schema: {
        params: z.object({
          eventId: z.string().cuid2(),
        }),
      },
    },
    async (req, reply) => {
      const { eventId } = req.params as { eventId: string };
      const userId = req.userId;

      const [eventData] = await db
        .select()
        .from(events)
        .where(eq(events.id, eventId));
      if (!eventData) {
        return reply.status(404).send({ error: "Event not found" });
      }

      const [user] = await db.select().from(users).where(eq(users.id, userId));

      if (!user) {
        return reply.status(404).send({ error: "Organizer not found" });
      }

      const { cannot } = getUserPermission(user.id, user.role);

      if (
        cannot("delete", eventSchema.parse({ userId: eventData.organizerId }))
      ) {
        return reply.status(403).send({ error: "This event are not your!" });
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
      preHandler: [app.authenticate],
      schema: {
        params: z.object({
          eventId: z.string().cuid2(),
        }),
      },
    },
    async (req, reply) => {
      const userId = req.userId;
      const { eventId } = req.params as { eventId: string };

      const [eventData] = await db
        .select()
        .from(events)
        .where(eq(events.id, eventId));
      if (!eventData) {
        return reply.status(404).send({ error: "Event not found" });
      }

      const [userData] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));

      if (!userData) {
        return reply.status(404).send({ error: "User not found" });
      }

      const { cannot } = getUserPermission(userData.id, userData.role);

      if (cannot("subscribe", "Event")) {
        return reply
          .status(403)
          .send({ error: "You are not allowed to subscribe in event" });
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
      preHandler: [app.authenticate],
      schema: {
        params: z.object({
          eventId: z.string().cuid2(),
        }),
      },
    },
    async (req, reply) => {
      const userId = req.userId;
      const { eventId } = req.params as { eventId: string };

      const [eventData] = await db
        .select()
        .from(events)
        .where(eq(events.id, eventId));
      if (!eventData) {
        return reply.status(404).send({ error: "Event not found" });
      }

      const [userData] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId));
      if (!userData) {
        return reply.status(404).send({ error: "User not found" });
      }

      const { cannot } = getUserPermission(userData.id, userData.role);

      if (cannot("subscribe", "Event")) {
        return reply
          .status(403)
          .send({ error: "You are not allowed to subscribe in event" });
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
      const { eventId } = req.params as { eventId: string };
      const eventAvailableSlotsCount = db
        .$with("event_available_slots_count")
        .as(
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
      if (!result) {
        return reply.status(404).send({ error: "Event not found" });
      }

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
      const { eventId } = req.params as { eventId: string };

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
}

