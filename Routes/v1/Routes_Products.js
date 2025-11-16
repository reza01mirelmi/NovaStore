const express = require("express");
const productControllers = require("../../Controllers/v1/Product_Controllers");
const verifytokenMidd = require("./../../Middleware/VerifyToken");
const checkAdmin = require("../../Middleware/CheckAdmins");
const validObjectId = require("./../../Middleware/validateObjectId");
const uploader = require("../../Middleware/uploader");
const router = express.Router();

router
  .route("/")
  .get(productControllers.allProduct)
  .post(
    verifytokenMidd,
    checkAdmin,
    uploader.single("image"),
    productControllers.productCreation
  );
router.route("/search").get(productControllers.searchProducts);
router.route("/:id").get(validObjectId("id"), productControllers.getProduct);

router
  .route("/admin/:id")
  .put(
    validObjectId("id"),
    verifytokenMidd,
    checkAdmin,
    uploader.single("image"),
    productControllers.updateProduct
  )
  .delete(
    validObjectId("id"),
    verifytokenMidd,
    checkAdmin,
    productControllers.deleteProduct
  );

module.exports = router;
