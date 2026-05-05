import { Request, Response, NextFunction } from "express";
import validOrders from "./../../Validators/Valid_Orders";
import { typeOrders } from "../../Types/orders";
import {
  createOrdersService,
  deleteOrderService,
  getAllOrdersService,
  getDetailsService,
  getOrderService,
  updateStatusService,
} from "../../services/orders.services";

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const isBodyValidated = validOrders(req.body);

    if (isBodyValidated != true) {
      return res.status(400).json({ message: "The data sent is not valid.❌" });
    }
    const { productId, quantity, address }: typeOrders = req.body;

    const result = await createOrdersService(
      productId,
      quantity,
      address,
      userId,
    );
    return res.status(result.code).json({
      message: result.message,
      orders: result.createOrders || undefined,
    });
  } catch (err) {
    next(err);
  }
};

const getMyOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id;
    const result = await getOrderService(userId);
    return res.status(result.code).json({
      message: result.message,
      orders: result.orders || undefined,
    });
  } catch (err) {
    next(err);
  }
};

const getAllOrders = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getAllOrdersService();

    return res.status(result.code).json({
      message: result.message,
      orders: result.orders || undefined,
    });
  } catch (err) {
    next(err);
  }
};

const getOrderDetails = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const orderId = req.params.id;

    const result = await getDetailsService(orderId);

    return res.status(result.code).json({
      message: result.message,
      order: result.order || undefined,
    });
  } catch (err) {
    next(err);
  }
};

const updateOrderStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    const { status } = req.body;
    const orderId = req.params.id;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status ❌" });
    }

    const result = await updateStatusService(status, orderId);

    return res.status(result.code).json({
      message: result.message,
      order: result.updateStatus || undefined,
    });
  } catch (err) {
    next(err);
  }
};

const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const role = req.user.Role;
    const orderId = req.params.id as string;
    const userId = req.user._id;

    const result = await deleteOrderService(role, orderId, userId);
    return res.status(result.code).json({
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

export default {
  createOrder,
  getMyOrder,
  getAllOrders,
  getOrderDetails,
  updateOrderStatus,
  deleteOrder,
};
