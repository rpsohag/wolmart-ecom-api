import AsyncHandler from "express-async-handler";
import Brand from "../models/Brand.js";
import { createUniqueSlug } from "../utils/generateSlug.js";
import { isValidObjectId } from "../utils/isValidObjectId.js";
import { CloudDelete, CloudUpload } from "../utils/cloudinary.js";

export const getAllBrand = AsyncHandler(async (req, res) => {
  try {
    const brands = await Brand.find();
    if (brands.length > 0) {
      res.status(200).json({ brands });
    } else {
      res.status(404).json({
        message: "No Brands Found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error fetching brands.",
      error: error.message,
    });
  }
});

export const getSingleBrand = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the input ID to ensure it is a valid MongoDB ObjectId
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: "Invalid Brand ID",
    });
  }

  try {
    const brand = await Brand.findById(id);

    if (!Brand) {
      return res.status(404).json({
        message: "Brand not found",
      });
    }

    return res.status(200).json(brand);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching Brand.",
      error: error.message,
    });
  }
});

export const createBrand = AsyncHandler(async (req, res) => {
  const { name } = req.body;
  // Validate input
  if (!name) {
    return res.status(400).json({
      message: "Brand name is required!",
    });
  }

  try {
    // Check if Brand with the same name already exists
    const BrandCheck = await Brand.findOne({ name });
    if (BrandCheck) {
      return res.status(409).json({
        message: "Brand with the same name already exists!",
      });
    }

    let logoData = null;
    if (req.file) {
      logoData = await CloudUpload(req);
    }

    // Create a new Brand with a unique slug
    const brand = await Brand.create({
      name,
      slug: createUniqueSlug(name),
      logo: logoData.secure_url,
      cloud_public_id: logoData.public_id,
    });

    return res
      .status(201)
      .json({ message: "Brand created successfull", brand });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating the Brand.",
      error: error.message,
    });
  }
});

export const updateBrand = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({
      message: "Brand name is required!",
    });
  }

  try {
    // Check if Brand with the given ID exists
    const existingBrand = await Brand.findById(id);
    if (!existingBrand) {
      return res.status(404).json({
        message: "Brand not found!",
      });
    }
    // Check if another Brand with the same name already exists
    const BrandCheck = await Brand.findOne({ name });
    if (BrandCheck && BrandCheck._id.toString() !== id) {
      return res.status(409).json({
        message: "Brand with the same name already exists!",
      });
    }
    let logo = {};
    if (req.file) {
      await CloudDelete(existingBrand.cloud_public_id);
      logo = await CloudUpload(req);
    }
    const brand = await Brand.findByIdAndUpdate(
      id,
      {
        name,
        slug: createUniqueSlug(name),
        logo: req.file ? logo.secure_url : existingBrand.logo,
        cloud_public_id: req.file
          ? logo.public_id
          : existingBrand.cloud_public_id,
      },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Brand updated Successfully", brand });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error updating the Brand.",
      error: error.message,
    });
  }
});

export const updateBrandStatus = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const brand = await Brand.findByIdAndUpdate(
      id,
      {
        status: !status,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Status updated successfull", brand });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating the Brand.",
      error: error.message,
    });
  }
});

export const deleteBrand = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Check if Brand with the given ID exists
    const existingBrand = await Brand.findById(id);
    if (!existingBrand) {
      return res.status(404).json({
        message: "Brand not found!",
      });
    }

    // Delete the Brand
    const brand = await Brand.findByIdAndDelete(id);
    if (existingBrand.logo) {
      await CloudDelete(existingBrand.cloud_public_id);
    }

    return res.status(200).json({
      message: "Brand deleted successfully.",
      brand,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting the Brand.",
      error: error.message,
    });
  }
});
