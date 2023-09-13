import AsyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import { createUniqueSlug } from "../utils/generateSlug.js";
import { isValidObjectId } from "../utils/isValidObjectId.js";
import {
  CloudDelete,
  CloudUpload,
  CloudUploadMany,
} from "../utils/cloudinary.js";

export const getAllProduct = AsyncHandler(async (req, res) => {
  try {
    const products = await Product.find();
    if (products.length > 0) {
      res.status(200).json(products);
    } else {
      res.status(404).json({
        message: "No Products Found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products.",
      error: error.message,
    });
  }
});

export const getSingleProduct = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the input ID to ensure it is a valid MongoDB ObjectId
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: "Invalid Product ID",
    });
  }

  try {
    const product = await Product.findById(id);

    if (!Product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching Product.",
      error: error.message,
    });
  }
});

export const createProduct = AsyncHandler(async (req, res) => {
  const {
    name,
    productType,
    productSimple,
    productVariable,
    productGroup,
    productExternal,
    shortDesc,
    longDesc,
  } = req.body;
  // Validate input
  if (!name) {
    return res.status(400).json({
      message: "Product name is required 1!",
    });
  }

  try {
    // Check if Product with the same name already exists
    const ProductCheck = await Product.findOne({ name });
    if (ProductCheck) {
      return res.status(409).json({
        message: "Product with the same name already exists!",
      });
    }

    // file manage
    let productPhotos = [];
    if (req.files) {
      // req.files.forEach((item) => {
      //   const file = CloudUploadMany(item.path);
      // });
      for (let i = 0; i < req.files.length; i++) {
        const fileData = await CloudUploadMany(req.files[i].path);
        productPhotos.push(fileData);
      }
    }

    const simpleData = JSON.parse(productSimple);

    // Create a new Product with a unique slug
    const product = await Product.create({
      name,
      slug: createUniqueSlug(name),
      productType,
      productSimple:
        productType === "simple" ? { ...simpleData, productPhotos } : null,
      productGroup: productType === "group" ? productGroup : null,
      productVariable: productType === "variable" ? productVariable : null,
      productExternal: productType === "external" ? productExternal : null,
      longDesc,
      shortDesc,
    });

    return res
      .status(201)
      .json({ message: "Product created successfull", product });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating the Product.",
      error: error.message,
    });
  }
});

export const updateProduct = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({
      message: "Product name is required!",
    });
  }

  try {
    // Check if Product with the given ID exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found!",
      });
    }
    // Check if another Product with the same name already exists
    const ProductCheck = await Product.findOne({ name });
    if (ProductCheck && ProductCheck._id.toString() !== id) {
      return res.status(409).json({
        message: "Product with the same name already exists!",
      });
    }
    let logo = {};
    if (req.file) {
      await CloudDelete(existingProduct.cloud_public_id);
      logo = await CloudUpload(req);
    }
    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        slug: createUniqueSlug(name),
        logo: req.file ? logo.secure_url : existingProduct.logo,
        cloud_public_id: req.file
          ? logo.public_id
          : existingProduct.cloud_public_id,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Product updated Successfully", product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error updating the Product.",
      error: error.message,
    });
  }
});

export const updateProductStatus = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      {
        status: !status,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Status updated successfull", product });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating the Product.",
      error: error.message,
    });
  }
});

export const deleteProduct = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Check if Product with the given ID exists
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return res.status(404).json({
        message: "Product not found!",
      });
    }

    // Delete the Product
    const product = await Product.findByIdAndDelete(id);
    if (existingProduct.logo) {
      await CloudDelete(existingProduct.cloud_public_id);
    }

    return res.status(200).json({
      message: "Product deleted successfully.",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting the Product.",
      error: error.message,
    });
  }
});
