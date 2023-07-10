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
    address: z
      .string({
        required_error: 'Address is required',
      })
      .regex(/(ObjectId\(')?[0-9a-fA-F]{24}('\))?/g, {
        message: 'Invalid Address Id',
      }),
    phoneNumber: z
      .string({
        required_error: 'Phone number is required',
        invalid_type_error: 'Phone number must be a string',
      })
      .trim()
      .min(10, {
        message: 'Phone number must be at least 10 characters',
      })
      .max(15, 'Phone number cannot be more than 15 characters'),
    paymentMethod: z
      .string({
        required_error: 'Payment method is required',
        invalid_type_error: 'Payment method must be a string',
      })
      .trim(),
    total: z.number({
      required_error: 'Total amount is required',
      invalid_type_error: 'Total amount must be a number',
    }),
    coupon: z
      .string()
      .trim()
      .regex(/(ObjectId\(')?[0-9a-fA-F]{24}('\))?/g, {
        message: 'Invalid Coupon Id',
      })
      .optional(),
    transactionId: z.string().trim().optional(),
    products: z.array(
      z.object({
        product: z
          .string({
            required_error: 'Product ID is required',
          })
          .regex(/(ObjectId\(')?[0-9a-fA-F]{24}('\))?/g, {
            message: 'Invalid Product Id',
          }),
        quantity: z.number({
          required_error: 'Quantity is required',
          invalid_type_error: 'Quantity must be a string',
        }),
        price: z.number({
          required_error: 'Price is required',
          invalid_type_error: 'Price must be a string',
        }),
        _id: z
          .string({
            required_error: 'Product ID is required',
          })
          .regex(/(ObjectId\(')?[0-9a-fA-F]{24}('\))?/g, {
            message: 'Invalid Product Id',
          }),
      }),
    ),
  }),
});
