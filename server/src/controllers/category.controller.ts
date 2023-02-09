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
