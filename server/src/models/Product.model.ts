import { Schema, model } from "mongoose";

const productSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [5, "Title must be atleast 5 characters long"],
      maxlength: [55, "Title cannot be more than 55 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [50, "Description must be atleast 50 characters long"],
    },
    shortDescription: {
      type: String,
      minlength: [20, "Short description must be atleast 20 characters long"],
      maxlength: [100, "Short description cannot be more than 100 characters"],
    },
    images: [
      {
        image: {
          public_id: {
            type: String,
            required: true,
          },
          secure_url: {
            type: String,
            required: true,
          },
        },
      },
    ],
    price: {
      type: Number,
      required: [true, "Price is required"],
      maxlength: [5, "Price cannot exceed 5 digits"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      maxlength: [5, "Quantity cannot exceed 5 digits"],
    },
    inStock: {
      type: Boolean,
      required: [true, "In stock status is required"],
      default: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
    },
    label: {
      type: String,
      enum: ["Hot", "New", "Best Selling"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Product = model("Product", productSchema);

export default Product;
