
import * as repo from "./user.repository";
import { MODULE_SERVICE_CODES } from "../../constants";
import { FastifyRequest } from "fastify";

export async function getUser(request: FastifyRequest) {
  const userId = request.authUser?.payload.id;
  if (!userId) throw { code: MODULE_SERVICE_CODES["userNotFound"] };
  const user = await repo.findUser(userId);
  if (!user[0]) throw { code: MODULE_SERVICE_CODES["userNotFound"] };

  const { 
    username, 
    point, 
    level, 
    group, 
    minBetMinigame, 
    maxBetMinigame, 
    minBetTournament, 
    maxBetTournament 
  } = user[0]

  return { 
    statusCode: 200, 
    data: { 
      username, 
      point, 
      level, 
      group, 
      minBetMinigame, 
      maxBetMinigame, 
      minBetTournament, 
      maxBetTournament 
    },
    message: "Success!" 
  }
}