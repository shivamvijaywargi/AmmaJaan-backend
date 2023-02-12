import { NextFunction, Request, Response } from 'express';
import AppErr from '../utils/AppErr';
import Logger from '../utils/logger';

const devError = (err: AppErr, res: Response) => {
  Logger.error(err);
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
  });
};

const prodError = (err: AppErr, res: Response) => {
  Logger.error(err);
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
  });
};

const errorMiddleware = async (
  err: AppErr,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  // Wrong MongoDB ID error
  if (err.name === 'CastError') {
    const message = `Resource not found. Invalid ${err.path}`;
    err = new AppErr(message, 400);
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new AppErr(message, 400);
  }

  // Wrong JWT Error
  if (err.name === 'JsonWebTokenError') {
    const message = `Json Web Token is invalid, try again`;
    err = new AppErr(message, 400);
  }

  // JWT expired Error
  if (err.name === 'TokenExpiredError') {
    const message = `Json Web Token is expired, try again`;
    err = new AppErr(message, 400);
  }

  if (process.env.NODE_ENV === 'development') {
    devError(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    prodError(err, res);
  }
};

export default errorMiddleware;
