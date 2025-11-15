import { FastifyReply, FastifyRequest } from "fastify";
import * as service from "./auth.service";
import { TOpenGameBody } from "./auth.schema";
import { MODULE_SERVICE_CODES, MODULE_SERVICE_MESSAGE } from "../../constants";
import { getToken } from "../../utils";

export async function requireAuth(
  req: FastifyRequest,
  reply: FastifyReply
) {
  if (req.method === "OPTIONS") return;
  const token = getToken(req);
  if (!token) return reply.code(401).send({ message: "Missing token" });

  try {
    const payload = await service.verifyToken(token);
    req.authUser = { token, payload };
    // return reply.send(result);
  } catch (err: any) {
    if (err?.code === MODULE_SERVICE_CODES["invalidToken"]) {
      return reply.code(401).send({ message: "Invalid or expired token." });
    }
    req.log.error(err);
    return reply.code(500).send({ message: "Internal server error." });
  }
}

export async function openGame(
  req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    const body = req.body as TOpenGameBody
    const result = await service.openGame(body, req);
    return reply.send(result);
  } catch (err: any) {
    if (err?.code === MODULE_SERVICE_CODES["invalidCredentials"]) {
      return reply.code(401).send({ message: "Invalid credentials." });
    }
    req.log.error(err);
    return reply.code(500).send({ message: "Internal server error." });
  }
}

