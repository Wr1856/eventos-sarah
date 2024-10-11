"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const fastify_1 = __importDefault(require("fastify"));
const fastify_type_provider_zod_1 = require("fastify-type-provider-zod");
const zod_1 = __importDefault(require("zod"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const drizzle_orm_1 = require("drizzle-orm");
const websocket_1 = __importDefault(require("@fastify/websocket"));
const cors_1 = __importDefault(require("@fastify/cors"));
const db_1 = require("./db");
const schema_1 = require("./db/schema");
const observer_1 = require("./lib/observer");
const login_1 = require("./main/factories/controller/login");
const fastify_route_adapter_1 = require("./main/adapter/fastify-route-adapter");
const app = (0, fastify_1.default)().withTypeProvider();
const observer = new observer_1.Observer();
app.register(cors_1.default, {
    origin: '*',
});
app.register(websocket_1.default);
app.setValidatorCompiler(fastify_type_provider_zod_1.validatorCompiler);
app.setSerializerCompiler(fastify_type_provider_zod_1.serializerCompiler);
app.post('/login', {
    schema: {
        body: zod_1.default.object({
            email: zod_1.default.string().email(),
            password: zod_1.default.string().min(6),
        }),
    },
}, (0, fastify_route_adapter_1.adaptFastifyRoute)((0, login_1.makeLoginController)()));
app.post('/users', {
    schema: {
        body: zod_1.default.object({
            name: zod_1.default.string().min(4),
            email: zod_1.default.string().email(),
            password: zod_1.default.string().min(6),
            role: zod_1.default
                .enum(['participante', 'visualizador', 'organizador'])
                .default('participante'),
        }),
    },
}, async (req, reply) => {
    const { name, email, password, role } = req.body;
    const userAlreadyExists = await db_1.db
        .select({ email: schema_1.users.email })
        .from(schema_1.users)
        .where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
    if (userAlreadyExists[0]) {
        return reply
            .status(409)
            .send({ message: 'Email already exists in system!' });
    }
    const passwordHashed = await bcrypt_1.default.hash(password, 12);
    const [user] = await db_1.db
        .insert(schema_1.users)
        .values({ name, email, password: passwordHashed, role })
        .returning();
    return reply.send({ user });
});
app.post('/events', {
    schema: {
        body: zod_1.default.object({
            title: zod_1.default.string().min(1),
            description: zod_1.default.string(),
            eventType: zod_1.default.enum(['online', 'presencial', 'híbrido']),
            startDate: zod_1.default.coerce.date(),
            endDate: zod_1.default.coerce.date(),
            location: zod_1.default.string().min(2),
            availableSlots: zod_1.default.coerce.number().min(1),
            status: zod_1.default.enum(['ativo', 'cancelado']),
            organizerId: zod_1.default.string().cuid2(),
        }),
    },
}, async (req, reply) => {
    const { title, description, location, availableSlots, eventType, status, startDate, endDate, organizerId, } = req.body;
    const [event] = await db_1.db
        .insert(schema_1.events)
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
});
app.put('/event/:eventId', {
    schema: {
        params: zod_1.default.object({
            eventId: zod_1.default.string().cuid2(),
        }),
        body: zod_1.default.object({
            title: zod_1.default.string().min(1),
            description: zod_1.default.string(),
            eventType: zod_1.default.enum(['online', 'presencial', 'híbrido']),
            startDate: zod_1.default.coerce.date(),
            endDate: zod_1.default.coerce.date(),
            location: zod_1.default.string().min(2),
            availableSlots: zod_1.default.coerce.number().min(1),
            status: zod_1.default.enum(['ativo', 'cancelado']),
            organizerId: zod_1.default.string().cuid2(),
        }),
    },
}, async (req, reply) => {
    const { title, description, location, availableSlots, eventType, status, startDate, endDate, organizerId, } = req.body;
    const { eventId } = req.params;
    const [event] = await db_1.db
        .update(schema_1.events)
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
        .where((0, drizzle_orm_1.eq)(schema_1.events.id, eventId))
        .returning();
    return reply.send({ event });
});
app.patch('/event/:eventId/cancel', {
    schema: {
        params: zod_1.default.object({
            eventId: zod_1.default.string().cuid2(),
        }),
        body: zod_1.default.object({
            userId: zod_1.default.string().cuid2()
        })
    },
}, async (req, reply) => {
    const { eventId } = req.params;
    const { userId } = req.body;
    const [event] = await db_1.db
        .update(schema_1.events)
        .set({
        status: 'cancelado',
    })
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.id, eventId), (0, drizzle_orm_1.eq)(schema_1.events.organizerId, userId)))
        .returning();
    console.log(event);
    if (!event) {
        return reply.status(400).send({ message: 'this event are not your!' });
    }
    return reply.send({ event });
});
app.delete('/event/:eventId/:userId', {
    schema: {
        params: zod_1.default.object({
            eventId: zod_1.default.string().cuid2(),
            userId: zod_1.default.string().cuid2()
        })
    },
}, async (req, reply) => {
    const { eventId, userId } = req.params;
    const [event] = await db_1.db
        .delete(schema_1.events)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.events.id, eventId), (0, drizzle_orm_1.eq)(schema_1.events.organizerId, userId)))
        .returning();
    if (!event) {
        return reply.status(400).send({ message: 'this event are not your!' });
    }
    return reply.send({ event });
});
app.patch('/event/:eventId/subscribe', {
    schema: {
        params: zod_1.default.object({
            eventId: zod_1.default.string().cuid2(),
        }),
        body: zod_1.default.object({
            userId: zod_1.default.string().cuid2(),
        }),
    },
}, async (req, reply) => {
    const { userId } = req.body;
    const { eventId } = req.params;
    const eventAvailableSlotsCount = db_1.db.$with('event_available_slots_count').as(db_1.db
        .select({
        eventId: schema_1.registration.eventId,
        slotsCount: (0, drizzle_orm_1.sql) `COUNT(${schema_1.registration.id})`.as('slotsCount'),
    })
        .from(schema_1.registration)
        .where((0, drizzle_orm_1.eq)(schema_1.registration.eventId, eventId))
        .groupBy(schema_1.registration.eventId));
    const result = await db_1.db
        .with(eventAvailableSlotsCount)
        .select({
        isAvailable: (0, drizzle_orm_1.sql) `COALESCE(${schema_1.events.availableSlots}, 0) > COALESCE(${eventAvailableSlotsCount.slotsCount}, 0)`,
    })
        .from(schema_1.events)
        .leftJoin(eventAvailableSlotsCount, (0, drizzle_orm_1.eq)(schema_1.events.id, eventAvailableSlotsCount.eventId))
        .where((0, drizzle_orm_1.eq)(schema_1.events.id, eventId))
        .limit(1);
    const { isAvailable } = result[0];
    if (!isAvailable) {
        return reply
            .status(410)
            .send({ message: 'this spots for this event are sold out.' });
    }
    const [alreadySubscribed] = await db_1.db.select().from(schema_1.registration).where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.registration.userId, userId), (0, drizzle_orm_1.eq)(schema_1.registration.eventId, eventId)));
    if (alreadySubscribed) {
        return reply.status(403).send({ error: 'You cannot register for an event that you have already registered for.' });
    }
    const [data] = await db_1.db
        .insert(schema_1.registration)
        .values({
        userId,
        eventId,
    })
        .returning();
    return reply.send({ registration: data });
});
app.patch('/event/:eventId/unsubscribe', {
    schema: {
        params: zod_1.default.object({
            eventId: zod_1.default.string().cuid2(),
        }),
        body: zod_1.default.object({
            userId: zod_1.default.string().cuid2(),
        }),
    },
}, async (req, reply) => {
    const { userId } = req.body;
    const { eventId } = req.params;
    await db_1.db
        .delete(schema_1.registration)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.registration.eventId, eventId), (0, drizzle_orm_1.eq)(schema_1.registration.userId, userId)));
    return reply.status(204).send();
});
app.get('/events', async (req, reply) => {
    const eventAvailableSlotsCount = db_1.db.$with('event_available_slots_count').as(db_1.db
        .select({
        eventId: schema_1.registration.eventId,
        slotsCount: (0, drizzle_orm_1.sql) `COUNT(${schema_1.registration.id})`.as('slotsCount'),
    })
        .from(schema_1.registration)
        .groupBy(schema_1.registration.eventId));
    const result = await db_1.db
        .with(eventAvailableSlotsCount)
        .select({
        id: schema_1.events.id,
        title: schema_1.events.title,
        description: schema_1.events.description,
        location: schema_1.events.location,
        availableSlots: schema_1.events.availableSlots,
        occupiedVacancies: (0, drizzle_orm_1.sql) `COALESCE(${eventAvailableSlotsCount.slotsCount}, 0)`.mapWith(Number),
        eventType: schema_1.events.eventType,
        status: schema_1.events.status,
        startDate: schema_1.events.startDate,
        endDate: schema_1.events.endDate,
        organizer: {
            id: schema_1.users.id,
            name: schema_1.users.name
        },
    })
        .from(schema_1.events)
        .leftJoin(eventAvailableSlotsCount, (0, drizzle_orm_1.eq)(eventAvailableSlotsCount.eventId, schema_1.events.id))
        .leftJoin(schema_1.users, (0, drizzle_orm_1.eq)(schema_1.users.id, schema_1.events.organizerId));
    return reply.send(result);
});
app.register(async (fastify) => {
    fastify.get('/notify', { websocket: true }, async function wsHandler(socket, req) {
        const { eventId } = req.params;
        observer.subscribe(socket, eventId);
        socket.onmessage = () => { };
        socket.onclose = () => {
            observer.unsubscribe(socket, eventId);
        };
    });
});
app.listen({ port: 3333, host: '0.0.0.0' }, (err, address) => {
    console.log(`🚀 server listening on ${address}`);
});
