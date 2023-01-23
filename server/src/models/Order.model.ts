import { Schema, model } from "mongoose";

const orderSchema: Schema = new Schema(
  {
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: Number,
        price: Number,
      },
    ],
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    address: {
      type: String,
      required: [true, "Address is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
    },
    total: {
      type: Number,
      required: [true, "Total price is required"],
    },
    coupon: String,
    transactionId: String,
    status: {
      type: String,
      enum: ["ORDERED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "ORDERED",
    },
  },
  {
    timestamps: true,
  }
);

const Order = model("Order", orderSchema);

export default Order;
