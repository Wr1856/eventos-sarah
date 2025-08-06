import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";

const errorMap: Record<string, number> = {
  "You're not allowed": 403,
  "This event are not your!": 403,
  "You are not allowed to subscribe in event": 403,
  "The data provided is invalid.": 401,
};

export function errorHandler(app: FastifyInstance) {
  app.setErrorHandler((error, _req, reply) => {
    app.log.error(error);

    if (error instanceof ZodError) {
      return reply.status(400).send({
        message: "Validation error",
        issues: error.format(),
      });
    }

    const statusCode = error.statusCode ?? errorMap[error.message] ?? 500;

    return reply.status(statusCode).send({
      message: statusCode === 500 ? "Internal server error" : error.message,
    });
  });
}

