import { sql } from "drizzle-orm";
import { mysqlTable, int, double, tinyint, datetime, varchar, index } from "drizzle-orm/mysql-core";

export const baccaratBetHistory = mysqlTable(
  "T_BACCARAT_BET_HISTORY",
  {
    id: int("id", { unsigned: true }).primaryKey().autoincrement(),

    userId: int("tu_id").notNull().default(0),

    betAmount: double("tbbh_bet_amount").notNull().default(0),
    winAmount: double("tbbh_win_amount").default(0),

    status: tinyint("tbbh_status").notNull().default(0),

    userCashBefore: double("tbbh_user_cashBefore").notNull().default(0),
    userCashAfter: double("tbbh_user_cashAfter").default(0),

    netLoss: double("tbbh_netLoss").default(0),

    regDatetime: datetime("tbbh_reg_datetime", { mode: "string" }).default(sql`CURRENT_TIMESTAMP`),
    updateDatetime: datetime("tbbh_update_datetime", { mode: "string" }),

    betOption: varchar("tbbh_bet_option", { length: 100 }).notNull(),

    betStatus: varchar("tbbh_bet_status", { length: 20 }).notNull().default("WAITING"),
  },
  (table) => [
    index("idx_userId").on(table.userId),
    index("idx_status").on(table.status),
    index("idx_regDatetime").on(table.regDatetime),
    index("idx_updateDatetime").on(table.updateDatetime),
    index("idx_betOption").on(table.betOption),
  ]
);
