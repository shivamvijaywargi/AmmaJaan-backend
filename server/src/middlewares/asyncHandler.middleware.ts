import { NextFunction, Request, Response } from 'express';

export interface IFunction {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

const asyncHandler = (fn: IFunction) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch((err) => next(err));
  };
};

export default asyncHandler;
