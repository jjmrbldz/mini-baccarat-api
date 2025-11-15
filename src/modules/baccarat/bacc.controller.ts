import { FastifyReply, FastifyRequest } from "fastify";
import * as service from "./bacc.service";
import { TBetBody } from "./bacc.schema";
import { MODULE_SERVICE_CODES, MODULE_SERVICE_MESSAGE } from "../../constants";


export async function bet(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const body = req.body as TBetBody
    const result = await service.bet(body, req);
    return reply.send(result);
  } catch (err: any) {
    if (err?.code === MODULE_SERVICE_CODES["invalidCredentials"]) {
      return reply.code(401).send({ message: "Invalid credentials." });
    }
    if (err?.code === MODULE_SERVICE_CODES["userNotFound"]) {
      return reply.code(404).send({ message: MODULE_SERVICE_MESSAGE["userNotFound"] });
    }
    req.log.error(err);
    return reply.code(500).send({ message: "Internal server error." });
  }
}

