import { Router } from 'express';
import ROLES_LIST from '../configs/ROLES_LIST';
import {
  createCategory,
  deleteCategoryById,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
} from '../controllers/category.controller';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/products
 */

router
  .route('/')
  .post(
    isLoggedIn,
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    createCategory
  )
  .get(getAllCategories);

router
  .route('/:id')
  .get(getCategoryById)
  .put(
    isLoggedIn,
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    updateCategoryById
  )
  .delete(
    isLoggedIn,
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    deleteCategoryById
  );

export default router;
