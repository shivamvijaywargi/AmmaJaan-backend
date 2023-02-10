// This is just a test for Zod

import { NextFunction, Request, Response } from 'express';
import AppErr from '../utils/AppErr';

const validateRequestObj =
  (schema: any) => async (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next();
    } catch (error: any) {
      return next(
        new AppErr(
          error.message || 'Something went wrong at validateReq middleware',
          400
        )
      );
    }
  };

export default validateRequestObj;

// Usage: Use this after the route path and before the controller logic
// Ex: app.use('/).get(validateRequestObj(schema), xyzController)
