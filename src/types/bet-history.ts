import { baccaratBetHistory } from "../db";


export type BacBetHistory = typeof baccaratBetHistory.$inferSelect; 
export type BacBetHistoryInsert = typeof baccaratBetHistory.$inferInsert;