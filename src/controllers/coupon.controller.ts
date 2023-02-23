import { NextFunction, Request, Response } from 'express';

import asyncHandler from '../middlewares/asyncHandler.middleware';
import Coupon from '../models/Coupon.model';
import { IQueryObj } from '../types';
import AppErr from '../utils/AppErr';

/**
 * @GET_ALL_COUPONS
 * @ROUTE @GET {{URL}}/api/v1/coupons
 * @returns All coupons
 * @ACCESS Private (Admin + Employee only)
 */
export const getAllCoupons = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { search, sort } = req.query;

    const queryObject: IQueryObj = {};

    if (search) {
      queryObject.couponCode = { $regex: search, $options: 'i' };
    }

    const results = Coupon.find(queryObject);

    if (sort === 'latest') {
      results.sort('-createdAt');
    }

    if (sort === 'oldest') {
      results.sort('createdAt');
    }

    if (sort === 'updatedAt') {
      results.sort('-updatedAt');
    }

    if (sort === 'active') {
      results.sort('-isActive');
    }

    if (sort === 'a-z') {
      results.sort({ couponCode: 1 });
    }

    if (sort === 'z-a') {
      results.sort({ couponCode: -1 });
    }

    // Pagination setup
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    results.skip(skip).limit(limit);

    // Await here
    const coupons = await results;

    if (!coupons.length) {
      return next(new AppErr('No Coupons found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'All found coupons',
      coupons,
      count: coupons.length,
    });
  },
);

/**
 * @CREATE_COUPON
 * @ROUTE @GET {{URL}}/api/v1/coupons
 * @returns Created coupon
 * @ACCESS Private (Admin + Employee only)
 */
export const createCoupon = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { couponCode } = req.body;

    const coupon = await Coupon.create({ couponCode });

    if (!coupon) {
      return next(new AppErr('Coupon not created, please try again.', 400));
    }

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      coupon,
    });
  },
);

/**
 * @UPDATE_COUPON
 * @ROUTE @PATCH {{URL}}/api/v1/coupons/:couponCode
 * @returns Updated coupon
 * @ACCESS Private (Admin + Employee only)
 */
export const updateCouponById = asyncHandler(
  // TODO: Remove the below line once the logic is written
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    //
  },
);

/**
 * @DELETE_COUPON
 * @ROUTE @DELETE {{URL}}/api/v1/coupons/:couponCode
 * @returns Deleted coupon
 * @ACCESS Private (Admin + Employee only)
 */
export const deleteCouponById = asyncHandler(
  // TODO: Remove the below line once the logic is written
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    //
  },
);
