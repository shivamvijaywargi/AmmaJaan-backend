import { Schema, model } from 'mongoose';
import { IWishlist } from '../types';

const wishlistSchema = new Schema<IWishlist>(
  {
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
