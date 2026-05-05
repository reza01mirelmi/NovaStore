import modeleCategory from "./../Models/Models_Category";
import { categoryType } from "../Types/category";
import { Types } from "mongoose";

export const categoryServices = async (input: categoryType) => {
  const category = await modeleCategory.create({
    title: input.title,
    slug: input.slug,
  });
  return { category };
};

export const getAllServices = async () => {
  const categories = await modeleCategory.find({}).select("title slug").lean();
  if (categories.length == 0) {
    return {
      ok: false,
      code: 200,
      message: "No categories found.❌",
      categories: [],
    };
  }
  return {
    ok: true,
    code: 200,
    message: "All categories fetched successfully✅",
    categories,
  };
};

export const getCategoryServices = async (categoryId: any) => {
  const id = new Types.ObjectId(categoryId);
  const category = await modeleCategory
    .findById(id)
    .select("title slug")
    .lean();

  if (!category) {
    return {
      ok: false,
      code: 404,
      message: "Category not found.❌",
    };
  }

  return {
    ok: true,
    code: 200,
    message: "Category successfully fetched✅",
    category,
  };
};

export const updateCategoryServices = async (
  input: categoryType,
  categoryId: any,
  updates: any,
) => {
  const existingCategory = await modeleCategory
    .findOne({
      title: input.title,
      slug: input.slug,
    })
    .lean();
  if (existingCategory) {
    return {
      ok: false,
      code: 409,
      message: "Category has already been updated.❌",
    };
  }
  const categories = await modeleCategory.findByIdAndUpdate(
    categoryId,
    updates,
    {
      new: true,
    },
  );

  if (!categories) {
    return {
      ok: false,
      code: 404,
      message: "Category not found.❌",
    };
  }

  return {
    ok: true,
    code: 200,
    message: "Update completed successfully✅",
    categories,
  };
};

export const deleteCategoryServices = async (id: string) => {
  const catId = new Types.ObjectId(id);

  const categories = await modeleCategory.findByIdAndDelete(id);

  if (!categories) {
    return {
      ok: false,
      code: 404,
      message: "Category not found.❌",
    };
  }

  return {
    ok: true,
    code: 200,
    message: "Delete completed successfully✅",
    categories,
  };
};

export default {
  categoryServices,
  getAllServices,
  getCategoryServices,
  updateCategoryServices,
};
