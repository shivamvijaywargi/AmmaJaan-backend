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

// For some reason z.instanceOf(Types.ObjectId) is not working for below two schemas, need to check further
export const addToWishlistParamsSchema = z.object({
  params: z.object({
    wishlistId: z.string(),
    productId: z.string().optional(),
  }),
});
