import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { boolean, datetime, double, int, mysqlTable, tinyint, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable('T_USER', {
  id: int("id").autoincrement().notNull().primaryKey(),
  username: varchar("tu_username", { length: 255 }).notNull().unique(),
  password: varchar("tu_password", { length: 100 }).notNull(),
  name: varchar("tu_real_name", { length: 100 }).notNull(),
  nickname: varchar("tu_nickname", { length: 100 }).notNull(),
  email: varchar("tu_email", { length: 100 }),
  level: int("tu_level"),
  status: int("tu_status"),
  phone: varchar("tu_phone", { length: 100 }),
  accountNumber: varchar("tu_account_number", { length: 100 }),
  bankName: varchar("tu_bank_name", { length: 100 }),
  regDatetime: datetime("tu_reg_datetime"),
  approvedDatetime: varchar("tu_approved_datetime", { length: 100 }),
  withdrawnDatetime: varchar("tu_withdrawn_datetime", { length: 100 }),
  lastLogin: datetime("tu_last_login"),
  regIp: varchar("tu_reg_ip", { length: 100 }),
  lastLoginIp: varchar("tu_last_login_ip", { length: 100 }),
  grade: varchar("tu_grade", { length: 100 }),
  balance: double("tu_balance"),
  point: double("tu_point"),
  referralUsername: varchar("tu_referral_username", { length: 100 }),
  group: varchar("tu_group", { length: 100 }),
  token: varchar("tu_token", { length: 255 }),
  exp: double("tu_exp"),
  emailOptin: boolean("tu_email_optin"),
  isBlocked: tinyint("tu_is_blocked").default(0),
  isWithdrawn: tinyint("tu_is_withdrawn").default(0),
  isEditor: tinyint("tu_is_editor").default(0),
})

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;