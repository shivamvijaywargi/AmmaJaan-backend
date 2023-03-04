import { NextFunction, Request, Response } from 'express';

import Address from '@/models/Address.model';
import User from '@/models/User.model';
import asyncHandler from '@/middlewares/asyncHandler.middleware';
import AppErr from '@/utils/AppErr';

/**
 * @CREATE_ADDRESS
 * @ROUTE @POST {{URL}}/api/v1/addresses
 * @returns Address created successfully
 * @ACCESS Private (Logged in user only)
 */
export const createAddress = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, phoneNumber, houseNumber, city, state, pinCode } = req.body;

    const address = await Address.create({
      name,
      phoneNumber,
      houseNumber,
      city,
      state,
      pinCode,
    });

    const user = await User.findById(req.user?.user_id);

    if (!user) {
      return next(new AppErr('Unauthorized, please login first.', 401));
    }

    // Push the address to logged in user account
    await user.updateOne(
      {
        $push: { addresses: address },
      },
      { new: true }, // TODO: This is not working for some reason, need to check
    );

    if (user.addresses.length < 1) {
      address.isPrimary = true;
    }

    await address.save();

    res.status(201).json({
      success: true,
      message: 'Address created successfully',
      address,
    });
  },
);

/**
 * @GET_ALL_ADDRESS
 * @ROUTE @GET {{URL}}/api/v1/addresses
 * @returns All user address
 * @ACCESS Private (Logged in user only)
 */
export const getAllUserAddresses = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const allUserAddresses = await User.findById(req.user?.user_id).populate(
      'addresses',
    );

    if (!allUserAddresses?.addresses.length) {
      return next(
        new AppErr('No address found, please add a new address.', 404),
      );
    }

    res.status(200).json({
      success: true,
      message: 'All addresses fetched successfully',
      addresses: allUserAddresses.addresses,
    });
  },
);

/**
 * @GET_ADDRESS_BY_ID
 * @ROUTE @GET {{URL}}/api/v1/addresses/:addressId
 * @returns Address fetched successfully
 * @ACCESS Private (Logged in user only)
 */
export const getAddressById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { addressId } = req.params;

    const address = await Address.findById(addressId);

    if (!address) {
      return next(new AppErr('Invalid address ID or address not found.', 400));
    }

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address,
    });
  },
);

/**
 * @UPDATE_ADDRESS_BY_ID
 * @ROUTE @PATCH {{URL}}/api/v1/addresses/:addressId
 * @returns Address updated successfully
 * @ACCESS Private (Logged in user only)
 */
export const updateAddressById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { addressId } = req.params;

    const address = await Address.findByIdAndUpdate(
      addressId,
      {
        $set: req.body,
      },
      {
        new: true,
      },
    );

    if (!address) {
      return next(new AppErr('Invalid address ID or address not found.', 400));
    }

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address,
    });
  },
);

/**
 * @DELETE_ADDRESS_BY_ID
 * @ROUTE @DELETE {{URL}}/api/v1/addresses/:addressId
 * @returns Address removed successfully
 * @ACCESS Private (Logged in user only)
 */
export const deleteAddressById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { addressId } = req.params;

    const address = await Address.findByIdAndRemove(addressId);

    if (!address) {
      return next(new AppErr('Invalid address ID or address not found.', 400));
    }

    const user = await User.findById(req.user?.user_id);

    if (!user) {
      return next(new AppErr('Unauthorized, please login first.', 401));
    }

    await user.updateOne(
      {
        $pull: {
          addresses: { $in: addressId },
        },
      },
      { safe: true, multi: false, new: true },
    );

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully',
    });
  },
);
