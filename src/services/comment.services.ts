import modelsComment from "./../Models/Models_Comment";
import productModel from "./../Models/Models_Products";
import userModele from "./../Models/Models_Users";
import { Types } from "mongoose";
import { commentType } from "../Types/comment";

const createCommentService = async (
  input: commentType,
  userId: string,
  productId: string,
) => {
  const user = await userModele.findById(userId).lean();

  if (!user) {
    return { ok: false, code: 404, message: "User not found❌" };
  }

  const product = await productModel.findOne({ _id: productId }).lean();

  if (!product) {
    return { ok: false, code: 404, message: "product not found❌" };
  }
  const existingComment = await modelsComment.findOne({
    userId: user._id,
    productId,
    input,
  });

  if (existingComment) {
    return {
      ok: false,
      code: 400,
      message: "You already commented the same text.❌",
    };
  }
  const comment = await modelsComment.create({
    productId,
    userId: user._id,
    input,
  });
  const commentToObject = comment.toObject();
  Reflect.deleteProperty(commentToObject, "__v");

  return {
    ok: true,
    code: 200,
    message: "Creating Scuccssfuly ✅",
    commentToObject,
  };
};

const getCommentService = async (isAdmin: string) => {
  const isAdmins = isAdmin === "ADMIN";
  let comment;

  if (isAdmin) {
    comment = await modelsComment
      .find({}, "-__v")
      .populate("userId", "name")
      .lean();
  } else {
    comment = await modelsComment
      .find({}, "-__v -updatedAt")
      .populate("userId", "name -_id")
      .lean();
  }

  if (comment.length === 0) {
    return {
      ok: true,
      code: 200,
      message: "Comment Not found.❌",
      comment: [],
    };
  }

  return {
    ok: true,
    code: 200,
    message: "Comments retrieved successfully✅",
    comment,
  };
};

const updateCommentService = async (
  content: commentType,
  userId: string,
  commentId: any,
) => {
  let updates: any = {};
  if (content) updates.body = content;

  const existingComment = await modelsComment
    .findOne({
      body: updates.body,
      userId: userId,
    })
    .lean();
  if (existingComment) {
    return { ok: false, code: 400, message: "No change found.❌" };
  }
  const comment = await modelsComment
    .findOneAndUpdate(
      {
        _id: commentId,
        userId,
      },
      updates,
      { new: true },
    )
    .select("-__v");

  if (!comment) {
    return { ok: false, code: 404, message: "No comment found.❌" };
  }
  return {
    ok: true,
    code: 200,
    message: "Comment successfully updated✅",
    comment,
  };
};

const deleteCommentService = async (
  role: string,
  commentId: any,
  userId: string,
) => {
  let comment;

  const isAdmin = role === "ADMIN";

  if (isAdmin) {
    comment = await modelsComment
      .findOneAndDelete({ _id: commentId })
      .select("-__v -createdAt ");
  } else {
    comment = await modelsComment
      .findOneAndDelete({
        _id: commentId,
        userId,
      })
      .select("-__v -createdAt -updatedAt");
  }

  if (!comment) {
    return { ok: false, code: 404, message: "There is no comment.❌" };
  }

  return {
    ok: true,
    code: 200,
    message: "Cleared successfully✅",
    comment,
  };
};
export {
  createCommentService,
  getCommentService,
  updateCommentService,
  deleteCommentService,
};
