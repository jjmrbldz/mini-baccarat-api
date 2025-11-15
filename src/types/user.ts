import { users } from "../db";

export type User = typeof users.$inferSelect; 
export type UserInsert = typeof users.$inferInsert; 