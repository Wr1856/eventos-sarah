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
import { registerRoutes as registerUserRoutes } from "./routes/users";
import { registerRoutes as registerEventRoutes } from "./routes/events";

const app = Fastify().withTypeProvider<ZodTypeProvider>();

app.register(cors, {
  origin: "*",
});
app.register(websocket);
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(registerUserRoutes);
app.register(registerEventRoutes);

const PORT = env.PORT || 3000;

app.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
  console.log(`🚀 server listening on ${address}`);
});

