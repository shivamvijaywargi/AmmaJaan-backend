import { NextFunction, Request, Response } from "express";
import slugify from "slugify";

import asyncHandler from "../middlewares/asyncHandler.middleware";
import Category from "../models/Category.model";
import AppErr from "../utils/AppErr";

/**
 * @CREATE_CATEGORY
 * @ROUTE @POST {{URL}}/api/v1/categories
 * @returns Category created successfully
 * @ACCESS Private (Admin + Employee only)
 */
export const createCategory = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;

    if (!name) {
      return next(new AppErr("Name is required", 400));
    }

    const categoryExists = await Category.findOne({ name: name.toLowerCase() });

    if (categoryExists) {
      return next(new AppErr("Category already exists", 400));
    }

    let customSlug = slugify(name.toLowerCase() as string);

    const slugExists = await Category.findOne({ slug: customSlug });

    if (slugExists) {
      return next(new AppErr("Category already exists", 400));
    }

    // const slugExist = await Category.findOne({ slug: customSlug }).lean();

    // if (slugExist) {
    //   customSlug = customSlug + "-" + crypto.randomUUID().substring(0, 5);
    // }

    const category = await Category.create({
      name,
      description: description ? description : undefined,
      slug: customSlug,
      createdBy: req.user?.user_id,
    });

    if (!category) {
      return next(new AppErr("Category not created, please try again", 400));
    }

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  }
);

/**
 * @GET_ALL_CATEGORIES
 * @ROUTE @GET {{URL}}/api/v1/categories
 * @returns All categories
 * @ACCESS Public
 */
export const getAllCategories = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    const categories = await Category.find();

    if (!categories.length) {
      return next(new AppErr("No category found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      categories,
    });
  }
);

/**
 * @GET_CATEGORY_BY_ID
 * @ROUTE @GET {{URL}}/api/v1/categories/:id
 * @returns Single category
 * @ACCESS Public
 */
export const getCategoryById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
      return next(new AppErr("Invalid ID or Category not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      category,
    });
  }
);

/**
 * @DELETE_CATEGORY_BY_ID
 * @ROUTE @GET {{URL}}/api/v1/categories/:id
 * @returns Single category
 * @ACCESS Private (Admin + Employee only)
 */
export const deleteCategoryById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      return next(new AppErr("Invalid ID or Category not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  }
);

/**
 * @UPDATE_CATEGORY_BY_ID
 * @ROUTE @PUT {{URL}}/api/v1/categories/:id
 * @returns Updated category
 * @ACCESS Private (Admin + Employee only)
 */
export const updateCategoryById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    let customSlug = slugify(req.body.name.toLowerCase() as string);

    const slugExists = await Category.findOne({ slug: customSlug });

    if (slugExists) {
      return next(new AppErr("Category with this name already exists", 400));
    }

    const category = await Category.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );

    if (!category) {
      return next(new AppErr("Invalid ID or Category not found", 404));
    }

    category.slug = customSlug;

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  }
);
