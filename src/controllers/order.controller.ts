import { NextFunction, Request, Response } from 'express';

import asyncHandler from '@/middlewares/asyncHandler.middleware';
import AppErr from '@/utils/AppErr';

/**
 * @GET_ALL_ORDERS
 * @ROUTE @GET {{URL}}/api/v1/orders
 * @returns All Orders
 * @ACCESS Private (Admins + Employees only)
 */
