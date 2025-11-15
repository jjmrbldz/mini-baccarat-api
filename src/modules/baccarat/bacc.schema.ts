import { z } from 'zod/v4';

const Bet = z.object({
  betOption: z.string().min(1, "Bet option is required."),
  betAmount: z.number()
    .int()
    .positive("must be a valid and positive number")
    .min(10, "Minimum bet amount is 10"),
})

export const PlaceBetBody = z
  .array(Bet)
  .min(1, "At least one bet is required.");

export type TBetBody = z.infer<typeof PlaceBetBody>;