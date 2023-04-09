import { Schema, model } from 'mongoose';
import { IAddress } from '@/types';

const addressSchema = new Schema<IAddress>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      minlength: [5, 'Name must be atleast 5 characters long'],
      maxlength: [25, 'Name cannot be more than 25 characters'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      minlength: [10, 'Phone number cannot be less than 10 digits'],
      maxlength: [15, 'Phone number cannot be more than 15 digits'],
      trim: true,
    },
    houseNumber: {
      type: String,
      required: [true, 'House number is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },
    pinCode: {
      type: String,
      trim: true,
    },
    isPrimary: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  },
);

const Address = model<IAddress>('Address', addressSchema);

export default Address;
