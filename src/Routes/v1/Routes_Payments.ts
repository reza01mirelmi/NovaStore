const express = require("express");
const paymentController = require("./../../Controllers/v1/Payments_Controllers");
const verifytokenMidd = require("./../../Middleware/VerifyToken");
const checkAdminMidd = require("./../../Middleware/CheckAdmins");
const validObjectId = require("./../../Middleware/validateObjectId");

const router = express.Router();

router
  .route("/")
  .post(
    validObjectId("orderId"),
    verifytokenMidd,
    paymentController.createPayment
  )
  .get(verifytokenMidd, checkAdminMidd, paymentController.getPayments);

router
  .route("/admin/:id")
  .put(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    paymentController.updatePayment
  )
  .delete(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    paymentController.deletePayment
  );

module.exports = router;
