import ROLES_LIST from '@/configs/ROLES_LIST';
import {
  addproductsToWishlist,
  createWishlist,
  getAllWishlists,
  getWishlistById,
  removeproductsFromWishlist,
  updateWishlistById,
} from '@/controllers/wishlist.controller';
import { authorizeRoles, isLoggedIn } from '@/middlewares/auth.middleware';
import validateRequestObj from '@/middlewares/validateReq';
import {
  addToWishlistParamsSchema,
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
  .patch(
    isLoggedIn,
    validateRequestObj(addToWishlistParamsSchema),
    updateWishlistById,
  );
// .delete()

router
  .route('/:wishlistId/products/:productId')
  .post(
    isLoggedIn,
    validateRequestObj(addToWishlistParamsSchema),
    addproductsToWishlist,
  )
  .delete(
    isLoggedIn,
    validateRequestObj(addToWishlistParamsSchema),
    removeproductsFromWishlist,
  );

export default router;
