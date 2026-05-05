import { Request, Response, NextFunction } from "express";
import validCategory from "./../../Validators/Valid_Category";
import { categoryType } from "./../../Types/category";
import {
  categoryServices,
  deleteCategoryServices,
  getAllServices,
  getCategoryServices,
  updateCategoryServices,
} from "../../services/category.services";

const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input: categoryType = req.body;
    const validBody = validCategory(input);

    if (validBody !== true) {
      return res.status(400).json({ message: "Invalid category data.❌" });
    }
    const result = await categoryServices(input);

    const { category } = result;
    return res
      .status(201)
      .json({ message: "Category created successfully✅", category });
  } catch (err: any) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Category already exists. ❌" });
    }
    next(err);
  }
};

const getAllCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getAllServices();

    return res
      .status(result.code)
      .json({ message: result.message, post: result.categories || undefined });
  } catch (err) {
    next(err);
  }
};

const getCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getCategoryServices(req.params.id);
    const { category } = result;
    return res
      .status(result.code)
      .json({ message: result.message, post: result.category || undefined });
  } catch (err) {
    next(err);
  }
};

const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const input: categoryType = req.body;
    const categoryId = req.params.id;
    const validBody = validCategory(input);

    if (validBody !== true) {
      return res.status(400).json(validBody);
    }
    let updates: any = {};
    if (req.body.title) updates.title = req.body.title;
    if (req.body.slug) updates.slug = req.body.slug;

    const result = await updateCategoryServices(input, categoryId, updates);

    const { categories } = result;
    return res
      .status(result.code)
      .json({ message: result.message, post: result.categories || undefined });
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const categoryIdParam = req.params.id;
    let categoryParamStr: string;

    if (Array.isArray(categoryIdParam)) {
      categoryParamStr = categoryIdParam[0];
    } else {
      categoryParamStr = categoryIdParam;
    }
    const id: string = categoryParamStr;
    const result = await deleteCategoryServices(id);

    const { categories } = result;
    return res
      .status(result.code)
      .json({ message: result.message, category: categories || undefined });
  } catch (err) {
    next(err);
  }
};

export default {
  createCategory,
  getAllCategory,
  getCategory,
  updateCategory,
  deleteCategory,
};
