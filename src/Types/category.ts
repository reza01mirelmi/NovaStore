import { Document } from "mongoose";

export interface categoryType extends Document {
  title: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}
