import { Schema, model } from 'mongoose';
import { IWishlist } from '@/types';

const wishlistSchema = new Schema<IWishlist>(
  {
    name: {
      type: String,
      required: [true, 'Wishlist name is required'],
      minlength: [3, 'Wishlist name must be atleast 3 characters long'],
      maxlength: [25, 'Name cannot be more than 25 characters'],
      trim: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Wishlist = model('Wishlist', wishlistSchema);

export default Wishlist;
