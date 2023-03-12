import { Schema, model } from 'mongoose';
import { ICoupon } from '@/types';

const couponSchema: Schema = new Schema<ICoupon>(
  {
    couponCode: {
      type: String,
      minlength: [5, 'Coupon code must be atleast 5 characters long'],
      required: [true, 'Coupon code is required'],
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    expires: {
      type: Date,
      default: +new Date() + 7 * 24 * 60 * 60 * 1000, // Expire in 7 days from creation
    },
  },
  {
    timestamps: true,
  },
);

const Coupon = model<ICoupon>('Coupon', couponSchema);

export default Coupon;
