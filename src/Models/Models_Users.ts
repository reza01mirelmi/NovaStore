import { Schema, model } from "mongoose";
import { userModels } from "../Types/user";

const UserSchema = new Schema<userModels>(
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
  { timestamps: true }
);

UserSchema.virtual("orders", {
  ref: "Order",
  localField: "_id",
  foreignField: "userId",
});

const Users = model("User", UserSchema, "User");
module.exports = Users;
