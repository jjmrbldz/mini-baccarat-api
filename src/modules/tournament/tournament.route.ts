import { FastifyPluginAsync } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import * as authController from "../auth/auth.controller";
import * as controller from "./tournament.controller"
import { tournamentRegisterSchema } from "./tournament.schema";

export const tournamentRoutes: FastifyPluginAsync = async (app) => {
  const fastify = app.withTypeProvider<ZodTypeProvider>();

  fastify.post(
    "/register",
    {
      preHandler: authController.requireAuth,
      schema: {
        body: tournamentRegisterSchema,
        tags: ["tournament"],
      },
    },
    controller.registerTournament
  );
  fastify.get(
    "/check/:tournamentId",
    {
      preHandler: authController.requireAuth,
      schema: {
        params: tournamentRegisterSchema,
        tags: ["tournament"],
      },
    },
    controller.checkRegistration
  );
}