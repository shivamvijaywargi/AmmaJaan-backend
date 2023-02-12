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
import validateRequestObj from '../middlewares/validateReq';
import { changeUserPasswordSchema } from '../schemas/user.schema';

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/users
 */
router
  .route('/')
  .get(
    isLoggedIn,
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    getAllUsers
  )
  .put(isLoggedIn, updateUser);
router.route('/me').get(isLoggedIn, getLoggedInUserDetails);
router
  .route('/change-password')
  .post(
    isLoggedIn,
    validateRequestObj(changeUserPasswordSchema),
    changePassword
  );
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
