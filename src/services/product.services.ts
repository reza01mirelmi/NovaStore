import productModel, { productDocument } from "./../Models/Models_Products";
import categoryModel from "./../Models/Models_Category";
import { v4 as uuidv4 } from "uuid";
import { Types } from "mongoose";
import { ProductQuery, productType } from "./../Types/product";
const productCreationService = async (
  title: string,
  description: string,
  price: number,
  weight: number,
  category: Types.ObjectId,
  imageURL: string | null,
) => {
  const sku = `GOLD-${uuidv4()}`;

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

  return {
    ok: true,
    code: 201,
    message: "Create Products successfully✅",
    toObjectProduct,
  };
};

const allProductService = async (
  query: ProductQuery,
  skip: number,
  limit: number,
) => {
  const product = await productModel
    .find(query, "-__v -updatedAt")
    .skip(skip)
    .limit(limit)
    .populate("category", "title slug")
    .lean();

  if (product.length == 0) {
    return {
      ok: true,
      code: 200,
      message: "No products found.❌",
      products: [],
    };
  }

  return {
    ok: true,
    code: 200,
    message: "All Product Succssfully✅",
    product,
  };
};

const getCategoryIdByName = async (categoryName: string) => {
  const category = await categoryModel.findOne({
    $or: [
      {
        title: categoryName,
        description: categoryModel,
      },
    ],
  });
  return category ? category._id : null;
};

const getProductService = async (productId: string) => {
  const product = await productModel
    .findOne({ _id: productId }, "-__v -updatedAt")
    .populate("Comments category", "title slug")
    .lean();

  if (!product) {
    return { ok: false, code: 404, message: "Product not found.❌" };
  }

  return {
    ok: true,
    code: 200,
    message: "Received successfully✅",
    product,
  };
};

const updateProductService = async (
  productId: string,
  input: Partial<productType>,
  imageURL: string | null,
) => {
  const product: any = await productModel.findById(productId, "-__v");

  if (!product) {
    return { ok: false, code: 404, message: "Product not found.❌" };
  }

  let isChanged = false;
  const allowedParametr = [
    "title",
    "description",
    "price",
    "weight",
    "category",
    "image",
    "inStock",
  ];
  type UpdatableProductFields = Pick<
    productDocument,
    | "title"
    | "description"
    | "price"
    | "weight"
    | "category"
    | "image"
    | "inStock"
  >;

  for (let key of allowedParametr) {
    const field = key as keyof UpdatableProductFields;
    if (key === "image" && imageURL) {
      product.image = imageURL;
      isChanged = true;
    } else if (input[field] !== undefined && input[field] != product[field]) {
      product[field] = input[field];
      isChanged = true;
    }
  }

  if (!isChanged) {
    return { ok: false, code: 400, message: "No changes detected ❌" };
  }

  await product.save();
  if (!isChanged) {
    throw new Error("No changes detected ❌");
  }

  return {
    ok: true,
    code: 200,
    message: "The desired fields were successfully updated✅",
    product,
  };
};

const deleteProductService = async (productId: string) => {
  const product = await productModel.findOneAndDelete({ _id: productId });

  if (!product) {
    return { ok: false, code: 404, message: "Product not found.❌" };
  }

  return {
    ok: true,
    code: 200,
    message: "Removed successfully✅",
    product,
  };
};

const searchProductsService = async (title: string | undefined) => {
  const product = await productModel
    .find({
      title: { $regex: title || "", $options: "i" },
    })
    .select("-__v -updatedAt -createdAt");

  if (!product.length) {
    return { ok: false, code: 404, message: "Product not found.❌" };
  }

  return {
    ok: true,
    code: 200,
    message: "Search is successful✅",
    product,
  };
};

export {
  productCreationService,
  allProductService,
  getCategoryIdByName,
  getProductService,
  updateProductService,
  deleteProductService,
  searchProductsService,
};
