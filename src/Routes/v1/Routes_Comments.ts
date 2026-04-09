import express from "express";
import commentController from "../../Controllers/v1/Comments_Controllers";
import verifytokenMidd from "./../../Middleware/VerifyToken";
import validObjectId from "./../../Middleware/validateObjectId";

const router = express.Router();

router
  .route("/")
  .post(
    validObjectId("productId"),
    verifytokenMidd,
    commentController.createComment,
  )
  .get(verifytokenMidd, commentController.getComment);

router
  .route("/:id")
  .put(validObjectId("id"), verifytokenMidd, commentController.updateComment)
  .delete(
    validObjectId("id"),
    verifytokenMidd,
    commentController.deleteComment,
  );

export default router;
