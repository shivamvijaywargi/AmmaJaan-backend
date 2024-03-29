import { z } from 'zod';

export const createWishlistSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Wishlist name is required',
        invalid_type_error: 'Wishlist name must be a string',
      })
      .trim()
      .min(3, {
        message: 'Wishlist name must be at least 3 characters',
      })
      .max(25, 'Wishlist name cannot be more than 25 characters'),
  }),
});

// For some reason z.instanceof(Types.ObjectId) is not working for below schema, need to check further
// For now I have added regex for ObjectId validation to Zod
export const wishlistParamsSchema = z.object({
  params: z.object({
    wishlistId: z.string().regex(/(ObjectId\(')?[0-9a-fA-F]{24}('\))?/g, {
      message: 'Invalid Wishlist Id',
    }),
    // productId: z.string().optional(),
  }),
});

export const wishlistQuerySchema = wishlistParamsSchema.extend({
  params: z.object({
    productId: z.string().regex(/(ObjectId\(')?[0-9a-fA-F]{24}('\))?/g, {
      message: 'Invalid Product Id',
    }),
  }),
});
