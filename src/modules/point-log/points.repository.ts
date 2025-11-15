import { desc, eq } from "drizzle-orm";
import { db, Groups, pointLogTables } from "../../db";
import { Tx } from "../../types";
import { UserPointLogInsert } from "../../types/point-logs";


export async function findUserLatestPoints(userId: number, userGroup: Groups) {
  const pointLogs = pointLogTables[userGroup];

  const res =  await db
    .select({afterBalance: pointLogs.afterBalance})
    .from(pointLogs)
    .where(eq(pointLogs.userId, userId))
    .orderBy(desc(pointLogs.regDatetime))
    .limit(1);

  return res[0] ? (res[0].afterBalance || 0) : 0
}

export async function insertPointLog(tx: Tx, data: UserPointLogInsert<"A">, userGroup: Groups) {
  const pointLogs = pointLogTables[userGroup];
  const returningId = await tx
    .insert(pointLogs)
    .values(data)
    .$returningId();

  return returningId[0].id;
}