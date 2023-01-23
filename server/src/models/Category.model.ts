import { Schema, model } from "mongoose";

const categorySchema: Schema = new Schema({});

const Category = model("Category", categorySchema);

export default Category;
