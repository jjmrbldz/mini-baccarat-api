import { Groups } from "../db";

export type TokenPayload = {
  id: number;
  username: string;
  level: number;
  expiresAt: Date;
  group: Groups;
  minBet: number;
  maxBet: number;
  minBetTournament: number;
  maxBetTournament: number;
}