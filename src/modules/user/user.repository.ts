import { eq } from "drizzle-orm";
import { db, User, users } from "../../db";
import { Tx } from "../../types";


export async function findUser(id: number) {
  return await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
}

export async function updateUserPoints(tx: Tx, userId: number, point: number,) {
  await tx.update(users)
    .set({
      point,
    })
    .where(eq(users.id, userId));
}