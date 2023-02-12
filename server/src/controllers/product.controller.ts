import crypto from 'crypto';
import os from 'os';

import { NextFunction, Request, Response } from 'express';
import formidable from 'formidable';
// import { nanoid } from 'nanoid';
import slugify from 'slugify';
import cloudinary from 'cloudinary';

import asyncHandler from '../middlewares/asyncHandler.middleware';
import Product from '../models/Product.model';
import AppErr from '../utils/AppErr';
import Logger from '../utils/logger';

interface IUploadedImageData {
  public_id: string;
  secure_url: string;
}

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
          category,
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
          try {
            const incomingFile = files.productImage;
            if (!Array.isArray(incomingFile)) {
              const result = await cloudinary.v2.uploader.upload(
                incomingFile.filepath,
                {
                  folder: 'eCommerce/products',
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
                    folder: 'eCommerce',
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
            return next(new AppErr('Image could not be uploaded', 400));
          }
        }

        await product.save();

        res.status(201).json({
          success: true,
          message: 'Product created successfully',
          product,
        });
      } catch (error) {
        Logger.error(error);
        return next(new AppErr('Something went wrong, please try again', 400));
      }
    });
  }
);

/**
 * @GET_ALL_PRODUCTS
 * @ROUTE @GET {{URL}}/api/v1/products
 * @returns All products
 * @ACCESS Public
 */
export const getAllProducts = asyncHandler(
  async (_req: Request, res: Response, next: NextFunction) => {
    const products = await Product.find({}).populate('category createdBy');

    if (!products.length) {
      return next(new AppErr('No products found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      products,
    });
  }
);

/**
 * @UPDATE_PRODUCT_BY_ID
 * @ROUTE @PUT {{URL}}/api/v1/products/:id
 * @returns Product updated successfully
 * @ACCESS Private(Admin + Employee only)
 */
export const updateProductById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
      uploadDir: os.tmpdir(),
      maxFileSize: 50 * 1024 * 1024, // 5MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return next(new AppErr(err || 'Something went wrong', 500));
      }

      try {
        const { id } = req.params;

        const product = await Product.findByIdAndUpdate(
          id,
          {
            $set: fields,
          },
          { new: true }
        );

        if (!product) {
          return next(new AppErr('Invalid ID or product not found', 404));
        }

        if (fields.title) {
          let newSlug = slugify(product.title);

          const slugExist = await Product.findOne({ slug: newSlug }).lean();

          if (slugExist) {
            newSlug = newSlug + '-' + crypto.randomUUID().substring(0, 5);
          }

          product.title = newSlug;

          await product.save();
        }

        if (files) {
          try {
            const incomingFile = files.productImage;
            if (!Array.isArray(incomingFile)) {
              const result = await cloudinary.v2.uploader.upload(
                incomingFile.filepath,
                {
                  folder: 'eCommerce/products',
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
                    folder: 'eCommerce',
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
            return next(new AppErr('Image could not be uploaded', 400));
          }
        }

        res.status(200).json({
          success: true,
          message: 'Product updated successfully',
          product,
        });
      } catch (error: any) {
        return next(
          new AppErr(error || 'Something went wrong, please try again', 400)
        );
      }
    });
  }
);

/**
 * @DELETE_PRODUCT_BY_ID
 * @ROUTE @DELETE {{URL}}/api/v1/products/:id
 * @returns Product deleted successfully
 * @ACCESS Private(Admin + Employee only)
 */
export const deleteProductById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
      return next(new AppErr('Invalid ID or product not found', 404));
    }

    product.images.map(async (image: any) => {
      try {
        await cloudinary.v2.uploader.destroy(image.image.public_id);
      } catch (error) {
        next(new AppErr('Could not delete images from cloudinary', 400));
      }
    });

    await product.remove();

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  }
);
