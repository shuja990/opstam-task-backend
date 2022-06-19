import asyncHandler from "express-async-handler";
import Joi from "joi";
import Category from "../models/categoryModel.js";

// @desc    Add a category
// @route   POST /api/categories/
// @access  Public
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
  });
  const value = await schema.validateAsync({
    name: name,
  });

  const category = new Category({
    name,
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
});

// @desc    Fetch all Categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    await category.remove();
    res.json({ message: "Category removed" });
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategories = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const schema = Joi.object({
    name: Joi.string().min(3).max(30),
  });
  const value = await schema.validateAsync({
    name: name,
  });
  const category = await Category.findById(req.params.id);

  if (category) {
    category.name = name || category.name;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

export { createCategory, getCategories, deleteCategory, updateCategories };
