import { z } from 'zod/v4';

export const OpenGameBody = z.object({
  username: z.string().min(3),
});

export const LoginOk = z.object({ token: z.string() });
export const LoginUnauthorized = z.object({ message: z.literal('Invalid credentials') });

export type TOpenGameBody = z.infer<typeof OpenGameBody>;