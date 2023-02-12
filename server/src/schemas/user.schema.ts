import { z } from 'zod';

export const changeUserPasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string({
      required_error: 'Password is required',
    }),
    newPassword: z
      .string({
        required_error: 'Password is required',
      })
      .min(8, {
        message: 'Password must be at least 8 characters',
      }),
  }),
});
