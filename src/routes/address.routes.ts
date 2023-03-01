import {
  createAddress,
  getAllUserAddresses,
} from '@/controllers/addres.controller';
import { isLoggedIn } from '@/middlewares/auth.middleware';
import validateRequestObj from '@/middlewares/validateReq';
import { createAddressSchema } from '@/schemas/address.schema';
import { Router } from 'express';

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/addresses
 */
router
  .route('/')
  .get(isLoggedIn, getAllUserAddresses)
  .post(isLoggedIn, validateRequestObj(createAddressSchema), createAddress);

export default router;
