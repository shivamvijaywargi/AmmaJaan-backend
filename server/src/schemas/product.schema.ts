import { z } from 'zod';

export const ProductSchema = z.object({
  // body: z.object({
  title: z.string().min(5).max(55),
  description: z.string().min(10),
  shortDescription: z.string().min(20).optional(),
  price: z.number().positive(),
  quantity: z.number().positive().optional(),
  label: z.enum(['Hot', 'New', 'Best Selling']).optional(),
  inStock: z.boolean().optional(),
  category: z.instanceof(Object).transform((id) => id.toString()),
  // }),
});
