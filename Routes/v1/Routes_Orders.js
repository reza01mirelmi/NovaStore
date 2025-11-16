const express = require("express");
const orderController = require("../../Controllers/v1/Orders_Controllers");
const verifytokenMidd = require("./../../Middleware/VerifyToken");
const checkAdminMidd = require("./../../Middleware/CheckAdmins");
const validObjectId = require("./../../Middleware/validateObjectId");

const router = express.Router();

router
  .route("/")
  .post(
    validObjectId("productId"),
    verifytokenMidd,
    orderController.createOrder
  );
router.route("/my").get(verifytokenMidd, orderController.getMyOrder);
router
  .route("/:id")
  .delete(validObjectId("id"), verifytokenMidd, orderController.deleteOrder);

router
  .route("/admin")
  .get(verifytokenMidd, checkAdminMidd, orderController.getAllOrders);

router
  .route("/admin/status/:id")
  .put(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    orderController.updateOrderStatus
  );

router
  .route("/admin/:id")
  .get(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    orderController.getOrderDetails
  );

module.exports = router;
