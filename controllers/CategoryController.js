import AsyncHandler from "express-async-handler";
import Category from "../models/Category.js";
import { createUniqueSlug } from "../utils/generateSlug.js";
import { isValidObjectId } from "../utils/isValidObjectId.js";

export const getAllCategory = AsyncHandler(async (req, res) => {
  try {
    const categorys = await Category.find().populate([
      {
        path: "subCategory",
        populate: {
          path: "subCategory",
          populate: {
            path: "subCategory",
          },
        },
      },
      {
        path: "parentCategory",
        populate: {
          path: "parentCategory",
          populate: {
            path: "parentCategory",
          },
        },
      },
    ]);

    if (categorys.length > 0) {
      res.status(200).json(categorys);
    } else {
      res.status(404).json({
        message: "No Categorys Found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error fetching categorys.",
      error: error.message,
    });
  }
});

export const getSingleCategory = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the input ID to ensure it is a valid MongoDB ObjectId
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: "Invalid Category ID",
    });
  }

  try {
    const category = await Category.findById(id).populate([
      {
        path: "subCategory",
        populate: {
          path: "subCategory",
          populate: {
            path: "subCategory",
          },
        },
      },
      {
        path: "parentCategory",
        populate: {
          path: "parentCategory",
          populate: {
            path: "parentCategory",
          },
        },
      },
    ]);

    if (!Category) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching Category.",
      error: error.message,
    });
  }
});

export const createCategory = AsyncHandler(async (req, res) => {
  const { name, parentCategory } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({
      message: "Category name is required!",
    });
  }

  try {
    // Check if Category with the same name already exists
    const CategoryCheck = await Category.findOne({ name });
    if (CategoryCheck) {
      return res.status(409).json({
        message: "Category with the same name already exists!",
      });
    }

    // Create a new Category with a unique slug
    const category = await Category.create({
      name,
      slug: createUniqueSlug(name),
      parentCategory: parentCategory ? parentCategory : null,
    });

    if (parentCategory) {
      const parent = await Category.findByIdAndUpdate(parentCategory, {
        $push: { subCategory: category._id },
      });
    }

    return res
      .status(201)
      .json({ message: "Category created successfull", category });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating the Category.",
      error: error.message,
    });
  }
});

export const updateCategory = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({
      message: "Category name is required!",
    });
  }

  try {
    // Check if Category with the given ID exists
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found!",
      });
    }

    // Check if another Category with the same name already exists
    const CategoryCheck = await Category.findOne({ name });
    if (CategoryCheck && CategoryCheck._id.toString() !== id) {
      return res.status(409).json({
        message: "Category with the same name already exists!",
      });
    }

    const category = await Category.findByIdAndUpdate(
      id,
      {
        name,
        slug: createUniqueSlug(name),
        permissions: permissions,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Category updated Successfully", category });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating the Category.",
      error: error.message,
    });
  }
});

export const updateCategoryStatus = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        status: !status,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Status updated successfull", category });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating the Category.",
      error: error.message,
    });
  }
});

export const deleteCategory = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Check if Category with the given ID exists
    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found!",
      });
    }

    // Delete the Category
    const category = await Category.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Category deleted successfully.",
      category,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting the Category.",
      error: error.message,
    });
  }
});
