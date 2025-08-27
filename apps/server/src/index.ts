import dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import websocket from "@fastify/websocket";
import cors from "@fastify/cors";

import { env } from "./config/env";
import { errorHandler } from "./main/handlers/error-handler";
import { authMiddleware } from "./main/middlewares/auth-middleware";

import { registerRoutes as registerUserRoutes } from "./routes/users";
import { registerRoutes as registerEventRoutes } from "./routes/events";

const app = Fastify().withTypeProvider<ZodTypeProvider>();

app.register(cors, { origin: "*" });
app.register(websocket);
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Middlewares
errorHandler(app);
authMiddleware(app);

// Domain routes
registerUserRoutes(app);
registerEventRoutes(app);

const PORT = env.PORT || 3000;

app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }

  app.log.info(`🚀 server listening on ${address}`);
});
