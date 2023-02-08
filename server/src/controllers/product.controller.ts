import crypto from 'crypto';
import fs from 'fs/promises';

import { NextFunction, Request, Response } from 'express';
import formidable from 'formidable';
// import { nanoid } from 'nanoid';
import slugify from 'slugify';
import cloudinary from 'cloudinary';

import asyncHandler from '../middlewares/asyncHandler.middleware';
import Product from '../models/Product.model';
import AppErr from '../utils/AppErr';

/**
 * @CREATE_PRODUCT
 * @ROUTE @POST {{URL}}/api/v1/products
 * @returns Product created successfully
 * @ACCESS Private (Admin + Employee only)
 */
export const createProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return next(new AppErr(err || 'Something went wrong', 500));
      }

      const {
        title,
        description,
        shortDescription,
        price,
        quantity,
        label,
        inStock,
        category,
      } = fields;

      if (!title || !description || !price || !category) {
        return next(
          new AppErr(
            'Title, Description, Price, and Category are required',
            400
          )
        );
      }

      let customSlug = slugify(title as string);

      const slugExist = await Product.findOne({ slug: customSlug }).lean();

      if (slugExist) {
        customSlug = customSlug + '-' + crypto.randomUUID().substring(0, 5);
      }

      const product = await Product.create({
        title,
        price,
        description,
        createdBy: req.user?.user_id,
        slug: customSlug,
      });

      if (!product) {
        return next(
          new AppErr('Product was not created, please try again', 400)
        );
      }

      if (shortDescription) product.shortDescription = shortDescription;
      if (quantity && Number(quantity) <= 99999) {
        product.quantity = quantity;
      } else {
        return next(new AppErr('Quantity cannot be greater than 99999', 400));
      }
      if (label) product.label = label;
      if (inStock) product.inStock = inStock;

      if (files) {
        // TODO
        // const incomingFile = files.productImage;
        // const data = fs.readFile(incomingFile.filepath);
        // console.log(data);
        // const result = await cloudinary.v2.uploader.upload(file.filepath, {
        //   folder: 'eCommerce',
        // });
      }

      await product.save();

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product,
      });
    });
  }
);
