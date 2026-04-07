import { Document, Types } from "mongoose";

export interface commentModels extends Document {
  productId: (Types.ObjectId | commentModels);
  userId: (Types.ObjectId | commentModels);
  body: string;
  createdAt?: Date;
  updatedAt?: Date;
}
