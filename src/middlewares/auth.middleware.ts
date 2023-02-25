import jwt, { JwtPayload } from 'jsonwebtoken';

import AppErr from '@/utils/AppErr';
import asyncHandler from './asyncHandler.middleware';
import { IDecodedJwtPayload, IRoles } from '@/types';

declare module 'express' {
  export interface Request {
    user?: IDecodedJwtPayload;
  }
}

export const isLoggedIn = asyncHandler(async (req, _res, next) => {
  let token: string | JwtPayload;

  if (
    req.headers &&
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req?.headers?.authorization?.split(' ')[1];
  } else {
    return next(new AppErr('You are not authorized, please login', 401));
  }

  if (!token) {
    return next(new AppErr('You are not authorized, please login', 401));
  }

  const decoded = (await jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
  )) as IDecodedJwtPayload;

  if (!decoded) {
    return next(new AppErr('Unauthorized, please login', 401));
  }

  req.user = decoded;

  next();
});

export const authorizeRoles = (...roles: IRoles) =>
  asyncHandler(async (req, _res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new AppErr('You are not authorized to access this route', 403),
      );
    }

    next();
  });
