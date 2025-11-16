const mongoose = require("mongoose");

const OrdersSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
    },
    userId: {
      type: mongoose.Types.ObjectId,
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

const Orders = mongoose.model("Comment", OrdersSchema, "Comment");
module.exports = Orders;
