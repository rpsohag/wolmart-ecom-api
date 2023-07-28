import AsyncHandler from "express-async-handler";
import Permission from "../models/Permission.js";
import { createUniqueSlug } from "../utils/generateSlug.js";
import { isValidObjectId } from "../utils/isValidObjectId.js";

export const getAllPermission = AsyncHandler(async (req, res) => {
  try {
    const permissions = await Permission.find();

    res.status(200).json(permissions);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching permissions.",
      error: error.message,
    });
  }
});

export const getSinglePermission = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the input ID to ensure it is a valid MongoDB ObjectId
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: "Invalid permission ID",
    });
  }

  try {
    const permission = await Permission.findById(id);

    if (!permission) {
      return res.status(404).json({
        message: "Permission not found",
      });
    }

    return res.status(200).json(permission);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching permission.",
      error: error.message,
    });
  }
});

export const createPermission = AsyncHandler(async (req, res) => {
  const { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({
      message: "Permission name is required!",
    });
  }

  try {
    // Check if permission with the same name already exists
    const permissionCheck = await Permission.findOne({ name });
    if (permissionCheck) {
      return res.status(409).json({
        message: "Permission with the same name already exists!",
      });
    }

    // Create a new permission with a unique slug
    const permission = await Permission.create({
      name,
      slug: createUniqueSlug(name),
    });

    return res
      .status(201)
      .json({ message: "Permission created successfully", permission });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating the permission.",
      error: error.message,
    });
  }
});

export const updatePermission = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({
      message: "Permission name is required!",
    });
  }

  try {
    // Check if permission with the given ID exists
    const existingPermission = await Permission.findById(id);
    if (!existingPermission) {
      return res.status(404).json({
        message: "Permission not found!",
      });
    }

    // Check if another permission with the same name already exists
    const permissionCheck = await Permission.findOne({ name });
    if (permissionCheck && permissionCheck._id.toString() !== id) {
      return res.status(409).json({
        message: "Permission with the same name already exists!",
      });
    }

    // Update the permission with the new name
    existingPermission.name = name;
    existingPermission.slug = createUniqueSlug(name);

    // Save the updated permission
    const updatedPermission = await existingPermission.save();

    return res.status(200).json(updatedPermission);
  } catch (error) {
    return res.status(500).json({
      message: "Error updating the permission.",
      error: error.message,
    });
  }
});
export const updatePermissionStatus = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const permission = await Permission.findByIdAndUpdate(
      id,
      {
        status: !status,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ permission, message: "Status updated successfull" });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating the permission.",
      error: error.message,
    });
  }
});

export const deletePermission = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Check if permission with the given ID exists
    const existingPermission = await Permission.findById(id);
    if (!existingPermission) {
      return res.status(404).json({
        message: "Permission not found!",
      });
    }

    // Delete the permission
    const permission = await Permission.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Permission deleted successfully.",
      permission,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting the permission.",
      error: error.message,
    });
  }
});
