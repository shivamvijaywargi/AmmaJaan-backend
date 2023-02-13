import { Router } from 'express';
import ROLES_LIST from '../configs/ROLES_LIST';
import {
  createProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from '../controllers/product.controller';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware';
import validateRequestObj from '../middlewares/validateReq';
import {
  productQuerySchema,
  UpdateProductSchema,
} from '../schemas/product.schema';

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/products
 */
router
  .route('/')
  .post(
    isLoggedIn,
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    createProduct
  )
  .get(validateRequestObj(productQuerySchema), getAllProducts);

router
  .route('/:id')
  .get(getProductById)
  .put(
    isLoggedIn,
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    updateProductById
  )
  .delete(
    isLoggedIn,
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    deleteProductById
  );

export default router;
