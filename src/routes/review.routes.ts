import { Router } from 'express';

import validateRequestObj from '@/middlewares/validateReq';
import {
  CreateReviewSchema,
  productReviewsParamasSchema,
  reviewParamsSchema,
} from '@/validations/review.schema';
import {
  createReview,
  delteReviewById,
  getAllReviews,
  getReviewById,
  getReviewsByProductId,
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
  .get(isLoggedIn, validateRequestObj(reviewParamsSchema), getReviewById)
  .delete(isLoggedIn, validateRequestObj(reviewParamsSchema), delteReviewById);

router
  .route('/products/:productId')
  .get(validateRequestObj(productReviewsParamasSchema), getReviewsByProductId);

export default router;
