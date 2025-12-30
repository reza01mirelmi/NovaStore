const express = require("express");
const categoryController = require("../../Controllers/v1/Category_Controllers");
const verifytokenMidd = require("./../../Middleware/VerifyToken");
const checkAdminMidd = require("./../../Middleware/CheckAdmins");
const validObjectId = require("./../../Middleware/validateObjectId");

const router = express.Router();

router
  .route("/")
  .post(verifytokenMidd, checkAdminMidd, categoryController.createCategory)
  .get(categoryController.getAllCategory);

router.route("/:id").get(validObjectId("id"), categoryController.getById);

router
  .route("/admin/:id")
  .put(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    categoryController.updateCategory
  )
  .delete(
    validObjectId("id"),
    verifytokenMidd,
    checkAdminMidd,
    categoryController.deleteCategory
  );

module.exports = router;
