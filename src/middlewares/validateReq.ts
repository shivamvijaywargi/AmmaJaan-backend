// This is just a test for Zod

import { NextFunction, Request, Response } from 'express';
import { AnyZodObject } from 'zod';

import AppErr from '@/utils/AppErr';

const validateRequestObj =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      return next();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Zod Validation Error
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const allErrors = err.issues.map((error: any) => {
        return error.message;
      });

      const error = allErrors.join(', ');

      if (process.env.NODE_ENV === 'production') {
        return next(new AppErr(error, 400));
      } else {
        return res.status(400).send(err);
      }
    }
  };

export default validateRequestObj;

// Usage: Use this after the route path and before the controller logic
// Ex: app.use('/).get(validateRequestObj(schema), xyzController)
