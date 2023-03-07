import ROLES_LIST from '@/configs/ROLES_LIST';
import {
  getAllLoggedInUserOrders,
  getAllOrdersAdmin,
} from '@/controllers/order.controller';
import { authorizeRoles, isLoggedIn } from '@/middlewares/auth.middleware';
import { Router } from 'express';

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/orders
 */
router
  .route('/admin')
  .get(
    isLoggedIn,
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    getAllOrdersAdmin,
  );

router.route('/').get(isLoggedIn, getAllLoggedInUserOrders);
export default router;
