import express from "express";
import productControllers from "../../Controllers/v1/Product_Controllers";
import verifytokenMidd from "./../../Middleware/VerifyToken";
import checkAdmin from "../../Middleware/CheckAdmins";
import validObjectId from "./../../Middleware/validateObjectId";
import uploader from "../../Middleware/uploader";

const router = express.Router();

router
  .route("/")
  .get(productControllers.allProduct)
  .post(
    verifytokenMidd,
    checkAdmin,
    uploader.single("image"),
    productControllers.productCreation,
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
    productControllers.updateProduct,
  )
  .delete(
    validObjectId("id"),
    verifytokenMidd,
    checkAdmin,
    productControllers.deleteProduct,
  );

export default router;
