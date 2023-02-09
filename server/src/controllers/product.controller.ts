import crypto from "crypto";
import os from "os";

import { NextFunction, Request, Response } from "express";
import formidable from "formidable";
// import { nanoid } from 'nanoid';
import slugify from "slugify";
import cloudinary from "cloudinary";

import asyncHandler from "../middlewares/asyncHandler.middleware";
import Product from "../models/Product.model";
import AppErr from "../utils/AppErr";
import { isArray } from "util";

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
      uploadDir: os.tmpdir(),
      maxFileSize: 50 * 1024 * 1024, // 5MB
    });

    form.parse(req, async (err, fields, files) => {
      try {
        if (err) {
          return next(new AppErr(err || "Something went wrong", 500));
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
              "Title, Description, Price, and Category are required",
              400
            )
          );
        }

        let customSlug = slugify(title as string);

        const slugExist = await Product.findOne({ slug: customSlug }).lean();

        if (slugExist) {
          customSlug = customSlug + "-" + crypto.randomUUID().substring(0, 5);
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
            new AppErr("Product was not created, please try again", 400)
          );
        }

        if (shortDescription) product.shortDescription = shortDescription;
        if (quantity && Number(quantity) <= 99999) {
          product.quantity = quantity;
        } else {
          return next(new AppErr("Quantity cannot be greater than 99999", 400));
        }
        if (label) product.label = label;
        if (inStock) product.inStock = inStock;

        if (files) {
          try {
            interface IUploadedImageData {
              public_id: string;
              secure_url: string;
            }

            const incomingFile = files.productImage;
            if (!isArray(incomingFile)) {
              const result = await cloudinary.v2.uploader.upload(
                incomingFile.filepath,
                {
                  folder: "eCommerce",
                }
              );

              if (result) {
                let uploadedImage: IUploadedImageData = {
                  public_id: result.public_id,
                  secure_url: result.secure_url,
                };

                product.images.push({
                  image: uploadedImage,
                });
              }
            } else {
              for (let i = 0; i < incomingFile.length; i++) {
                const result = await cloudinary.v2.uploader.upload(
                  incomingFile[i].filepath,
                  {
                    folder: "eCommerce",
                  }
                );

                if (result) {
                  let uploadedImage: IUploadedImageData = {
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                  };

                  product.images.push({
                    image: uploadedImage,
                  });
                }
              }
            }
          } catch (error) {
            console.log(error);
            return next(new AppErr("Image could not be uploaded", 400));
          }
        }

        await product.save();

        res.status(201).json({
          success: true,
          message: "Product created successfully",
          product,
        });
      } catch (error) {
        console.log(error);
        return next(new AppErr("Something went wrong, please try again", 400));
      }
    });
  }
);
