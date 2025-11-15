import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { pointLogTables } from "../db";

export type PointLogGroup = keyof typeof pointLogTables;

export type UserPointLog<C extends PointLogGroup> = InferSelectModel<typeof pointLogTables[C]>;
export type UserPointLogInsert<C extends PointLogGroup> = InferInsertModel<typeof pointLogTables[C]>;