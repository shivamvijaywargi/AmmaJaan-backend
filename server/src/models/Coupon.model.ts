import { Schema, model } from "mongoose";

const couponSchema: Schema = new Schema(
  {
    couponCode: {
      type: String,
      minlength: [5, "Coupon code must be atleast 5 characters long"],
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
  }
);

const Coupon = model("Coupon", couponSchema);

export default Coupon;
