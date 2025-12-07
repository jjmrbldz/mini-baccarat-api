import { sql } from "drizzle-orm";
import { mysqlTable, bigint, varchar, int, datetime, tinyint } from "drizzle-orm/mysql-core";

export const minigameSettings = mysqlTable("T_MINIGAME_SETTINGS", {
  id: bigint("id", { mode: "number" }).primaryKey().autoincrement(),

  settingsId: varchar("tms_id", { length: 100 }),
  name: varchar("tms_name", { length: 100 }),
  moneyOptions: varchar("tms_money_options", { length: 100 }),

  registrationFee: int("tms_registration_fee"),
  minBet: int("tms_min_bet"),
  maxBet: int("tms_max_bet"),

  scheduleOpen: datetime("tms_schedule_open"),
  scheduleClose: datetime("tms_schedule_close"),

  status: tinyint("tms_status"),

  createdAt: datetime("tms_created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: datetime("tms_updated_at"),

  updatedBy: int("tms_updated_by"),
});
