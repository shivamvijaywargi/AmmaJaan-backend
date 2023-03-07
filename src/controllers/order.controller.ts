import { RequestHandler } from 'express';

import asyncHandler from '@/middlewares/asyncHandler.middleware';
import AppErr from '@/utils/AppErr';
import Order from '@/models/Order.model';

/*********************** ADMIN CONTROLLERS - START *****************************/
/**
 * @GET_ALL_ORDERS
 * @ROUTE @GET {{URL}}/api/v1/orders/admin
 * @returns All Orders
 * @ACCESS Private (Admins + Employees only)
 */
export const getAllOrdersAdmin: RequestHandler = asyncHandler(
  async (req, res, next) => {
    // Pagination setup
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;

    const skip = (page - 1) * limit;

    const orders = await Order.find({})
      .populate('products.product user address coupon')
      .skip(skip)
      .limit(limit);

    const count = await Order.countDocuments();

    if (!orders.length) {
      return next(new AppErr('No Orders found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'All Orders fetched successfully',
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      count,
    });
  },
);

/*********************** ADMIN CONTROLLERS - END *****************************/

/**
 * @GET_ALL_LOGGED_IN_USER_ORDERS
 * @ROUTE @GET {{URL}}/api/v1/orders
 * @returns All Logeed in user Orders
 * @ACCESS Private (Logged in users only)
 */
export const getAllLoggedInUserOrders: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const orders = await Order.find({ user: req.user?.user_id })
      .populate('user address coupon')
      .populate({ path: 'products.product', select: 'title' });

    if (!orders.length) {
      return next(
        new AppErr('No orders found, please place a order first.', 404),
      );
    }

    res.status(200).json({
      success: true,
      message: 'All user orders fetched successfully',
      orders,
    });
  },
);

/**
 * @CREATE_ORDER
 * @ROUTE @POST {{URL}}/api/v1/orders/admin
 * @returns New order created successfully
 * @ACCESS Private (Logged in users only)
 */
export const createOrder: RequestHandler = asyncHandler(
  async (req, res, next) => {
    const {
      address,
      phoneNumber,
      paymentMethod,
      total,
      coupon,
      transactionId,
      products,
    } = req.body;

    const order = await Order.create({
      products,
      address,
      phoneNumber,
      paymentMethod,
      total,
      coupon,
      user: req.user?.user_id,
      transactionId,
    });

    if (!order) {
      return next(new AppErr('Order not created, please try again.', 400));
    }

    res.status(201).json({
      success: true,
      message: 'Order created successfully.',
    });
  },
);
