/**
 * CREDITS
 * UPDATE: Updated the zod validation middleware🚑️https://jeffsegovia.dev/blogs/rest-api-validation-using-zod
 * https://www.imadatyat.me/guides/schema-validation-with-zod-and-expressjs
 */

import { NextFunction, Request, Response } from 'express';
import { AnyZodObject, ZodOptional } from 'zod';

import AppErr from '@/utils/AppErr';

const validateRequestObj =
  (schema: AnyZodObject | ZodOptional<AnyZodObject>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
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
