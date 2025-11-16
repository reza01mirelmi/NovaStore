const modelsOrders = require("../../Models/Models_Orders");
const productModel = require("../../Models/Models_Products");
const validOrders = require("./../../Validators/Valid_Orders");
const { isValidObjectId } = require("mongoose");

exports.createOrder = async (req, res, next) => {
  try {
    const isBodyValidated = validOrders(req.body);

    if (isBodyValidated != true) {
      return res.status(400).json({ message: "The data sent is not valid.❌" });
    }
    const { productId, quantity, address } = req.body;
    const findproduct = await productModel.findById({ _id: productId });

    if (!findproduct) {
      return res.status(404).json({ message: "Product not found.❌" });
    }
    const totalPrice = findproduct.price * quantity;

    const findOrder = await modelsOrders.findOne({
      userId: req.user._id,
      productId,
    });
    if (findOrder) {
      const updateOrders = await modelsOrders.findOneAndUpdate(
        { userId: req.user._id, productId },
        {
          $inc: { quantity },
          $set: {
            totalPrice: findOrder.totalPrice + findproduct.price,
          },
        },
        { new: true }
      );
      if (updateOrders) {
        return res.status(200).json({ message: "Order quantity increased ✅" });
      }
    }
    const createOrders = await modelsOrders.create({
      userId: req.user._id,
      productId,
      quantity,
      totalPrice,
      address,
    });

    return res
      .status(201)
      .json({ message: "Order successfully placed✅", createOrders });
  } catch (err) {
    next(err);
  }
};

exports.getMyOrder = async (req, res, next) => {
  try {
    const orders = await modelsOrders
      .find({ userId: req.user._id })
      .select("status quantity totalPrice address")
      .populate("productId userId", "title price name email")
      .lean();
    if (orders.length === 0) {
      return res.status(200).json({ message: "No orders found.", orders: [] });
    }
    return res
      .status(200)
      .json({ message: "Order found successfully✅", orders });
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await modelsOrders
      .find({})
      .select("_id productId quantity totalPrice status address")
      .populate("productId userId", "title price name email")
      .lean();
    if (orders.length === 0) {
      return res.status(200).json({ message: "No orders found.", orders: [] });
    }
    return res
      .status(200)
      .json({ message: "Orders retrieved successfully✅", orders });
  } catch (err) {
    next(err);
  }
};

exports.getOrderDetails = async (req, res, next) => {
  try {
    const order = await modelsOrders
      .findOne({ _id: req.params.id })
      .select("status quantity totalPrice address")
      .populate("productId userId", "title price name email")
      .lean();
    if (!order) {
      return res.status(200).json({ message: "Order not found.❌" });
    }

    return res
      .status(200)
      .json({ message: "The desired order was found✅", order });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const allowedStatuses = [
      "pending",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status ❌" });
    }
    const updateStatus = await modelsOrders.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: { status },
      },
      { new: true }
    );

    if (!updateStatus) {
      return res.status(404).json({ message: "No orders found.❌" });
    }

    return res
      .status(200)
      .json({ message: "status updated successfully✅", updateStatus });
  } catch (err) {
    next(err);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    let deleteOrders;
    // Admins can delete any order
    if (req.user.Role == "ADMIN") {
      deleteOrders = await modelsOrders.findOneAndDelete({
        _id: req.params.id,
      });
    }
    // Regular users can delete only their own orders
    else {
      deleteOrders = await modelsOrders.findOneAndDelete({
        _id: req.params.id,
        userId: req.user._id,
      });
    }
    if (!deleteOrders) {
      return res.status(404).json({ message: "No order found ❌" });
    }

    return res.status(200).json({ message: "Order successfully deleted✅" });
  } catch (err) {
    next(err);
  }
};
