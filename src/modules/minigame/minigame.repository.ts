import { eq } from "drizzle-orm";
import { db, minigameSettings } from "../../db";


export async function getMinigameSettings(id: number) {
  return await db
    .select()
    .from(minigameSettings)
    .where(eq(minigameSettings.id, id))
}