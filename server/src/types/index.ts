import { Types } from 'mongoose';

export interface IDecodedJwtPayload {
  user_id: string;
  role: number;
}

export type IRoles = (number | undefined)[];

export interface IAddress {
  name: string;
  phoneNumber: string;
  houseNumber: string;
  city: string;
  state: string;
  pinCode?: string;
  isPrimary?: boolean;
}

export interface ICategory {
  name: string;
  description?: string;
  slug: string;
  createdBy: Types.ObjectId;
}

export interface ICoupon {
  couponCode: string;
  isActive?: boolean;
  discount: number;
  expires: Date;
}

export interface IOrders {
  products: {
    product: Types.ObjectId;
    quantity: number;
    price: number;
  }[];
  user: Types.ObjectId;
  address: string;
  phoneNumber: string;
  paymentMethod: string;
  total: number;
  coupon?: string;
  transactionId?: string;
  status: 'ORDERED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}

export interface IProduct {
  title: string;
  description: string;
  shortDescription?: string;
  images: {
    image: {
      public_id: string;
      secure_url: string;
    };
  }[];
  price: number;
  quantity: number;
  inStock: boolean;
  slug: string;
  label: 'Hot' | 'New' | 'Best Selling';
  category: Types.ObjectId;
  createdBy: Types.ObjectId;
}

export interface IReview {
  title: string;
  review?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  reviewedBy: Types.ObjectId;
  reviewedFor: Types.ObjectId;
}

export interface IUser {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: number;
  isActive: boolean;
  loginCount: number;
  avatar: {
    public_id: string;
    secure_url: string;
  };
  addresses: Types.ObjectId[];
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
}

export interface IWishlist {
  user: Types.ObjectId;
  products: Types.ObjectId[];
}
