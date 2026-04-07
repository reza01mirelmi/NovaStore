import mongoose, { Schema, Types, Document, model } from "mongoose";
import { productModels } from "../Types/product";
export type productDocument = productModels & Document & { _id: Types.ObjectId };

const productSchema = new Schema<productModels>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    sku: {
      type: String,
      required: true,
      unique: true,
    },
    weight: {
      type: Number,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true, collection: "Product" }
);

productSchema.virtual("Comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "Product",
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

export default model<productModels>("Product", productSchema);
