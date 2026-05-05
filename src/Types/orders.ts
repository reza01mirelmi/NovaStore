import { Document, Types } from "mongoose";

export interface typeOrders extends Document {
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  quantity: number;
  totalPrice: number;
  address: string;
  createdAt?: Date;
  updatedAt?: Date;
}
