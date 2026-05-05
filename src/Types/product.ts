import { Types } from "mongoose";

export interface productType {
  _id?: string;
  title: string;
  description: string;
  price: number;
  category: Types.ObjectId;
  sku: string;
  weight: number;
  inStock: boolean;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductQuery {
  price?: {
    $gte?: number;
    $lte?: number;
  };
  category?: string | undefined;
  title?: string;
  inStock?: boolean;
}
