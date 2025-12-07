import { FastifyRequest } from "fastify";
import { TournamentRegisterSchema } from "../../types";
import * as userRepo from "../user/user.repository";
import * as settingsRepo from "../minigame/minigame.repository"
import * as pointsRepo from "../point-log/points.repository";
import { db, minigameSettings } from "../../db";
import { getTableName } from "drizzle-orm";
import { MODULE_SERVICE_CODES } from "../../constants";

export async function registerTournament(request: FastifyRequest, body: TournamentRegisterSchema) {
  if (!request.authUser?.token) throw { statusCode: 401, code: MODULE_SERVICE_CODES["invalidToken"] };
  const user = request.authUser?.payload;
  if (!user || !user.id || !user.group)  throw { statusCode: 404, code: MODULE_SERVICE_CODES["userNotFound"] };


  const [settings] = await settingsRepo.getMinigameSettings(body.tournamentId);
  const {registrationFee, settingsId, id} = settings;

  const checkIsRegistered = await pointsRepo.checkTournamentRegistration(user.id, settingsId!, user.group);

  if (checkIsRegistered && checkIsRegistered.length > 0) throw { statusCode: 400, message: "Already registered" }
  const pointsBefore = await pointsRepo.findUserLatestPoints(user.id, user.group);


  if (pointsBefore < (registrationFee || 0)) throw { statusCode: 400, message: "Insufficient points." }

  const pointsAfter = pointsBefore - (registrationFee || 0);

  await db.transaction(async (tx) => {
    await pointsRepo.insertPointLog(tx, {
      userId: user.id,
      type: "deduct",
      amount: registrationFee,
      prevBalance: pointsBefore,
      afterBalance: pointsAfter,
      note: settingsId!,
      note2: "registration",
      note3: "",
      referenceTable: getTableName(minigameSettings),
      referenceId: id
    }, user.group!)

    await userRepo.updateUserPoints(tx, user.id, pointsAfter);
  });

  return {
    statusCode: 200,
    message: "Tournament registration success!"
  }
}

export async function checkRegistration(request: FastifyRequest, body: TournamentRegisterSchema) {
  if (!request.authUser?.token) throw { statusCode: 401, code: MODULE_SERVICE_CODES["invalidToken"] };
  const user = request.authUser?.payload;
  if (!user || !user.id || !user.group)  throw { statusCode: 404, code: MODULE_SERVICE_CODES["userNotFound"] };

  const [settings] = await settingsRepo.getMinigameSettings(body.tournamentId);
  const {settingsId} = settings;

  const checkIsRegistered = await pointsRepo.checkTournamentRegistration(user.id, settingsId!, user.group);

  return {
    statusCode: 200,
    data: {
      isRegistered: checkIsRegistered && checkIsRegistered.length > 0 ? true : false,
    },
    message: "Checking success."
  }
}