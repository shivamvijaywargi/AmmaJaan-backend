import express, { Request, Response } from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import cloudinary from 'cloudinary';
import Stripe from 'stripe';

import morganMiddleware from '@/configs/morgan';
import errorMiddleware from '@/middlewares/error.middleware';
import rateLimiter from '@/configs/rateLimiter';
import setCache from '@/middlewares/cache.middleware';

config();

const app = express();

// Stripe config
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2022-11-15',
});

// Stripe webhook
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

app.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  async (request: Request, response: Response): Promise<void> => {
    const sig = request.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      event = stripe.webhooks.constructEvent(request.body, sig!, webhookSecret);

      Logger.info(event);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      Logger.error(err);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      // Interface to type cast object so TypeScript does not complain
      interface ISession {
        metadata: { orderId: string };
        payment_status: string;
        payment_method_types: [string];
        amount_total: number;
        payment_intent: string;
      }
      // Update the order
      const session = event.data.object as ISession;

      const { orderId } = session.metadata;
      const paymentStatus = session.payment_status;
      const paymentMethod = session.payment_method_types[0];
      const totalAmount = session.amount_total;
      const paymentIntent = session.payment_intent;

      // find the order using the orderID
      const order = await Order.findByIdAndUpdate(
        JSON.parse(orderId),
        {
          total: totalAmount / 100,
          paymentMethod: paymentMethod,
          paymentStatus: paymentStatus,
          transactionId: paymentIntent,
        },
        {
          new: true,
        },
      );

      Logger.info(order);
    } else {
      Logger.error(`Unhandled event type ${event.type}`);
      return;
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  },
);

// Middlewares
// Built-in
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Third-party
app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);
app.use(rateLimiter);
// Custom
app.use(morganMiddleware);
app.use(setCache);

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * @SERVER_STATUS
 * @ROUTE @GET {{URL}}/api/ping
 * @DESC Returns response 200 with message pong if api is working
 * @ACCESS Public
 */
app.get('/api/ping', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    message: 'PONG',
  });
});

/**
 * @SERVER_STATUS
 * @ROUTE @GET {{URL}}/mode
 * @DESC Returns response 200 with application mode
 * @ACCESS Public
 */
app.get('/mode', (_req, res) => {
  res.status(200).json({
    success: true,
    environment:
      process.env.NODE_ENV === 'production' ? 'production' : 'development',
  });
});

// Import all routes
import authRoutes from '@/routes/auth.routes';
import userRoutes from '@/routes/user.routes';
import productRoutes from '@/routes/product.routes';
import categoryRoutes from '@/routes/category.routes';
import couponRoutes from '@/routes/coupon.routes';
import wishlistRoutes from '@/routes/wishlist.routes';
import addressRoutes from '@/routes/address.routes';
import reviewRoutes from '@/routes/review.routes';
import orderRoutes from '@/routes/order.routes';
import Logger from './utils/logger';
import Order from './models/Order.model';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/wishlists', wishlistRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/orders', orderRoutes);

// CatchAll - 404
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Not Found - ${req.method} ${req.originalUrl}`,
  });
});

// Custom error middleware
app.use(errorMiddleware);

export default app;
