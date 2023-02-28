import { z } from 'zod';

export const createWishlistSchema = z.object({
  body: z.object({
    name: z
      .string({
        required_error: 'Wishlist name is required',
        invalid_type_error: 'Wishlist name must be a string',
      })
      .min(3, {
        message: 'Wishlist name must be at least 3 characters',
      })
      .max(25, 'Wishlist name cannot be more than 25 characters')
      .trim(),
  }),
});

// For some reason z.instanceof(Types.ObjectId) is not working for below schema, need to check further
// For now I have added regex for ObjectId validation to Zod
export const addToWishlistParamsSchema = z.object({
  params: z.object({
    wishlistId: z.string().regex(/(ObjectId\(')?[0-9a-fA-F]{24}('\))?/g, {
      message: 'Invalid ObjectId',
    }),
    productId: z.string().optional(),
  }),
});
