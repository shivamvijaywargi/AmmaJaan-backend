import { Schema, model } from "mongoose";

const orderSchema: Schema = new Schema({});

const Order = model("Order", orderSchema);

export default Order;
