import express from "express";
import orderController from "../../Controllers/v1/Orders_Controllers";
import verifytokenMidd from "./../../Middleware/VerifyToken";
import checkAdminMidd from "./../../Middleware/CheckAdmins";
import validObjectId from "./../../Middleware/validateObjectId";

const router = express.Router();

router
  .route("/")
  .post(
    validObjectId("productId"),
    verifytokenMidd,
    orderController.createOrder,
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
    orderController.updateOrderStatus,
  );

router
  .route("/admin/:id")
  .get(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    orderController.getOrderDetails,
  );

export default router;
