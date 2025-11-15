import { InferSelectModel, sql } from "drizzle-orm";
import { datetime, index, int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { Groups } from "./user-group";

function createPointLogTable(name: `T_USER_POINT_LOG_${Groups}`) {
  return mysqlTable(name.toUpperCase(), {
    id: int("id", { unsigned: true }).autoincrement().notNull().primaryKey(),
    userId: int("tu_id").notNull(),
    type: varchar("tup_type", { length: 100 }).notNull(),
    amount: int("tup_amount").default(0),
    prevBalance: int("tup_prev_balance").default(0),
    afterBalance: int("tup_after_balance").default(0),
    note: varchar("tup_note", { length: 100 }).notNull(),
    note2: varchar("tup_note2", { length: 100 }).notNull(),
    note3: varchar("tup_note3", { length: 100 }).notNull(),
    regDatetime: datetime("tup_reg_datetime").default(sql`CURRENT_TIMESTAMP`),
    referenceTable: varchar("tup_reference_table", { length: 100 }).notNull().default(""),
    referenceId: int("tup_reference_id").notNull().default(0),
  },
  (t) => ([
    index(`${name}_IdxId`).on(t.id),
    index(`${name}_IdxTuId`).on(t.userId),
    index(`${name}_IdxType`).on(t.type),
    index(`${name}_IdxNote`).on(t.note),
    index(`${name}_IdxNote2`).on(t.note2),
    index(`${name}_IdxNote3`).on(t.note3),
    index(`${name}_IdxRegDatetime`).on(t.regDatetime),
    index(`${name}_IdxReferenceTable`).on(t.referenceTable),
    index(`${name}_IdxReferenceId`).on(t.referenceId),
  ]))
}

export const pointLogTables = {
  A: createPointLogTable("T_USER_POINT_LOG_A"),
  B: createPointLogTable("T_USER_POINT_LOG_B"),
  C: createPointLogTable("T_USER_POINT_LOG_C"),
  D: createPointLogTable("T_USER_POINT_LOG_D"),
  E: createPointLogTable("T_USER_POINT_LOG_E"),
} as const;

