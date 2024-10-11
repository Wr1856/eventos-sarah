"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registration = exports.events = exports.users = exports.statusEnum = exports.eventTypes = exports.rolesEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const t = __importStar(require("drizzle-orm/pg-core"));
const cuid2_1 = require("@paralleldrive/cuid2");
exports.rolesEnum = (0, pg_core_1.pgEnum)('roles', [
    'participante',
    'visualizador',
    'organizador',
]);
exports.eventTypes = (0, pg_core_1.pgEnum)('event_type', [
    'online',
    'presencial',
    'híbrido',
]);
exports.statusEnum = (0, pg_core_1.pgEnum)('status', ['ativo', 'cancelado']);
exports.users = (0, pg_core_1.pgTable)('users', {
    id: t
        .text('id')
        .primaryKey()
        .$defaultFn(() => (0, cuid2_1.createId)()),
    name: t.text('name').notNull(),
    email: t.text('email').unique().notNull(),
    password: t.text('password').notNull(),
    role: (0, exports.rolesEnum)().notNull().default('participante'),
    createdAt: t.timestamp('created_at').notNull().defaultNow(),
});
exports.events = (0, pg_core_1.pgTable)('events', {
    id: t
        .text('id')
        .primaryKey()
        .$defaultFn(() => (0, cuid2_1.createId)()),
    title: t.text('title').notNull(),
    description: t.text('description').notNull(),
    startDate: t.timestamp('start_date').notNull(),
    endDate: t.timestamp('end_date').notNull(),
    location: t.text('location').notNull(),
    availableSlots: t.integer('available_slots'),
    eventType: (0, exports.eventTypes)('event_type').notNull(),
    status: (0, exports.statusEnum)('status').default('ativo').notNull(),
    organizerId: t
        .text('organizer_id')
        .references(() => exports.users.id)
        .notNull(),
});
exports.registration = (0, pg_core_1.pgTable)('registration', {
    id: t
        .text('id')
        .primaryKey()
        .$defaultFn(() => (0, cuid2_1.createId)()),
    userId: t
        .text('user_id')
        .references(() => exports.users.id)
        .notNull(),
    eventId: t
        .text('event_id')
        .references(() => exports.events.id)
        .notNull(),
    registrationDate: t.timestamp('registration_date').notNull().defaultNow(),
});
