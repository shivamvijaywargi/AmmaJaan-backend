import { Schema, model } from 'mongoose';
import { ICategory } from '../types';

const categorySchema: Schema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      minlength: [3, 'Category name must be atleast 3 characters long'],
      maxlength: [20, 'Category name cannot be more than 20 characters'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      minlength: [15, 'Description must be atleast 15 characters long'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Category = model('Category', categorySchema);

export default Category;
