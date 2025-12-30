const paymentModel = require("../../Models/Models_Payment");
const orderModel = require("../../Models/Models_Orders");
const userModel = require("../../Models/Models_Users");
const validPayment = require("../../Validators/Valid_Payment");
const validStatus = require("../../Validators/Valid_PaymentStatus");
const { v4: uuidv4 } = require("uuid");

exports.createPayment = async (req, res, next) => {
  try {
    const allowedMethods = [
      "credit_card",
      "paypal",
      "zarinpal",
      "stripe",
      "cash",
    ];
    const validBody = validPayment(req.body);
    const paymentID = `GOLDPAY-${uuidv4()}`;

    if (validBody !== true) {
      return res
        .status(400)
        .json({ message: "The data sent is not valid.❌", validBody });
    }

    const { orderId, method } = req.body;

    if (!allowedMethods.includes(method)) {
      return res
        .status(400)
        .json({ message: "Payment method is not valid.❌" });
    }

    const user = await userModel.findOne({ _id: req.user._id }).lean();
    const orders = await orderModel.findOne({ _id: orderId }).lean();

    if (!orders) {
      return res.status(404).json({ message: "Order not found.❌" });
    }

    if (!orders.userId.equals(user._id)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to access this order.❌" });
    }

    const existingPayment = await paymentModel.findOne({ orderId });
    if (existingPayment) {
      return res
        .status(400)
        .json({ message: "Payment for this order already exists ❌" });
    }
    const payments = await paymentModel.create({
      orderId,
      userId: user._id,
      amount: orders.totalPrice,
      method,
      paymentId: paymentID,
    });

    return res
      .status(201)
      .json({ message: "Payment created successfully✅", payments });
  } catch (err) {
    next(err);
  }
};

exports.getPayments = async (req, res, next) => {
  try {
    const user = await userModel.findOne({ _id: req.user._id }).lean();
    let filter = {};

    if (user.role == "USER") filter = { userId: user._id };

    payments = await paymentModel
      .find(filter, "-__v")
      .populate("orderId userId", "totalPrice status name email")
      .lean();

    if (payments.length == 0) {
      return res
        .status(200)
        .json({ message: "No payment found.❌", payments: [] });
    }

    return res
      .status(200)
      .json({ message: "Payment found successfully✅", payments });
  } catch (err) {
    next(err);
  }
};

exports.updatePayment = async (req, res, next) => {
  try {
    const validBody = validStatus(req.body);
    if (validBody !== true) {
      return res
        .status(400)
        .json({ message: "The data sent is not valid.❌", validBody });
    }
    const { status } = req.body;
    const payment = await paymentModel.findOne({ _id: req.params.id }).lean();

    if (!payment) {
      return res.status(404).json({ message: "Payment not found.❌" });
    }
    const statusPayment = await paymentModel.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: { status } },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "status updated successfully✅", statusPayment });
  } catch (err) {
    next(err);
  }
};

exports.deletePayment = async (req, res, next) => {
  try {
    const payment = await paymentModel.findOneAndDelete({
      _id: req.params.id,
    });

    if (!payment) {
      return res.status(404).json({ message: "Payment not found❌" });
    }

    return res.status(200).json({ message: "Payment deleted✅", payment });
  } catch (err) {
    next(err);
  }
};
