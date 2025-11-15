import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import * as controller from "./auth.controller";

export const authRoutes: FastifyPluginAsync = async (app) => {
  const fastify = app.withTypeProvider<ZodTypeProvider>();

  fastify.post(
    "/open-game",
    {
      preHandler: controller.requireAuth,
      schema: {
        tags: ["auth"],
      },
    },
    controller.openGame
  );
}