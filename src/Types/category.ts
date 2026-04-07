import { Document } from "mongoose";

export interface categoryModels extends Document {
  title: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}
