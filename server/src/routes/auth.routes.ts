import { Router } from 'express';
import {
  forgotPassword,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  resetPassword,
} from '../controllers/auth.controller';

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/auth
 */
router.route('/new').post(registerUser);
router.route('/').post(loginUser);
router.route('/logout').post(logoutUser);
router.route('/reset').post(forgotPassword);
router.route('/reset/:token').post(resetPassword);
router.route('/refresh').post(refreshToken);

export default router;
