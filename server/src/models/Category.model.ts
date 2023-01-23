import { Schema, model } from "mongoose";

const categorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      minlength: [3, "Category name must be atleast 3 characters long"],
      maxlength: [20, "Category name cannot be more than 20 characters"],
      trim: true,
    },
    description: {
      type: String,
      minlength: [15, "Description must be atleast 15 characters long"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  }
);

const Category = model("Category", categorySchema);

export default Category;
