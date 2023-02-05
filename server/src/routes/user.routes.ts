import { Router } from 'express';
import ROLES_LIST from '../configs/ROLES_LIST';
import {
  changePassword,
  deleteUser,
  getAllUsers,
  getLoggedInUserDetails,
  getUserByID,
  updateUser,
} from '../controllers/user.controller';
import { authorizeRoles, isLoggedIn } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/users
 */
router
  .route('/')
  .get(isLoggedIn, authorizeRoles(ROLES_LIST.ADMIN), getAllUsers)
  .put(isLoggedIn, updateUser);
router.route('/me').get(isLoggedIn, getLoggedInUserDetails);
router.route('/change-password').post(isLoggedIn, changePassword);
router
  .route('/:id')
  .get(
    isLoggedIn,
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    getUserByID
  )
  .delete(
    isLoggedIn,
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    deleteUser
  );

export default router;
