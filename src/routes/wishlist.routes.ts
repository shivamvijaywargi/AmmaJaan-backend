import ROLES_LIST from '@/configs/ROLES_LIST';
import {
  addproductsToWishlist,
  createWishlist,
  getAllWishlists,
  getWishlistById,
  updateWishlistById,
} from '@/controllers/wishlist.controller';
import { authorizeRoles, isLoggedIn } from '@/middlewares/auth.middleware';
import validateRequestObj from '@/middlewares/validateReq';
import {
  addToWishlistParamsSchema,
  addToWishlistQuerySchema,
  createWishlistSchema,
} from '@/schemas/wishlist.schema';
import { Router } from 'express';

const router = Router();

/**
 * @ROUTE {{URL}}/api/v1/wishlists
 */
router
  .route('/')
  .get(
    isLoggedIn,
    authorizeRoles(ROLES_LIST.ADMIN, ROLES_LIST.EMPLOYEE),
    getAllWishlists,
  )
  .post(isLoggedIn, validateRequestObj(createWishlistSchema), createWishlist);

router
  .route('/:id')
  .get(
    isLoggedIn,
    validateRequestObj(addToWishlistParamsSchema),
    getWishlistById,
  )
  .post(
    isLoggedIn,
    validateRequestObj(addToWishlistParamsSchema),
    validateRequestObj(addToWishlistQuerySchema),
    addproductsToWishlist,
  )
  .patch(validateRequestObj(addToWishlistParamsSchema), updateWishlistById);
// .delete()

export default router;
