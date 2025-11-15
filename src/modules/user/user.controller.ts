import { FastifyReply, FastifyRequest } from "fastify";
import * as service from "./user.service"
import { MODULE_SERVICE_CODES } from "../../constants";

export async function getUser(
  req: FastifyRequest,
  reply: FastifyReply
) {
  if (!req.authUser?.token) return reply.code(401).send({ message: "Invalid or expired token." });

  try {
    const result = await service.getUser(req);
    return reply.send(result);
  } catch (err: any) {
    if (err?.code === MODULE_SERVICE_CODES["invalidToken"]) {
      return reply.code(401).send({ message: "Invalid or expired token." });
    }
    if (err?.cause) {
      return reply.code(500).send({ message: "Internal server error.", description: err.cause.sqlMessage });
    }
    return reply.code(500).send({ message: "Internal server error.", description: err.message });
  }
}