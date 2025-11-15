import { FastifyRequest } from "fastify";
import * as repo from "./bethistory.repository"
import { MODULE_SERVICE_CODES } from "../../constants";
import { WithPagination } from "../../types";

export async function getBetHistory(request: FastifyRequest, queryParams?: WithPagination, ) {
  const userId = request.authUser?.payload.id;
  if (!userId) throw { code: MODULE_SERVICE_CODES["userNotFound"] };

  const { 
    totalItems, 
    data 
  } = await repo
    .getBetHistory(
      userId, 
      Number(queryParams?.page || "1"), 
      Number(queryParams?.pageSize || "1")
    );

  return { 
    statusCode: 200, 
    data,
    totalItems,
    message: "Success!" 
  }
}