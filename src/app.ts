import express from 'express';
import { config } from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import cloudinary from 'cloudinary';

import morganMiddleware from '@/configs/morgan';
import errorMiddleware from '@/middlewares/error.middleware';
import rateLimiter from '@/configs/rateLimiter';
import setCache from '@/middlewares/cache.middleware';

config();

const app = express();

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
