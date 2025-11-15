import { and, eq } from "drizzle-orm";
import { db, users } from "../../db";

export async function findUserToken(userId: number, token: string) {
  const user = await db
    .select({
      userId: users.id,
      username: users.username,
      group: users.group,
      point: users.point,
    })
    .from(users)
    .where(and(
      eq(users.id, userId),
      eq(users.token, token),
    ))
    .limit(1);

  return user[0] || null;
}

