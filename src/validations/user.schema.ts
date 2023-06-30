import { z } from 'zod';

export const changeUserPasswordSchema = z.object({
  body: z.object({
    oldPassword: z
      .string({
        required_error: 'Password is required',
      })
      .trim(),
    newPassword: z
      .string({
        required_error: 'Password is required',
      })
      .trim()
      .min(8, {
        message: 'Password must be at least 8 characters',
      }),
  }),
});
