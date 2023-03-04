import {
  createAddress,
  deleteAddressById,
  getAllUserAddresses,
} from '@/controllers/address.controller';
import { isLoggedIn } from '@/middlewares/auth.middleware';
import validateRequestObj from '@/middlewares/validateReq';
import {
  addressparamsSchema,
  createAddressSchema,
} from '@/schemas/address.schema';
import { Router } from 'express';

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/addresses
 */
router
  .route('/')
  .get(isLoggedIn, getAllUserAddresses)
  .post(isLoggedIn, validateRequestObj(createAddressSchema), createAddress);

router
  .route('/:addressId')
  .delete(
    isLoggedIn,
    validateRequestObj(addressparamsSchema),
    deleteAddressById,
  );
export default router;
