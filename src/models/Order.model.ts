import { Schema, model } from 'mongoose';
import { IOrders } from '@/types';

const orderSchema: Schema = new Schema<IOrders>(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: Number,
        price: Number,
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
      required: [true, 'Address is required'],
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
    },
    total: {
      type: Number,
      required: [true, 'Total price is required'],
    },
    coupon: {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
    },
    transactionId: String,
    status: {
      type: String,
      enum: ['ORDERED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'ORDERED',
    },
  },
  {
    timestamps: true,
  },
);

const Order = model<IOrders>('Order', orderSchema);

export default Order;
