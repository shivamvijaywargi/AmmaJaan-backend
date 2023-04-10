import {
  createAddress,
  deleteAddressById,
  getAddressById,
  getAllUserAddresses,
  updateAddressById,
} from '@/controllers/address.controller';
import { isLoggedIn } from '@/middlewares/auth.middleware';
import validateRequestObj from '@/middlewares/validateReq';
import {
  addressparamsSchema,
  createAddressSchema,
} from '@/validations/address.schema';
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
  .get(isLoggedIn, validateRequestObj(addressparamsSchema), getAddressById)
  .patch(isLoggedIn, validateRequestObj(addressparamsSchema), updateAddressById)
  .delete(
    isLoggedIn,
    validateRequestObj(addressparamsSchema),
    deleteAddressById,
  );

export default router;
