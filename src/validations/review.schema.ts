import { z } from 'zod';

export const CreateReviewSchema = z.object({
  body: z.object({
    title: z
      .string({
        required_error: 'Title is required',
        invalid_type_error: 'Title must be a string',
      })
      .min(10)
      .max(55),
    review: z.string().min(20).max(260).optional(),
    rating: z
      .number({
        required_error: 'Rating is required',
        invalid_type_error: 'Rating must be a number',
      })
      .min(1)
      .max(5),
  }),
});

export const reviewParamsSchema = z.object({
  params: z.object({
    reviewId: z.string().regex(/(ObjectId\(')?[0-9a-fA-F]{24}('\))?/g, {
      message: 'Invalid Product Id',
    }),
  }),
});

export const productReviewsParamasSchema = z.object({
  params: z.object({
    productId: z.string().regex(/(ObjectId\(')?[0-9a-fA-F]{24}('\))?/g, {
      message: 'Invalid Product Id',
    }),
  }),
});
