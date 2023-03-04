import { Router } from 'express';

import validateRequestObj from '@/middlewares/validateReq';
import {
  CreateReviewSchema,
  reviewParamsSchema,
} from '@/schemas/review.schema';
import { createReview } from '@/controllers/review.controller';
import { isLoggedIn } from '@/middlewares/auth.middleware';

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/users
 */
router.route('/').post(
  isLoggedIn,
  validateRequestObj(CreateReviewSchema),
  // validateRequestObj(reviewParamsSchema),
  createReview,
);

export default router;
