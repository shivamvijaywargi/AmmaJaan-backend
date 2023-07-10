import crypto from 'crypto';
import os from 'os';

import { NextFunction, Request, Response } from 'express';
import formidable from 'formidable';
// import { nanoid } from 'nanoid';
import slugify from 'slugify';
import cloudinary from 'cloudinary';

import asyncHandler from '@/middlewares/asyncHandler.middleware';
import Product from '@/models/Product.model';
import AppErr from '@/utils/AppErr';
import Logger from '@/utils/logger';
import { IProductQuery, IQueryObj, IUploadedImageData } from '@/types';
import mongoose from 'mongoose';

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
          originalPrice,
          discountedPrice,
          quantity,
          label,
          inStock,
          category,
        } = fields;

        if (!title || !description || !originalPrice || !category) {
          return next(
            new AppErr(
              'Title, Description, Price, and Category are required',
              400,
            ),
          );
        }

        let customSlug = slugify(title as string);

        const slugExist = await Product.findOne({ slug: customSlug }).lean();

        if (slugExist) {
          customSlug = customSlug + '-' + crypto.randomUUID().substring(0, 5);
        }

        const product = await Product.create({
          title,
          originalPrice,
          description,
          createdBy: req.user?.user_id,
          slug: customSlug,
          category,
        });

        if (!product) {
          return next(
            new AppErr('Product was not created, please try again', 400),
          );
        }

        if (shortDescription && !Array.isArray(shortDescription)) {
          product.shortDescription = shortDescription;
        }
        if (label === 'Hot' || label === 'New' || label === 'Best Selling') {
          product.label = label;
        }
        if (quantity && Number(quantity) <= 99999) {
          product.quantity = +quantity;
        } else {
          return next(new AppErr('Quantity cannot be greater than 99999', 400));
        }
        if (inStock) product.inStock = Boolean(inStock);
        if (discountedPrice) product.discountedPrice = +discountedPrice;

        if (Object.keys(files).length) {
          try {
            const incomingFile = files.productImage;
            if (!Array.isArray(incomingFile)) {
              const result = await cloudinary.v2.uploader.upload(
                incomingFile.filepath,
                {
                  folder: 'eCommerce/products',
                },
              );

              if (result) {
                const uploadedImage: IUploadedImageData = {
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
                  },
                );

                if (result) {
                  const uploadedImage: IUploadedImageData = {
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
  },
);

/**
 * @GET_ALL_PRODUCTS
 * @ROUTE @GET {{URL}}/api/v1/products
 * @returns All products
 * @ACCESS Public
 */
export const getAllProducts = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { search, sort }: IProductQuery = req.query;

    const queryObject: IQueryObj = {};

    // Add stuff based on condition
    if (search) {
      queryObject.title = { $regex: search, $options: 'i' };
      queryObject.description = { $regex: search, $options: 'i' };
    }

    // No await here
    const results = Product.find(
      Object.keys(queryObject).length
        ? {
            $or: [
              {
                title: queryObject.title,
              },
              {
                description: queryObject.description,
              },
            ],
          }
        : {},
    ).populate('category createdBy');

    // Sorting code
    if (sort === 'latest') {
      results.sort({ createdAt: -1 });
    }

    if (sort === 'oldest') {
      results.sort({ createdAt: 1 });
    }

    if (sort === 'price-asc') {
      results.sort({ originalPrice: 1 });
    }

    if (sort === 'price-desc') {
      results.sort({ originalPrice: -1 });
    }

    if (sort === 'popular') {
      results.sort({ views: -1 });
    }

    if (sort === 'a-z') {
      results.sort({ title: 1 });
    }

    if (sort === 'z-a') {
      results.sort({ title: -1 });
    }

    // Pagination setup
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const skip = (page - 1) * limit;

    results.skip(skip).limit(limit);

    // Await here
    const products = await results;

    const count = await Product.countDocuments();

    if (!products.length) {
      return next(new AppErr('No products found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Products fetched successfully',
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: Number(page),
      count,
    });
  },
);

/**
 * @GET_PRODUCT_BY_ID
 * @ROUTE @GET {{URL}}/api/v1/products/:id
 * @returns Single products
 * @ACCESS Public
 */
export const getProductById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const product = mongoose.Types.ObjectId.isValid(req.params.id)
      ? await Product.findOne({ _id: req.params.id }).populate(
          'category createdBy',
        )
      : await Product.findOne({
          slug: req.params.id,
        }).populate('category createdBy');

    if (!product) {
      return next(new AppErr('Invalid ID or product does not exist', 404));
    }

    // Update number of view on the product
    product.views += 1;

    await product.save();

    res.status(200).json({
      success: true,
      message: 'Product fetched successfully',
      product,
    });
  },
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
      try {
        if (err) {
          return next(new AppErr(err || 'Something went wrong', 500));
        }

        const { id } = req.params;

        const product = await Product.findByIdAndUpdate(
          id,
          {
            $set: fields,
          },
          { new: true },
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

          product.slug = newSlug;

          await product.save();
        }

        if (Object.keys(files).length) {
          try {
            const incomingFile = files.productImage;
            if (!Array.isArray(incomingFile)) {
              const result = await cloudinary.v2.uploader.upload(
                incomingFile.filepath,
                {
                  folder: 'eCommerce/products',
                },
              );

              if (result) {
                const uploadedImage: IUploadedImageData = {
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
                  },
                );

                if (result) {
                  const uploadedImage: IUploadedImageData = {
                    public_id: result.public_id,
                    secure_url: result.secure_url,
                  };

                  product.images.push({
                    image: uploadedImage,
                  });
                }
              }
            }

            await product.save();
          } catch (error) {
            return next(new AppErr('Image could not be uploaded', 400));
          }
        }

        return res.status(200).json({
          success: true,
          message: 'Product updated successfully',
          product,
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        return next(
          new AppErr(error || 'Something went wrong, please try again', 400),
        );
      }
    });
  },
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

    product.images.map(async (image: { image: { public_id: string } }) => {
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
  },
);
