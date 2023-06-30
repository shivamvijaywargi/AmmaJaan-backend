import { z } from 'zod';

export const createAddressSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Name is required',
        invalid_type_error: 'Name must be a string',
      })
      .trim()
      .min(5, {
        message: 'Name must be at least 5 characters',
      })
      .max(25, 'Name cannot be more than 25 characters'),
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
    houseNumber: z.string({
      required_error: 'House number is required',
      invalid_type_error: 'House number must be a string',
    }),
    city: z
      .string({
        required_error: 'City is required',
        invalid_type_error: 'City must be a string',
      })
      .trim(),
    state: z
      .string({
        required_error: 'State is required',
        invalid_type_error: 'State must be a string',
      })
      .trim(),
    pinCode: z
      .string({
        required_error: 'Pincode is required',
        invalid_type_error: 'Pincode must be a string',
      })
      .trim()
      .optional(),
  }),
});

export const addressparamsSchema = z.object({
  params: z.object({
    addressId: z.string().regex(/(ObjectId\(')?[0-9a-fA-F]{24}('\))?/g, {
      message: 'Invalid Address Id',
    }),
  }),
});
