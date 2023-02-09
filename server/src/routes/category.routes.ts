import { Router } from "express";
import { createCategory } from "../controllers/category.controller";
import { isLoggedIn } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/products
 */

router.route("/").post(
  isLoggedIn,
  // authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
  createCategory
);

export default router;
