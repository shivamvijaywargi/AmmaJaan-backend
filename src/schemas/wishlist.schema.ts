import { Types } from 'mongoose';
import { z } from 'zod';

export const createWishlistSchema = z.object({
  body: z.object({
    wishlistName: z
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

export const addToWishlistParamsSchema = z.object({
  params: z.object({
    id: z.instanceof(Types.ObjectId),
  }),
});

export const addToWishlistQuerySchema = z.object({
  query: z.object({
    productId: z.instanceof(Types.ObjectId),
  }),
});
