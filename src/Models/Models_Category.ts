import { Schema, model } from "mongoose";
import { categoryModels } from "../Types/category";

const CategorySchema = new Schema<categoryModels>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true, collection: "Category" }
);

export default model<categoryModels>("Category", CategorySchema);
