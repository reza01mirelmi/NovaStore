import { Request, Response, NextFunction } from "express";
const validComment = require("./../../Validators/Valid_Comments");
import {
  createCommentService,
  deleteCommentService,
  getCommentService,
  updateCommentService,
} from "./../../services/comment.services";
import { commentType } from "../../Types/comment";
const createComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validBody = validComment(req.body);
    const userId = req.user._id;

    if (validBody !== true) {
      return res.status(400).json({ message: "Invalid request data.❌" });
    }
    const { productId, body } = req.body;

    const result = await createCommentService(body, userId, productId);

    return res.status(result.code).json({
      message: result.message,
      comment: result.commentToObject || undefined,
    });
  } catch (err) {
    next(err);
  }
};

const getComment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isAdmin = req.user?.role;

    const result = await getCommentService(isAdmin);
    return res
      .status(200)
      .json({ message: result.message, comment: result.comment || undefined });
  } catch (err) {
    next(err);
  }
};

const updateComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const content: commentType = req.body.body;
    const userId = req.user._id;
    const commentId = req.params.id;
    if (!req.body?.body || req.body.body.trim() === "") {
      return res.status(400).json({
        message: "Invalid body: comment text is required ❌",
      });
    }
    const result = await updateCommentService(content, userId, commentId);
    return res
      .status(200)
      .json({ message: result.message, comment: result.comment || undefined });
  } catch (err) {
    next(err);
  }
};

const deleteComment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const role = req.user?.role;
    const commentId = req.params.id;
    const userId = req.user._id;

    const result = await deleteCommentService(role, commentId, userId);

    return res
      .status(200)
      .json({ message: result.message, comment: result.comment || undefined });
  } catch (err) {
    next(err);
  }
};

export default {
  createComment,
  getComment,
  updateComment,
  deleteComment,
};
