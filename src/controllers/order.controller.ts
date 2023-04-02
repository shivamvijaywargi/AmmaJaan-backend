import { RequestHandler } from 'express';

import asyncHandler from '@/middlewares/asyncHandler.middleware';
import AppErr from '@/utils/AppErr';
import Order from '@/models/Order.model';
import sendEmail from '@/utils/sendEmail';
import User from '@/models/User.model';
import Product from '@/models/Product.model';
import { stripe } from '@/app';

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
    // Pagination setup
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 50;

    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: req.user?.user_id })
      .populate('user address coupon')
      .populate({ path: 'products.product', select: 'title' })
      .skip(skip)
      .limit(limit);

    if (!orders.length) {
      return next(
        new AppErr('No orders found, please place a order first.', 404),
      );
    }

    const count = await Order.find({
      user: req.user?.user_id,
    }).countDocuments();

    res.status(200).json({
      success: true,
      message: 'All user orders fetched successfully',
      orders,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      count,
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

    const user = await User.findById(req.user?.user_id);

    if (!user) {
      return next(new AppErr('You are not logged in, please login', 401));
    }

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

    const allProducts = await Product.find({ _id: { $in: products } });

    let convertedOrders;

    products.map(async (order: { _id: string; quantity: number }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const product = allProducts?.find((product: any) => {
        return product?._id.toString() === order?._id.toString();
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      convertedOrders = allProducts.map((product: any) => {
        return {
          price_data: {
            currency: 'inr',
            product_data: {
              name: product.title,
              description: product.description,
            },
            unit_amount: product.discountedPrice
              ? Number(product.discountedPrice) * 100
              : Number(product.originalPrice) * 100,
          },
          quantity: order?.quantity,
        };
      });

      if (product) {
        product.numOfUnitsSold += order?.quantity;
        product.quantity -= order?.quantity;
        await product.save();
      }
    });

    // Make payment stripe
    const session = await stripe.checkout.sessions.create({
      line_items: convertedOrders,
      metadata: {
        orderId: JSON.stringify(order?._id),
      },
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
    });

    const emailSubject = 'Your AmmaJaan order';
    const emailMessage =
      'Thank you for placing your order on AmmaJaan, we are currently processing it and it will soon be shipped.';

    await sendEmail(user.email, emailSubject, emailMessage);

    res.status(201).json({
      success: true,
      message: 'Order created successfully.',
      url: session.url,
    });
  },
);
