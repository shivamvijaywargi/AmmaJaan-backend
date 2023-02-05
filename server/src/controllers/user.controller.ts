import { NextFunction, Request, Response } from 'express';

import asyncHandler from '../middlewares/asyncHandler.middleware';
import User from '../models/User.model';
import AppErr from '../utils/AppErr';
import sendEmail from '../utils/sendEmail';

/**
 * @GET_ALL_USERS
 * @ROUTE @GET {{URL}}/api/v1/users
 * @returns All Users
 * @ACCESS Private (Admins only)
 */
export const getAllUsers = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    const users = await User.find({});

    if (!users.length) {
      return next(new AppErr('No users found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'All users fetched successfully',
      users,
    });
  }
);

/**
 * @GET_USER_BY_ID
 * @ROUTE @GET {{URL}}/api/v1/users/:id
 * @returns Single User based on the user id
 * @ACCESS Private (Admins, employees only)
 */
export const getUserByID = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppErr('Invalid id or user does not exist', 400));
    }

    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      user,
    });
  }
);

/**
 * @UPDATE_USER
 * @ROUTE @PUT {{URL}}/api/v1/users
 * @returns User updated successfully
 * @ACCESS Private (Logged in user only)
 */
export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

/**
 * @GET_LOGGED_IN_USER_DETAILS
 * @ROUTE @GET {{URL}}/api/v1/users/me
 * @returns Logged in user details
 * @ACCESS Private (Logged in users only)
 */
export const getLoggedInUserDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

/**
 * @CHANGE_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/users/change-password
 * @returns Password changed successfully + sends an email to user email
 * @ACCESS Private (Logged in user only)
 */
export const changePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

/**
 * @DELETE_USER
 * @ROUTE @DELETE {{URL}}/api/v1/users/:id
 * @returns User deleted successfully
 * @ACCESS Private (Admins only)
 */
export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);
