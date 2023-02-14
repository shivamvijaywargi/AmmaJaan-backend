import { Router } from 'express';
import {
  forgotPassword,
  loginUser,
  logoutUser,
  refreshToken,
  registerUser,
  resetPassword,
} from '../controllers/auth.controller';
import validateRequestObj from '../middlewares/validateReq';
import { loginUserSchema, registerUserSchema } from '../schemas/auth.schema';

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/auth
 */
router.route('/new').post(validateRequestObj(registerUserSchema), registerUser);
router.route('/').post(validateRequestObj(loginUserSchema), loginUser);
router.route('/logout').post(logoutUser);
router.route('/reset').post(forgotPassword);
router.route('/reset/:token').post(resetPassword);
router.route('/refresh').post(refreshToken);

export default router;
