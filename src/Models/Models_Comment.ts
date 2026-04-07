import { Schema, model, Types } from "mongoose";
import { commentModels } from "../Types/comment";

const CommentSchema = new Schema<commentModels>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    body: {
      type: String,
      required: true,
      maxlength: 500,
      unique: true,
    },
  },
  { timestamps: true }
);

export default model<commentModels>("Comment", CommentSchema);
