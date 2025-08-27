import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  interface FastifyRequest {
    userId: string;
  }
}

export function authMiddleware(app: FastifyInstance) {
  app.decorate(
    "authenticate",
    async (req: FastifyRequest, reply: FastifyReply) => {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      const [, token] = authHeader.split(" ");

      if (!token) {
        return reply.status(401).send({ error: "Unauthorized" });
      }

      req.userId = token;
    },
  );
}
