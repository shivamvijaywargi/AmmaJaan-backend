import { Schema, model } from 'mongoose';
import { IReview } from '../types';

const reviewSchema: Schema = new Schema<IReview>(
  {
    title: {
      type: String,
      required: [true, 'Review title is required'],
      minlength: [10, 'Review title cannot be less than 10 characters'],
    },
    review: {
      type: String,
      minlength: [20, 'Review cannot be less than 20 characters'],
    },
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: [true, 'Rating is required'],
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewedFor: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Review = model('Review', reviewSchema);

export default Review;
