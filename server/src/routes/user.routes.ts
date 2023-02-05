import { Router } from 'express';
import {
  changePassword,
  deleteUser,
  getAllUsers,
  getLoggedInUserDetails,
  getUserByID,
  updateUser,
} from '../controllers/user.controller';

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/users
 */
router.route('/').get(getAllUsers).put(updateUser);
router.route('/:id').get(getUserByID).delete(deleteUser);
router.route('/me').get(getLoggedInUserDetails);
router.route('/change-password').post(changePassword);

export default router;
