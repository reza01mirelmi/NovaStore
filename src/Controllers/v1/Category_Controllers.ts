const modeleCategory = require("./../../Models/Models_Category");
const validCategory = require("./../../Validators/Valid_Category");

exports.createCategory = async (req, res, next) => {
  try {
    const validBody = validCategory(req.body);

    if (validBody !== true) {
      return res.status(400).json({ message: "Invalid category data.❌" });
    }

    const { title, slug } = req.body;

    const category = await modeleCategory.create({
      title,
      slug,
    });

    return res
      .status(201)
      .json({ message: "Category created successfully✅", category });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Category already exists. ❌" });
    }
    next(err);
  }
};

exports.getAllCategory = async (req, res, next) => {
  try {
    const categories = await modeleCategory
      .find({})
      .select("title slug")
      .lean();

    if (categories.length == 0) {
      return res
        .status(200)
        .json({ message: "No categories found.❌", categories: [] });
    }

    return res
      .status(200)
      .json({ message: "All categories fetched successfully✅", categories });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const category = await modeleCategory
      .findById(req.params.id)
      .select("title slug")
      .lean();

    if (!category) {
      return res.status(404).json({ message: "Category not found.❌" });
    }

    return res
      .status(200)
      .json({ message: "Category successfully fetched✅", category });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const validBody = validCategory(req.body);

    if (validBody !== true) {
      return res.status(400).json({ message: "Invalid category data.❌" });
    }
    let updates = {};
    if (req.body.title) updates.title = req.body.title;
    if (req.body.slug) updates.slug = req.body.slug;

    const existingCategory = await modeleCategory
      .findOne({
        title: updates.title,
        slug: updates.slug,
      })
      .lean();

    if (existingCategory) {
      return res
        .status(409)
        .json({ message: "Category has already been updated.❌" });
    }
    const categories = await modeleCategory.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    );

    if (!categories) {
      return res.status(404).json({ message: "Category not found.❌" });
    }

    return res
      .status(200)
      .json({ message: "Update completed successfully✅", categories });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const categories = await modeleCategory.findByIdAndDelete(req.params.id);

    if (!categories) {
      return res.status(404).json({ message: "Category not found.❌" });
    }

    return res
      .status(200)
      .json({ message: "Delete completed successfully✅", categories });
  } catch (err) {
    next(err);
  }
};
