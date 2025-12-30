const productModel = require("../../Models/Models_Products");
const categoryModel = require("../../Models/Models_Category");
const validProduct = require("../../Validators/Valid_Products");
const { isValidObjectId } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

exports.productCreation = async (req, res, next) => {
  try {
    const validproduct = validProduct(req.body);
    const sku = `GOLD-${uuidv4()}`;
    const imageURL = req.file
      ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(
          /\\/g,
          "/"
        )}`
      : null;

    if (validproduct !== true) {
      return res
        .status(422)
        .json({ message: "The data sent is not valid.❌", validproduct });
    }
    const { title, description, price, weight, category } = req.body;
    const products = await productModel.create({
      title,
      description,
      price,
      weight,
      category,
      sku,
      image: imageURL,
    });

    const toObjectProduct = products.toObject();
    Reflect.deleteProperty(toObjectProduct, "__v");
    Reflect.deleteProperty(toObjectProduct, "updatedAt");

    return res.status(201).json({
      message: "Create Products successfully✅",
      products: toObjectProduct,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Product with this SKU already exists ❌" });
    }
    next(err);
  }
};

exports.allProduct = async (req, res, next) => {
  try {
    const query = {};

    if (req.query.minPrice && req.query.maxPrice) {
      query.price = {
        $gte: Number(req.query.minPrice),
        $lte: Number(req.query.maxPrice),
      };
    }

    const categoryName = req.query.category;
    const category = await categoryModel.findOne({
      $or: {
        title: categoryName,
        description: categoryModel,
      },
    });
    if (category) {
      query.category = category._id;
    }
    if (req.query.inStock) {
      query.inStock = req.query.inStock === "true";
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const product = await productModel
      .find(query, "-__v -updatedAt")
      .skip(skip)
      .limit(limit)
      .populate("category", "title slug")
      .lean();

    if (product.length == 0) {
      return res
        .status(200)
        .json({ message: "No products found.❌", products: [] });
    }
    return res
      .status(200)
      .json({ message: "All Product Succssfully✅", products: product });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await productModel
      .findOne({ _id: req.params.id }, "-__v -updatedAt")
      .populate("Comments category", "title slug")
      .lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found.❌" });
    }
    return res
      .status(200)
      .json({ message: "Received successfully✅", product });
  } catch (err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await productModel.findOne({ _id: req.params.id }, "-__v");

    if (!product) {
      return res.status(404).json({ message: "Product not found.❌" });
    }

    const imageURL = req.file
      ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(
          /\\/g,
          "/"
        )}`
      : null;
    let isChanged = false;
    const allowedParametr = [
      "title",
      "description",
      "price",
      "weight",
      "category",
      "image",
    ];

    for (let key of allowedParametr) {
      if (key === "image" && imageURL) {
        product.image = imageURL;
        isChanged = true;
      } else if (
        req.body?.[key] != undefined &&
        req.body[key] != product[key]
      ) {
        product[key] = req.body[key];
        isChanged = true;
      }
    }
    if (!isChanged) {
      return res.status(400).json({ message: "No changes detected ❌" });
    }

    await product.save();

    return res.status(200).json({
      message: "The desired fields were successfully updated✅",
      products: product,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await productModel.findOneAndDelete({ _id: req.params.id });

    if (!product) {
      return res.status(404).json({ message: "Product not found.❌" });
    }

    return res
      .status(200)
      .json({ message: "Removed successfully✅", products: product });
  } catch (err) {
    next(err);
  }
};

exports.searchProducts = async (req, res, next) => {
  try {
    const { title } = req.query;
    const product = await productModel
      .find({
        title: { $regex: title || "", $options: "i" },
      })
      .select("-__v -updatedAt -createdAt");

    if (!product.length) {
      return res.status(404).json({ message: "Product not found.❌" });
    }

    return res.status(200).json({ message: "Search is successful✅", product });
  } catch (err) {
    next(err);
  }
};
