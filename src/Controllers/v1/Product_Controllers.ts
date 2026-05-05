import { Request, Response, NextFunction } from "express";
import validProduct from "../../Validators/Valid_Products";
import { ProductQuery, productType } from "../../Types/product";
import {
  productCreationService,
  allProductService,
  getCategoryIdByName,
  getProductService,
  updateProductService,
  deleteProductService,
  searchProductsService,
} from "../../services/product.services";

const productCreation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const validproduct = validProduct(req.body);
    const imageURL = req.file
      ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(
          /\\/g,
          "/",
        )}`
      : null;

    if (validproduct !== true) {
      return res
        .status(422)
        .json({ message: "The data sent is not valid.❌", validproduct });
    }
    const { title, description, price, weight, category }: productType =
      req.body;
    const result = await productCreationService(
      title,
      description,
      price,
      weight,
      category,
      imageURL,
    );
    return res.status(result.code).json({
      message: result.code,
      products: result.toObjectProduct,
    });
  } catch (err: any) {
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ message: "Product with this SKU already exists ❌" });
    }
    next(err);
  }
};

const allProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query: ProductQuery = {};

    if (req.query.minPrice && req.query.maxPrice) {
      query.price = {
        $gte: Number(req.query.minPrice),
        $lte: Number(req.query.maxPrice),
      };
    }

    const categoryName = req.query.category as string;
    const categoryId = await getCategoryIdByName(categoryName);
    if (categoryId) {
      (query as any).category = categoryId;
    }
    if (req.query.inStock) {
      query.inStock = req.query.inStock === "true";
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const result = await allProductService(query, skip, limit);
    return res
      .status(result.code)
      .json({ message: result.message, products: result.product });
  } catch (err) {
    next(err);
  }
};

const getProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const produltId = req.params.id as string;
    const result = await getProductService(produltId);
    return res
      .status(result.code)
      .json({ message: result.message, product: result.product });
  } catch (err) {
    next(err);
  }
};

const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = req.params.id as string;
    const input = req.body;
    const imageURL = req.file
      ? `${req.protocol}://${req.get("host")}/${req.file.path.replace(
          /\\/g,
          "/",
        )}`
      : null;
    const result = await updateProductService(productId, input, imageURL);
    return res.status(result.code).json({
      message: result.code,
      products: result.product,
    });
  } catch (err) {
    next(err);
  }
};

const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const productId = req.params.id as string;
    const result = await deleteProductService(productId);
    return res
      .status(result.code)
      .json({ message: result.message, products: result.product });
  } catch (err) {
    next(err);
  }
};

const searchProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title }: ProductQuery = req.query;
    const result = await searchProductsService(title);
    return res
      .status(result.code)
      .json({ message: result.message, product: result.product });
  } catch (err) {
    next(err);
  }
};

export default {
  productCreation,
  allProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};
