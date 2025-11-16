const express = require("express");
const commentController = require("../../Controllers/v1/Comments_Controllers");
const verifytokenMidd = require("./../../Middleware/VerifyToken");
const validObjectId = require("./../../Middleware/validateObjectId");
const router = express.Router();

router
  .route("/")
  .post(
    validObjectId("productId"),
    verifytokenMidd,
    commentController.createComment
  )
  .get(verifytokenMidd, commentController.getComment);

router
  .route("/:id")
  .put(validObjectId("id"), verifytokenMidd, commentController.updateComment)
  .delete(
    validObjectId("id"),
    verifytokenMidd,
    commentController.deleteComment
  );

module.exports = router;
