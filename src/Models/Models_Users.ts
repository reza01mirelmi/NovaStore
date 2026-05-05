import { Schema, model, Document, Types } from "mongoose";
import { UsersDTO } from "../Types/user";
export type UserDocument = UsersDTO & Document & { _id: Types.ObjectId };

const userSchema = new Schema<UsersDTO>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  { timestamps: true, collection: "User" },
);

userSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "userId",
});

userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

export default model("User", userSchema);
