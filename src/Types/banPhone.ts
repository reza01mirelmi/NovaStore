import { Document } from "mongoose";

export interface banModels extends Document {
  phone: string;
  createdAt?: Date;
  updatedAt?: Date;
}
