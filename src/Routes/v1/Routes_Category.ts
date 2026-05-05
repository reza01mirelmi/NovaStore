import express from "express";
import categoryController from "../../Controllers/v1/Category_Controllers";
import verifytokenMidd from "./../../Middleware/VerifyToken";
import checkAdminMidd from "./../../Middleware/CheckAdmins";
import validObjectId from "./../../Middleware/validateObjectId";

const router = express.Router();

router
  .route("/")
  .post(verifytokenMidd, checkAdminMidd, categoryController.createCategory)
  .get(categoryController.getAllCategory);

router.route("/:id").get(validObjectId("id"), categoryController.getCategory);

router
  .route("/admin/:id")
  .put(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    categoryController.updateCategory,
  )
  .delete(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    categoryController.deleteCategory,
  );

export default router;
