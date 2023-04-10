import { Router } from 'express';

import ROLES_LIST from '@/configs/ROLES_LIST';
import {
  cancelOrderByIdAdmin,
  createOrder,
  getAllLoggedInUserOrders,
  getAllOrdersAdmin,
} from '@/controllers/order.controller';
import { authorizeRoles, isLoggedIn } from '@/middlewares/auth.middleware';
import validateRequestObj from '@/middlewares/validateReq';
import { CreateOrderSchema } from '@/validations/order.schema';

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
router
  .route('/:id/admin')
  .patch(
    isLoggedIn,
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    cancelOrderByIdAdmin,
  );

router
  .route('/')
  .get(isLoggedIn, getAllLoggedInUserOrders)
  .post(isLoggedIn, validateRequestObj(CreateOrderSchema), createOrder);

export default router;
