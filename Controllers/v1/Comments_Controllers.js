const modelsComment = require("../../Models/Models_Comment");
const productModel = require("../../Models/Models_Products");
const userModel = require("../../Models/Models_Users");
const validComment = require("./../../Validators/Valid_Comments");

exports.createComment = async (req, res, next) => {
  try {
    const validBody = validComment(req.body);

    if (validBody !== true) {
      return res.status(400).json({ message: "Invalid request data.❌" });
    }
    const { productId, body } = req.body;
    const user = await userModel.findById(req.user._id).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found❌" });
    }
    const product = await productModel.findOne({ _id: productId }).lean();

    if (!product) {
      return res.status(404).json({ message: "product not found❌" });
    }
    const existingComment = await modelsComment.findOne({
      userId: user._id,
      productId,
      body,
    });

    if (existingComment) {
      return res
        .status(400)
        .json({ message: "You already commented the same text.❌" });
    }

    const comment = await modelsComment.create({
      productId,
      userId: user._id,
      body,
    });

    const toObject = comment.toObject();
    Reflect.deleteProperty(toObject, "__v");
    return res
      .status(201)
      .json({ meseage: "Creating Scuccssfuly ✅", toObject });
  } catch (err) {
    next(err);
  }
};

exports.getComment = async (req, res, next) => {
  try {
    let comment;

    const isAdmin = req.user?.role === "ADMIN";

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
      return res
        .status(200)
        .json({ message: "Comment Not found.❌", comment: [] });
    }

    return res
      .status(200)
      .json({ message: "Comments retrieved successfully✅", comment });
  } catch (err) {
    next(err);
  }
};

exports.updateComment = async (req, res, next) => {
  try {
    if (!req.body?.body || req.body.body.trim() === "") {
      return res.status(400).json({
        message: "Invalid body: comment text is required ❌",
      });
    }
    let updates = {};
    if (req.body.body) updates.body = req.body.body;

    const existingComment = await modelsComment
      .findOne({ body: updates.body, userId: req.user._id })
      .lean();
    if (existingComment) {
      return res.status(400).json({ message: "No change found.❌" });
    }
    const comment = await modelsComment
      .findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.user._id,
        },
        updates,
        { new: true }
      )
      .select("-__v");

    if (!comment) {
      return res.status(404).json({ message: "No comment found.❌" });
    }

    return res
      .status(200)
      .json({ message: "Comment successfully updated✅", comment });
  } catch (err) {
    next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    let comment;

    const isAdmin = req.user?.role === "ADMIN";

    if (isAdmin) {
      comment = await modelsComment
        .findOneAndDelete({ _id: req.params.id })
        .select("-__v -createdAt ");
    } else {
      comment = await modelsComment
        .findOneAndDelete({
          _id: req.params.id,
          userId: req.user._id,
        })
        .select("-__v -createdAt -updatedAt");
    }

    if (!comment) {
      return res.status(404).json({ message: "There is no comment.❌" });
    }

    return res.status(200).json({ message: "Cleared successfully✅", comment });
  } catch (err) {
    next(err);
  }
};
