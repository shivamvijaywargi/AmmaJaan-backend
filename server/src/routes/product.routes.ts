import { Router } from 'express';
import ROLES_LIST from '../configs/ROLES_LIST';
import { createProduct } from '../controllers/product.controller';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/products
 */
router.route('/').post(
  isLoggedIn,
  // authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
  createProduct
);

export default router;
