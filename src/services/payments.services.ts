import paymentModel from "../Models/Models_Payment";
import orderModel from "../Models/Models_Orders";
import userModel from "./../Models/Models_Users";
import { v4 as uuidv4 } from "uuid";

const createPaymentService = async (
  orderId: string,
  method: string,
  userId: string,
) => {
  const paymentID = `GOLDPAY-${uuidv4()}`;
  const orders = await orderModel.findOne({ _id: orderId }).lean();

  if (!orders) {
    return { ok: false, code: 404, message: "Order not found.❌" };
  }

  if (!orders.userId.equals(userId)) {
    return {
      ok: false,
      code: 403,
      message: "You are not allowed to access this order.❌",
    };
  }

  const existingPayment = await paymentModel.findOne({ orderId });
  if (existingPayment) {
    return {
      ok: false,
      code: 400,
      message: "Payment for this order already exists ❌",
    };
  }
  const payments = await paymentModel.create({
    orderId,
    userId,
    amount: orders.totalPrice,
    method,
    paymentId: paymentID,
  });
  return {
    ok: true,
    code: 201,
    message: "Payment created successfully✅",
    payments,
  };
};

const getPaymentsService = async (userId: string) => {
  const user = await userModel.findOne({ _id: userId }).lean();
  let filter = {};

  if (user!.role == "USER") filter = { userId: user!._id };

  const payments = await paymentModel
    .find(filter, "-__v")
    .populate("orderId userId", "totalPrice status name email")
    .lean();

  if (payments.length == 0) {
    return {
      ok: true,
      code: 200,
      message: "No payment found.❌",
      payments: [],
    };
  }

  return {
    ok: true,
    code: 200,
    message: "Payment found successfully✅",
    payments,
  };
};

const updatePaymentService = async (paymentId: string, status: string) => {
  const payment = await paymentModel.findOne({ _id: paymentId }).lean();

  if (!payment) {
    return { ok: false, code: 404, message: "Payment not found.❌" };
  }
  const statusPayment = await paymentModel.findByIdAndUpdate(
    { _id: paymentId },
    { $set: { status } },
    { new: true },
  );

  return {
    ok: true,
    code: 200,
    message: "status updated successfully✅",
    statusPayment,
  };
};

const deletePaymentService = async (paymentId: string) => {
  const payment = await paymentModel.findOneAndDelete({
    _id: paymentId,
  });

  if (!payment) {
    return { ok: false, code: 404, message: "Payment not found❌" };
  }

  return {
    ok: true,
    code: 200,
    message: "Payment deleted✅",
    payment,
  };
};

export {
  createPaymentService,
  getPaymentsService,
  updatePaymentService,
  deletePaymentService,
};
