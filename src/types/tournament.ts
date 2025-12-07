import { z } from "zod/v4";
import { tournamentRegisterSchema } from "../modules/tournament/tournament.schema";

export type TournamentRegisterSchema = z.infer<typeof tournamentRegisterSchema>;