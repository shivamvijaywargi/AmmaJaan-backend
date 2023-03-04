import { Router } from 'express';

import validateRequestObj from '@/middlewares/validateReq';
import {
  CreateReviewSchema,
  reviewParamsSchema,
} from '@/schemas/review.schema';
import {
  createReview,
  delteReviewById,
  getAllReviews,
} from '@/controllers/review.controller';
import { isLoggedIn } from '@/middlewares/auth.middleware';

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/users
 */
router
  .route('/')
  .get(isLoggedIn, getAllReviews)
  .post(isLoggedIn, validateRequestObj(CreateReviewSchema), createReview);

router
  .route('/:reviewId')
  .delete(isLoggedIn, validateRequestObj(reviewParamsSchema), delteReviewById);
export default router;
