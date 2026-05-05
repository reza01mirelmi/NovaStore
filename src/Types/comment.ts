import { Document, Types } from "mongoose";

export interface commentType extends Document {
  productId: Types.ObjectId | commentType;
  userId: Types.ObjectId | commentType;
  body: string;
  createdAt?: Date;
  updatedAt?: Date;
}
