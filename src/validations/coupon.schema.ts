import { z } from 'zod';

export const CreateCouponSchema = z.object({
  body: z.object({
    couponCode: z
      .string({
        required_error: 'Coupon code is required',
        invalid_type_error: 'Coupon code must be a string',
      })
      .trim()
      .min(5, {
        message: 'Coupon code must be atleast 5 characters long',
      }),
    isActive: z.boolean().optional(),
    discount: z.number().optional(),
    expires: z.date().optional(),
  }),
});

export const updateCouponSchema = CreateCouponSchema.deepPartial();

export const CouponParamsSchema = z.object({
  params: z.object({
    couponCode: z.string().regex(/(ObjectId\(')?[0-9a-fA-F]{24}('\))?/g, {
      message: 'Invalid couponCode Id',
    }),
  }),
});

export const ApplyCouponSchema = z.object({
  body: z.object({
    couponCode: z.string().trim().min(5, {
      message: 'Coupon code is not valid',
    }),
    orderTotal: z.number(),
  }),
});
