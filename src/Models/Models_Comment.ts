import { Schema, model, Types } from "mongoose";
import { commentType } from "../Types/comment";

const CommentSchema = new Schema<commentType>(
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
  { timestamps: true },
);

export default model("Comment", CommentSchema);
