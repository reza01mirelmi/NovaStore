import { ObjectId, Types } from "mongoose";
import modelsOrders from "../../src/Models/Models_Orders";
import productModel from "../../src/Models/Models_Products";
import { typeOrders } from "../Types/orders";

const createOrdersService = async (
  productId: Types.ObjectId,
  quantity: number,
  address: string,
  userId: string,
) => {
  const findproduct = await productModel.findById({ _id: productId });
  if (!findproduct) {
    return { ok: false, code: 404, message: "Product not found.❌" };
  }
  const totalPrice = findproduct.price * quantity;

  const findOrder = await modelsOrders.findOne({
    userId,
    productId,
  });
  if (findOrder) {
    const updateOrders = await modelsOrders.findOneAndUpdate(
      { userId, productId },
      {
        $inc: { quantity },
        $set: {
          totalPrice: findOrder.totalPrice + findproduct.price,
        },
      },
      { new: true },
    );
    if (updateOrders) {
      return { ok: true, code: 200, message: "Order quantity increased ✅" };
    }
  }
  const createOrders = await modelsOrders.create({
    userId,
    productId,
    quantity,
    totalPrice,
    address,
  });

  return {
    ok: true,
    code: 201,
    message: "Order successfully placed✅",
    createOrders,
  };
};
const getOrderService = async (userId: string) => {
  const orders = await modelsOrders
    .find({ userId })
    .select("status quantity totalPrice address")
    .populate("productId userId", "title price name email")
    .lean();
  if (orders.length === 0) {
    return { ok: true, code: 200, message: "No orders found.", orders: [] };
  }
  return {
    ok: true,
    code: 200,
    message: "Order found successfully✅",
    orders,
  };
};

const getAllOrdersService = async () => {
  const orders = await modelsOrders
    .find({})
    .select("_id productId quantity totalPrice status address")
    .populate("productId userId", "title price name email")
    .lean();
  if (orders.length === 0) {
    return { ok: true, code: 200, message: "No orders found.", orders: [] };
  }
  return {
    ok: true,
    code: 200,
    message: "Orders retrieved successfully✅",
    orders,
  };
};

const getDetailsService = async (orderId: any) => {
  const order = await modelsOrders
    .findOne({ _id: orderId })
    .select("status quantity totalPrice address")
    .populate("productId userId", "title price name email")
    .lean();
  if (!order) {
    return { ok: true, code: 200, message: "Order not found.❌" };
  }
  return {
    ok: true,
    code: 200,
    message: "The desired order was found✅",
    order,
  };
};

const updateStatusService = async (status: string, orderId: any) => {
  const updateStatus = await modelsOrders.findOneAndUpdate(
    { _id: orderId },
    {
      $set: { status },
    },
    { new: true },
  );

  if (!updateStatus) {
    return { ok: false, code: 404, message: "No orders found.❌" };
  }

  return {
    ok: true,
    code: 200,
    message: "status updated successfully✅",
    updateStatus,
  };
};

const deleteOrderService = async (
  role: string,
  orderId: string,
  userId: string,
) => {
  let deleteOrders;
  // Admins can delete any order
  if (role == "ADMIN") {
    deleteOrders = await modelsOrders.findOneAndDelete({
      _id: orderId,
    });
  }
  // Regular users can delete only their own orders
  else {
    deleteOrders = await modelsOrders.findOneAndDelete({
      _id: orderId,
      userId: userId,
    });
  }
  if (!deleteOrders) {
    return { ok: false, code: 404, message: "No order found ❌" };
  }
  return {
    ok: true,
    code: 200,
    message: "Order successfully deleted✅",
  };
};

export {
  createOrdersService,
  getOrderService,
  getAllOrdersService,
  getDetailsService,
  updateStatusService,
  deleteOrderService,
};
