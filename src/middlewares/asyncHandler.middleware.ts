import { NextFunction, Request, Response } from 'express';

export interface IFunction {
  // eslint-disable-next-line no-unused-vars
  (req: Request, res: Response, next: NextFunction): Promise<unknown>;
}

const asyncHandler = (fn: IFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

export default asyncHandler;
