"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgUserAccountRepository = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../../../db");
const schema_1 = require("../../../db/schema");
class PgUserAccountRepository {
    async findByEmail({ email, }) {
        const [user] = await db_1.db.select().from(schema_1.users).where((0, drizzle_orm_1.eq)(schema_1.users.email, email));
        return user;
    }
}
exports.PgUserAccountRepository = PgUserAccountRepository;
