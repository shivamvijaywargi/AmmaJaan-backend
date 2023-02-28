import { NextFunction, Request, Response } from 'express';
import { Types } from 'mongoose';

import asyncHandler from '@/middlewares/asyncHandler.middleware';
import Wishlist from '@/models/Wishlist.model';
import AppErr from '@/utils/AppErr';

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
    const { name } = req.body;

    const wishlistExists = await Wishlist.findOne({
      name,
    });

    if (wishlistExists) {
      return next(new AppErr('Wishlist with this name already exists', 409));
    }

    const wishlist = await Wishlist.create({
      name,
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
 * @GET_WISHLIST_BY_ID
 * @ROUTE @GET {{URL}}/api/v1/wishlists/:wishlistId
 * @returns Wishlist with ID
 * @ACCESS Private (Logged in user only)
 */
export const getWishlistById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { wishlistId } = req.params;

    const wishlist = await Wishlist.findById(wishlistId).populate('products');

    if (!wishlist) {
      return next(new AppErr('Inavlid wishlist ID or Wishlist not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Wishlist fetched successfully',
      wishlist,
    });
  },
);

/**
 * @UPDATE_WISHLIST_BY_ID
 * @ROUTE @PATCH {{URL}}/api/v1/wishlists/:wishlistId
 * @returns Wishlist updated successfully
 * @ACCESS Private (Logged in user only)
 */
export const updateWishlistById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { wishlistId } = req.params;

    const wishlist = await Wishlist.findByIdAndUpdate(
      wishlistId,
      {
        $set: req.body,
      },
      {
        new: true,
      },
    );

    if (!wishlist) {
      return next(new AppErr('Inavlid wishlist ID or Wishlist not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Wishlist updated successfully',
      wishlist,
    });
  },
);

/**
 * @DELETE_WISHLIST_BY_ID
 * @ROUTE @DELETE {{URL}}/api/v1/wishlists/:wishlistId
 * @returns Wishlist with ID deleted
 * @ACCESS Private (Logged in user only)
 */
export const deleteWishlistById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { wishlistId } = req.params;

    const wishlist = await Wishlist.findByIdAndDelete(wishlistId);

    if (!wishlist) {
      return next(new AppErr('Invalid wishlist ID or Wishlist not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Wishlist deleted successfully',
      wishlist,
    });
  },
);

/**
 * @ADD_PRODUCT_TO_WISHLIST
 * @ROUTE @PATCH {{URL}}/api/v1/wishlists/:wishlistId/products/:productId
 * @returns Product(s) added successfully
 * @ACCESS Private (Logged in user only)
 */
export const addproductToWishlist = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { wishlistId, productId } = req.params;

    if (!productId) {
      return next(new AppErr('Product ID is required', 400));
    }

    const wishlist = await Wishlist.findById(wishlistId);

    if (!wishlist) {
      return next(new AppErr('Inavlid wishlist ID or Wishlist not found', 404));
    }

    await wishlist.products.push(productId as unknown as Types.ObjectId);

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist successfully',
      wishlist,
    });
  },
);

/**
 * @REMOVE_PRODUCT_FROM_WISHLIST
 * @ROUTE @DELETE {{URL}}/api/v1/wishlists/:wishlistId/products/:productId
 * @returns Product(s) removed successfully
 * @ACCESS Private (Logged in user only)
 */
export const removeproductFromWishlist = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { wishlistId, productId } = req.params;

    if (!productId) {
      return next(new AppErr('Product ID is required', 400));
    }

    const wishlist = await Wishlist.findById(wishlistId);

    if (!wishlist) {
      return next(new AppErr('Inavlid wishlist ID or Wishlist not found', 404));
    }

    // Need to check mongodb aggregation pipelines in depth
    // await wishlist.updateOne(
    //   {
    //     $pull: { products: { productId } },
    //   },
    //   { safe: true, multi: false, new: true },
    // );

    const productIdIndex = wishlist.products.indexOf(
      productId as unknown as Types.ObjectId,
    );

    await wishlist.products.splice(productIdIndex, 1);

    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist successfully',
      wishlist,
    });
  },
);
