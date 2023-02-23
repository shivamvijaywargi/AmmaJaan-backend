import { Router } from 'express';
import ROLES_LIST from '../configs/ROLES_LIST';
import {
  createCoupon,
  deleteCouponById,
  getAllCoupons,
  getCouponById,
  updateCouponById,
} from '../controllers/coupon.controller';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware';
import validateRequestObj from '../middlewares/validateReq';
import {
  CouponParamsSchema,
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
  .get(
    isLoggedIn,
    validateRequestObj(CouponParamsSchema),
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    getCouponById,
  )
  .patch(
    isLoggedIn,
    validateRequestObj(updateCouponSchema),
    validateRequestObj(CouponParamsSchema),
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    updateCouponById,
  )
  .delete(
    isLoggedIn,
    validateRequestObj(CouponParamsSchema),
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    deleteCouponById,
  );

export default router;
