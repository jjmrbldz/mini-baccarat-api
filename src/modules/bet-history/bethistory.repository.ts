import { count, desc, eq } from "drizzle-orm";
import { baccaratBetHistory, baccaratTournamentBetHistory, db } from "../../db";
import { BacBetHistoryInsert, Tx } from "../../types";


export async function insertBetHistory(tx: Tx, data: BacBetHistoryInsert) {
  const returningId = await tx
    .insert(baccaratBetHistory)
    .values(data)
    .$returningId();

  return returningId[0].id;
}

export async function insertTournamentBetHistory(tx: Tx, data: BacBetHistoryInsert) {
  const returningId = await tx
    .insert(baccaratTournamentBetHistory)
    .values(data)
    .$returningId();

  return returningId[0].id;
}

export async function getBetHistory(userId: number, page = 1, pageSize = 5) {
  const countRows = await db
    .select({ count: count() })
    .from(baccaratBetHistory)
    .where(eq(baccaratBetHistory.userId, userId))

  const totalItems = countRows[0].count;

  const result = await db
    .select()
    .from(baccaratBetHistory)
    .where(eq(baccaratBetHistory.userId, userId))
    .orderBy(desc(baccaratBetHistory.id))
    .limit((pageSize))
    .offset((page - 1) * pageSize);

  return {
    totalItems,
    data: result,
  }
}