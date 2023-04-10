import ROLES_LIST from '@/configs/ROLES_LIST';
import {
  addproductToWishlist,
  createWishlist,
  deleteWishlistById,
  getAllWishlists,
  getWishlistById,
  removeproductFromWishlist,
  updateWishlistById,
} from '@/controllers/wishlist.controller';
import { authorizeRoles, isLoggedIn } from '@/middlewares/auth.middleware';
import validateRequestObj from '@/middlewares/validateReq';
import {
  wishlistParamsSchema,
  createWishlistSchema,
  wishlistQuerySchema,
} from '@/validations/wishlist.schema';
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
  .route('/:wishlistId')
  .get(isLoggedIn, validateRequestObj(wishlistParamsSchema), getWishlistById)
  .patch(
    isLoggedIn,
    validateRequestObj(wishlistParamsSchema),
    updateWishlistById,
  )
  .delete(
    isLoggedIn,
    validateRequestObj(wishlistParamsSchema),
    deleteWishlistById,
  );

router
  .route('/:wishlistId/products/:productId')
  .patch(
    isLoggedIn,
    validateRequestObj(wishlistParamsSchema),
    validateRequestObj(wishlistQuerySchema),
    addproductToWishlist,
  )
  .delete(
    isLoggedIn,
    validateRequestObj(wishlistParamsSchema),
    validateRequestObj(wishlistQuerySchema),
    removeproductFromWishlist,
  );

export default router;
