import { Schema, model } from "mongoose";
import { typeOrders } from "../Types/orders";

const OrdersSchema = new Schema<typeOrders>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    quantity: {
      type: Number,
      default: 1,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    address: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, collection: "Order" },
);

export default model<typeOrders>("Order", OrdersSchema);
