import crypto from 'crypto';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import asyncHandler from '@/middlewares/asyncHandler.middleware';
import User from '@/models/User.model';
import { IDecodedJwtPayload } from '@/types';
import AppErr from '@/utils/AppErr';
import sendEmail from '@/utils/sendEmail';

/**For some reason if I store cookie options in this variable and try to pass
 * it as cookieOptions I am getting TS error. Need to check on this later
 */
// const cookieOptions = {
//   secure: process.env.NODE_ENV === 'production' ? true : false,
//   httpOnly: true,
//   maxAge: 7 * 24 * 60 * 60 * 1000,
//   sameSite: 'none',
// };

/**
 * @REGISTER
 * @ROUTE @POST {{URL}}/api/v1/auth/new
 * @returns Refresh(cookies) + Access token(response) and user created successfully message
 * @ACCESS Public
 */
export const registerUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, email, password, phoneNumber } = req.body;

    const userExist = await User.findOne({ email }).lean();

    if (userExist) {
      return next(new AppErr('User already registered', 409));
    }

    const user = await User.create({
      email,
      fullName,
      password,
      phoneNumber,
      avatar: {
        public_id: email,
        secure_url:
          'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
      },
    });

    if (!user) {
      return next(
        new AppErr('User registration failed, please try again.', 400),
      );
    }

    const emailSubject = 'Thank you for registering on AmmaJaan';
    const emailMessage =
      'It is a pleasure to have you on board, we have a lot of cool stuff in here feel free to explore. If you cannot find any product feel free to reach out to us and we will get back to you as soon as possible.';

    await sendEmail(user.email, emailSubject, emailMessage);

    user.password = undefined;

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    res.cookie('refreshToken', refreshToken, {
      secure: process.env.NODE_ENV === 'production' ? true : false,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      accessToken,
      user,
    });
  },
);

/**
 * @LOGIN
 * @ROUTE @POST {{URL}}/api/v1/auth
 * @returns Refresh(cookies) + Access token(response) and user logged in successfully message
 * @ACCESS Public
 */
export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return next(
        new AppErr(
          'Email and password do not match or user does not exist',
          400,
        ),
      );
    }

    user.loginCount = user.loginCount + 1;

    await user.save();

    user.password = undefined;

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    res.cookie('refreshToken', refreshToken, {
      secure: process.env.NODE_ENV === 'production' ? true : false,
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: 'none',
    });

    res.status(200).json({
      success: true,
      message: 'User Logged in successfully',
      accessToken,
      user,
    });
  },
);

/**
 * @LOGOUT
 * @ROUTE @POST {{URL}}/api/v1/auth/logout
 * @returns Logged out successfully
 * @ACCESS Public
 */
export const logoutUser = asyncHandler(async (_req: Request, res: Response) => {
  res
    .status(200)
    .cookie('refreshToken', '', {
      secure: true,
      httpOnly: true,
      maxAge: 1,
    })
    .json({
      success: true,
      message: 'Logged out successfully',
    });
});

/**
 * @FORGOT_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/auth/reset
 * @returns Passwors reset token email sent to user successfully
 * @ACCESS Public
 */
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    if (!email) {
      return next(new AppErr('Email is required', 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppErr('User not found, please register', 404));
    }

    const resetToken = await user.generatePasswordResetToken();

    await user.save();

    const resetPasswordUrl = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/auth/reset/${resetToken}`;

    const subject = 'Reset your password';
    const message = `Here is your password reset token\n${resetPasswordUrl}.\nIf you did not request this, please ignore.`;

    try {
      await sendEmail(email, subject, message);

      res.status(200).json({
        success: true,
        message: `Password reset email sent to ${email} successfully`,
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiry = undefined;

      await user.save();

      return next(
        new AppErr(
          error.message || 'Something went wrong, please try again.',
          400,
        ),
      );
    }
  },
);

/**
 * @RESET_PASSWORD
 * @ROUTE @POST {{URL}}/api/v1/auth/reset/:token
 * @returns Password changed successfully
 * @ACCESS Public
 */
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;
    const { password } = req.body;

    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return next(
        new AppErr(
          'Reset password token is invalid or expired, please try again.',
          400,
        ),
      );
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password updated successfully, please login',
    });
  },
);

/**
 * @REFRESH_TOKEN
 * @ROUTE @POST {{URL}}/api/v1/auth/token
 * @returns New Access Token if refresh token is valid
 * @ACCESS Public
 */
export const refreshToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken: token } = req.cookies;

    if (!token) {
      return next(new AppErr('No token found, please login', 404));
    }

    const decoded = (await jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET as string,
    )) as IDecodedJwtPayload;

    if (!decoded) {
      return next(new AppErr('Invalid Token, please login', 400));
    }

    const user = await User.findById(decoded.user_id);

    if (!user) {
      return next(new AppErr('Unauthorized, please login', 401));
    }

    const accessToken = await user.generateAccessToken();

    res.status(200).json({
      success: true,
      message: 'Access token refreshed successfully',
      accessToken,
    });
  },
);
