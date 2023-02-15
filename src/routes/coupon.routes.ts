import { Router } from 'express';
import { getAllCoupons } from '../controllers/coupon.controller';

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/products
 */
router.route('/').post(getAllCoupons);

export default router;
