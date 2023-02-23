import { z } from 'zod';

export const CreateCouponSchema = z.object({
  body: z.object({
    couponCode: z
      .string({
        required_error: 'Coupon code is required',
        invalid_type_error: 'Coupon code must be a string',
      })
      .min(5, {
        message: 'Coupon code must be atleast 5 characters long',
      }),
    isActive: z.boolean().optional(),
    discount: z.number().optional(),
    expires: z.date().optional(),
  }),
});

export const updateCouponSchema = CreateCouponSchema.partial();
