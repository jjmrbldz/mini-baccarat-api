import { FastifyRequest } from "fastify";
import * as repo from "./bethistory.repository"
import { MODULE_SERVICE_CODES } from "../../constants";
import { WithPagination } from "../../types";

export async function getBetHistory(request: FastifyRequest, queryParams?: WithPagination, ) {
  const userId = request.authUser?.payload.id;
  if (!userId) throw { code: MODULE_SERVICE_CODES["userNotFound"] };

  let totalItems: number;
  let data: {
    id: number;
    userId: number;
    betAmount: number;
    winAmount: number | null;
    status: number;
    userCashBefore: number;
    userCashAfter: number | null;
    netLoss: number | null;
    regDatetime: string | null;
    updateDatetime: string | null;
    betOption: string;
    betStatus: string;
    betDetails: unknown;
  }[];

  const isTournament = queryParams?.isTournament === "true";

  if (!isTournament) {
    const result  = await repo
      .getBetHistory(
        userId, 
        Number(queryParams?.page || "1"), 
        Number(queryParams?.pageSize || "1")
      );
    
    totalItems = result.totalItems;
    data = result.data;
  } else {
    const result  = await repo
      .getBetHistoryTournament(
        userId, 
        Number(queryParams?.page || "1"), 
        Number(queryParams?.pageSize || "1")
      );
    
    totalItems = result.totalItems;
    data = result.data;
  }

  return { 
    statusCode: 200, 
    data,
    totalItems,
    message: "Success!" 
  }
}