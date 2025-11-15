import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import * as controller from "./bethistory.controller";
import * as authController from "../auth/auth.controller";

export const betHistoryRoutes: FastifyPluginAsync = async (app) => {
  const fastify = app.withTypeProvider<ZodTypeProvider>();

  fastify.get(
    "/list",
    { 
      preHandler: authController.requireAuth,
      schema: {
        tags: ["auth"],
      },
    },
    controller.getBetHistory
  );
}