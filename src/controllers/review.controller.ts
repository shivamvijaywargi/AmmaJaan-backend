import { NextFunction, Request, Response } from 'express';

import asyncHandler from '@/middlewares/asyncHandler.middleware';
import AppErr from '@/utils/AppErr';
import Review from '@/models/Review.model';
import Product from '@/models/Product.model';

/**
 * @CREATE_REVIEW
 * @ROUTE @POST {{URL}}/api/v1/reviews
 * @returns Review created successfully
 * @ACCESS Private (Logged in user only)
 */
export const createReview = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, review, rating, reviewedFor } = req.body;

    const productExists = await Product.findById(reviewedFor);

    if (!productExists) {
      return next(new AppErr('Invalid product Id or product not found', 400));
    }

    const newReview = await Review.create({
      title,
      rating,
      reviewedBy: req.user?.user_id,
      reviewedFor,
    });

    if (review) {
      newReview.review = review;
    }

    await newReview.save();

    if (!newReview) {
      return next(new AppErr('Cannot post review now, please try again', 400));
    }

    res.status(201).json({
      success: true,
      message: 'Review posted successfully',
      newReview,
    });
  },
);
