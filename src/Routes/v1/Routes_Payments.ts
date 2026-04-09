import express from "express";
import paymentController from "./../../Controllers/v1/Payments_Controllers";
import verifytokenMidd from "./../../Middleware/VerifyToken";
import checkAdminMidd from "./../../Middleware/CheckAdmins";
import validObjectId from "./../../Middleware/validateObjectId";

const router = express.Router();

router
  .route("/")
  .post(
    validObjectId("orderId"),
    verifytokenMidd,
    paymentController.createPayment,
  )
  .get(verifytokenMidd, checkAdminMidd, paymentController.getPayments);

router
  .route("/admin/:id")
  .put(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    paymentController.updatePayment,
  )
  .delete(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    paymentController.deletePayment,
  );

export default router;
