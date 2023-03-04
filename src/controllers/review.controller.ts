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

/**
 * @GET_ALL_REVIEWS
 * @ROUTE @GET {{URL}}/api/v1/reviews
 * @returns All found reviews
 * @ACCESS Private (Admin + Employee only)
 */
export const getAllReviews = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    const reviews = await Review.find({}).populate('reviewedBy reviewedFor');

    if (!reviews.length) {
      return next(new AppErr('No reviews found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'All found reviews',
      reviews,
    });
  },
);

/**
 * @GET_REVIEW_BY_ID
 * @ROUTE @GET {{URL}}/api/v1/reviews/:reviewId
 * @returns Review deleted successfully
 * @ACCESS Private (Logged in user only)
 */
export const getReviewById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return next(new AppErr('Invalid review id or review not found', 400));
    }

    res.status(200).json({
      success: true,
      message: 'Review fetched successfully',
      review,
    });
  },
);

/**
 * @DELETE_REVIEW_BY_ID
 * @ROUTE @DELETE {{URL}}/api/v1/reviews/:reviewId
 * @returns Review deleted successfully
 * @ACCESS Private (Logged in user only)
 */
export const delteReviewById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { reviewId } = req.params;

    const review = await Review.findByIdAndDelete(reviewId);

    if (!review) {
      return next(new AppErr('Invalid review id or review not found', 400));
    }

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  },
);
