import { NextFunction, Request, Response } from 'express';

import asyncHandler from '@/middlewares/asyncHandler.middleware';
import Wishlist from '@/models/Wishlist.model';
import AppErr from '@/utils/AppErr';
import { Types } from 'mongoose';

/**
 * @GET_ALL_WISHLISTS
 * @ROUTE @GET {{URL}}/api/v1/wishlists
 * @returns All wishlists
 * @ACCESS Private (ADMIN + EMPLOYEE ONLY)
 */
export const getAllWishlists = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    const wishlists = await Wishlist.find({}).populate('user products');

    if (!wishlists.length) {
      return next(
        new AppErr('No wishlists found, please create a wishlist', 404),
      );
    }

    res.status(200).json({
      success: true,
      message: 'All found wishlists',
      wishlists,
    });
  },
);

/**
 * @CREATE_WISHLIST
 * @ROUTE @POST {{URL}}/api/v1/wishlists
 * @returns Newly created wishlist
 * @ACCESS Private (Logged in user only)
 */
export const createWishlist = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { wishlistName } = req.body;

    const wishlistExists = await Wishlist.findOne({
      name: wishlistName,
    });

    if (wishlistExists) {
      return next(new AppErr('Wishlist with this name already exists', 409));
    }

    const wishlist = await Wishlist.create({
      name: wishlistName,
      user: req.user?.user_id,
    });

    res.status(201).json({
      success: true,
      message: 'Wishlist created successfully',
      wishlist,
    });
  },
);

/**
 * @ADD_PRODUCTS_TO_WISHLIST
 * @ROUTE @POST {{URL}}/api/v1/wishlists/:id
 * @returns Product(s) added successfully
 * @ACCESS Private (Logged in user only)
 */
export const addproductsToWishlist = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { productId } = req.query;

    if (!productId) {
      return next(new AppErr('Product ID is required', 400));
    }

    const wishlist = await Wishlist.findById(id);

    if (!wishlist) {
      return next(new AppErr('Wishlist not found', 404));
    }

    await wishlist.products.push(productId as unknown as Types.ObjectId);

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Product(s) added to wishlist successfully',
      wishlist,
    });
  },
);
