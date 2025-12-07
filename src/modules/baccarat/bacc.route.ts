import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import * as authController from "../auth/auth.controller";
import * as controller from "./bacc.controller";
import { PlaceBetBody } from "./bacc.schema";
import { tournamentRegisterSchema } from "../tournament/tournament.schema";

export const baccaratRoutes: FastifyPluginAsync = async (app) => {
  const fastify = app.withTypeProvider<ZodTypeProvider>();

  fastify.post(
    "/bet",
    {
      preHandler: authController.requireAuth,
      schema: {
        body: PlaceBetBody,
        tags: ["auth"],
      },
    },
    controller.bet
  );

  fastify.get(
  "/settings/:tournamentId",
  {
    preHandler: authController.requireAuth,
    schema: {
      params: tournamentRegisterSchema,
      tags: ["tournament"],
    },
  },
  controller.getSettings
);
}