import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import * as controller from "./user.controller";
import * as authController from "../auth/auth.controller";

export const userRoutes: FastifyPluginAsync = async (app) => {
  const fastify = app.withTypeProvider<ZodTypeProvider>();


  fastify.get(
    "/me",
    { 
      preHandler: authController.requireAuth,
      schema: {
        tags: ["auth"],
      },
    },
    controller.getUser
  );
}