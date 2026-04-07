import { Schema, model, Types } from "mongoose";
import { paymentModels } from "../Types/payment";

const PaymentSchema = new Schema<paymentModels>(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["credit_card", "paypal", "zarinpal", "stripe", "cash"],
      required: true,
    },
    paymentId: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true, collection: "Payment" },
);
PaymentSchema.set("toJSON", { virtuals: true });
PaymentSchema.set("toObject", { virtuals: true });
const Payments = model("Payment", PaymentSchema);
export default Payments;
