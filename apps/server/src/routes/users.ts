import type { FastifyInstance } from "fastify";
import z from "zod";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

import { db } from "../db";
import { users } from "../db/schema";
import { adaptFastifyRoute } from "../main/adapter/fastify-route-adapter";
import { makeLoginController } from "../main/factories/controller/login";

export async function registerRoutes(app: FastifyInstance) {
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
      const { userId } = req.params as { userId: string };
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
      const { name, email, password, role } = req.body as {
        name: string;
        email: string;
        password: string;
        role: "participante" | "visualizador" | "organizador";
      };

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
}

