import { Types } from "mongoose";

export interface productModels {
  title: string;
  description: string;
  price: number;
  category: Types.ObjectId;
  sku: string;
  weight: number;
  inStock: Boolean;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}
