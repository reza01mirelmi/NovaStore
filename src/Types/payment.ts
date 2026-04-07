import {Types } from "mongoose";

export interface paymentModels{
  orderId: Types.ObjectId;
  userId: Types.ObjectId;
  amount: number;
  method: "credit_card" | "paypal" | "zarinpal" | "stripe" | "cash";
  paymentId: string;
  status: "pending" | "success" | "failed";
  createdAt?: Date;
  updatedAt?: Date;
}
