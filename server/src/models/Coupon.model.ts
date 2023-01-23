import { Schema, model } from "mongoose";

const couponSchema: Schema = new Schema({});

const Coupon = model("Coupon", couponSchema);

export default Coupon;
