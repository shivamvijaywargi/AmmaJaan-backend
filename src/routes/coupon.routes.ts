import { Router } from 'express';
import ROLES_LIST from '../configs/ROLES_LIST';
import {
  createCoupon,
  deleteCouponById,
  getAllCoupons,
  updateCouponById,
} from '../controllers/coupon.controller';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware';
import validateRequestObj from '../middlewares/validateReq';
import {
  CreateCouponSchema,
  updateCouponSchema,
} from '../schemas/coupon.schema';

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/coupons
 */
router
  .route('/')
  .get(
    isLoggedIn,
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    getAllCoupons,
  )
  .post(
    isLoggedIn,
    validateRequestObj(CreateCouponSchema),
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    createCoupon,
  );

router
  .route('/:couponCode')
  .patch(
    isLoggedIn,
    validateRequestObj(updateCouponSchema),
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    updateCouponById,
  )
  .post(
    isLoggedIn,
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    deleteCouponById,
  );

export default router;