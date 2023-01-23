import { Schema, model } from "mongoose";
import slugify from "slugify";
import AppErr from "../utils/AppErr";

const productSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [5, "Title must be atleast 5 characters long"],
      maxlength: [55, "Title cannot be more than 55 characters"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minlength: [50, "Description must be atleast 50 characters long"],
    },
    shortDescription: {
      type: String,
      minlength: [20, "Short description must be atleast 20 characters long"],
      maxlength: [100, "Short description cannot be more than 100 characters"],
    },
    images: [
      {
        image: {
          public_id: {
            type: String,
            required: true,
          },
          secure_url: {
            type: String,
            required: true,
          },
        },
      },
    ],
    price: {
      type: Number,
      required: [true, "Price is required"],
      maxlength: [5, "Price cannot exceed 5 digits"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      maxlength: [5, "Quantity cannot exceed 5 digits"],
    },
    inStock: {
      type: Boolean,
      required: [true, "In stock status is required"],
      default: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
    },
    label: {
      type: String,
      enum: ["Hot", "New", "Best Selling"],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Need to check if this way is good or not
 * Another way is to add nanoid to the back
 * Another way is to check if slug exist while creating a new product and if yes then append nanoid to new slug
 * If following above point then this method should be removed
 * Last but not least there's a package mongoose-slug-generator, this is a plugin for mongoose
 * Using above plugin then both slugify and nanoid can be removed
 */
productSchema.pre("save", async function (next) {
  if (!this.isModified("title")) return next();

  this.slug = slugify(this.title);

  let self = this;

  model("MyModel", productSchema).find(
    { slug: self.slug },
    (err: any, docs: any[]) => {
      if (!docs.length) return next();

      if (docs.length === 1 && docs[0]._id.equals(self._id)) {
        return next();
      }

      let newSlug = self.slug + "-";

      model("MyModel", productSchema).find(
        { slug: new RegExp("^" + newSlug, "i") },
        (err: any, docs: any[]) => {
          if (err) return next(new AppErr(err, 400));

          newSlug += docs.length + 1;

          next();
        }
      );
    }
  );
});

const Product = model("Product", productSchema);

export default Product;
