import { FastifyReply, FastifyRequest } from "fastify";
import * as service from "./bethistory.service"
import { MODULE_SERVICE_CODES } from "../../constants";
import { WithPagination } from "../../types";

export async function getBetHistory(
  req: FastifyRequest,
  reply: FastifyReply
) {
  if (!req.authUser?.token) return reply.code(401).send({ message: "Invalid or expired token." });

  try {
    const queryParams = req.query as WithPagination
    
    const result = await service.getBetHistory(req, queryParams);
    return reply.send(result);
  } catch (err: any) {
    console.error(err)
    if (err?.code === MODULE_SERVICE_CODES["invalidToken"]) {
      return reply.code(401).send({ message: "Invalid or expired token." });
    }
    if (err?.cause) {
      return reply.code(500).send({ message: "Internal server error.", description: err.cause.sqlMessage });
    }
    return reply.code(500).send({ message: "Internal server error.", description: err.message });
  }
}