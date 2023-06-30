// import { Types } from 'mongoose';
import { z } from 'zod';

export const registerUserSchema = z.object({
  body: z.object({
    fullName: z
      .string({
        required_error: 'Full name is required',
        invalid_type_error: 'Full name must be a string',
      })
      .trim()
      .min(5, {
        message: 'Full name must be at least 5 characters',
      })
      .max(25, 'Full name cannot be more than 25 characters'),
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email(),
    phoneNumber: z
      .string({
        required_error: 'Phone number is required',
      })
      .trim()
      .min(10, { message: 'Phone number must be at least 10 characters' })
      .max(15, {
        message: 'Phone number cannot exceed 15 characters',
      }),
    password: z
      .string({
        required_error: 'Password is required',
      })
      .trim()
      .min(8, {
        message: 'Password must be at least 8 characters',
      }),
  }),
});

export const loginUserSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email({
        message: 'Please enter a valid email address',
      }),
    password: z.string({
      required_error: 'Password is required',
    }),
  }),
});
