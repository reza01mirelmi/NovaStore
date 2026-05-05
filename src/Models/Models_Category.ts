import { Schema, model, Document, Types } from "mongoose";
import { categoryType } from "../Types/category";

export type CategoryDocument = categoryType &
  Document & { _id: Types.ObjectId };

const CategorySchema = new Schema<categoryType>(
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
  { timestamps: true, collection: "Category" },
);

export default model("Category", CategorySchema);
