import { Schema, model } from "mongoose";

const productSchema: Schema = new Schema({});

const Product = model("Product", productSchema);

export default Product;
