// address,
//       phoneNumber,
//       paymentMethod,
//       total,
//       coupon,
//       transactionId,
//       products,

import { z } from 'zod';

export const CreateOrderSchema = z.object({
  body: z.object({
    address: z.string().regex(/(ObjectId\(')?[0-9a-fA-F]{24}('\))?/g, {
      message: 'Invalid Coupon Id',
    }),
    phoneNumber: z
      .string({
        required_error: 'Phone number is required',
        invalid_type_error: 'Phone number must be a string',
      })
      .min(10, {
        message: 'Phone number must be at least 10 characters',
      })
      .max(15, 'Phone number cannot be more than 15 characters')
      .trim(),
    paymentMethod: z.string({
      required_error: 'Payment method is required',
      invalid_type_error: 'Payment method must be a string',
    }),
    total: z.number({
      required_error: 'Total amount is required',
      invalid_type_error: 'Total amount must be a number',
    }),
    coupon: z
      .string(
        z.string().regex(/(ObjectId\(')?[0-9a-fA-F]{24}('\))?/g, {
          message: 'Invalid Coupon Id',
        }),
      )
      .optional(),
    transactionId: z.string().optional(),
    products: z.array(
      z.object({
        product: z.string().regex(/(ObjectId\(')?[0-9a-fA-F]{24}('\))?/g, {
          message: 'Invalid Address Id',
        }),
        quantity: z.number(),
        price: z.number(),
      }),
    ),
  }),
});
