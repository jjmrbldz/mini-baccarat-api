import { z } from "zod/v4";


export const tournamentRegisterSchema = z.object({
  tournamentId: z.coerce.number(),
});