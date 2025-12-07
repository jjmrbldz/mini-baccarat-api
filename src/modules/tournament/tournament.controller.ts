import { FastifyReply, FastifyRequest } from "fastify";
import * as service from "./tournament.service";
import { MODULE_SERVICE_CODES, MODULE_SERVICE_MESSAGE } from "../../constants";
import { TournamentRegisterSchema } from "../../types";


export async function registerTournament(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const body = req.body as TournamentRegisterSchema

    const result = await service.registerTournament(req, body);
    return reply.send(result);
  } catch (err: any) {
    console.error(err)
    if (err?.code === MODULE_SERVICE_CODES["invalidCredentials"]) {
      return reply.code(401).send({ message: "Invalid credentials." });
    }
    if (err?.code === MODULE_SERVICE_CODES["userNotFound"]) {
      return reply.code(404).send({ message: MODULE_SERVICE_MESSAGE["userNotFound"] });
    }
    if (err?.statusCode === 400) {
      return reply.code(400).send({ message: err?.message });
    }
    req.log.error(err);
    return reply.code(500).send({ message: "Internal server error." });
  }
}

export async function checkRegistration(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const body = req.params as TournamentRegisterSchema

    const result = await service.checkRegistration(req, body);
    return reply.send(result);
  } catch (err: any) {
    console.error(err)
    if (err?.code === MODULE_SERVICE_CODES["invalidCredentials"]) {
      return reply.code(401).send({ message: "Invalid credentials." });
    }
    if (err?.code === MODULE_SERVICE_CODES["userNotFound"]) {
      return reply.code(404).send({ message: MODULE_SERVICE_MESSAGE["userNotFound"] });
    }
    if (err?.statusCode === 400) {
      return reply.code(400).send({ message: err?.message });
    }
    req.log.error(err);
    return reply.code(500).send({ message: "Internal server error." });
  }
}

