import { Request, Response, NextFunction } from "express";
import validPayment from "../../Validators/Valid_Payment";
import validStatus from "../../Validators/Valid_PaymentStatus";
import {
  createPaymentService,
  deletePaymentService,
  getPaymentsService,
  updatePaymentService,
} from "../../services/payments.services";

const createPayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user._id;
    const allowedMethods = [
      "credit_card",
      "paypal",
      "zarinpal",
      "stripe",
      "cash",
    ];
    const validBody = validPayment(req.body);

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
    const result = await createPaymentService(orderId, method, userId);

    return res
      .status(result.code)
      .json({ message: result.message, payment: result.payments });
  } catch (err) {
    next(err);
  }
};

const getPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;

    const result = await getPaymentsService(userId);

    return res.status(result.code).json({
      message: result.message,
      payments: result.payments || undefined,
    });
  } catch (err) {
    next(err);
  }
};

const updatePayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const paymentId = req.params.id as string;
    const validBody = validStatus(req.body);
    if (validBody !== true) {
      return res
        .status(400)
        .json({ message: "The data sent is not valid.❌", validBody });
    }
    const { status } = req.body;
    const result = await updatePaymentService(paymentId, status);

    return res
      .status(result.code)
      .json({ message: result.message, payment: result.statusPayment });
  } catch (err) {
    next(err);
  }
};

const deletePayment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const paymentId = req.params.id as string;

    const result = await deletePaymentService(paymentId);

    return res
      .status(result.code)
      .json({ message: result.message, payment: result.payment });
  } catch (err) {
    next(err);
  }
};

export default {
  createPayment,
  getPayments,
  updatePayment,
  deletePayment,
};
