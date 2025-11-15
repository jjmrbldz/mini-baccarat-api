import { TOpenGameBody } from "./auth.schema";
import * as repo from "./auth.repository";
import { decryptToken } from "../../utils";
import { MODULE_SERVICE_CODES } from "../../constants";
import { FastifyRequest } from "fastify";

export async function verifyToken(token: string) {
  const validToken = await decryptToken(token);
  if (!validToken) throw { code: MODULE_SERVICE_CODES["invalidToken"] };

  const userToken = await repo.findUserToken(validToken.id, token);
  if (!userToken) throw { code: MODULE_SERVICE_CODES["invalidToken"] };

  return validToken
}

export async function openGame(data: TOpenGameBody, request: FastifyRequest) {
  const token = request.authUser?.token;
  if (!token) throw { code: MODULE_SERVICE_CODES["invalidToken"] };
  const user = await verifyToken(token);

  if (user.username !== data.username) throw { code: MODULE_SERVICE_CODES["invalidToken"] };

  return { 
    statusCode: 200, 
    data: { token },
    message: "Open game success!" }
}