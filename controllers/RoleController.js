import AsyncHandler from "express-async-handler";
import Role from "../models/Role.js";
import { createUniqueSlug } from "../utils/generateSlug.js";
import { isValidObjectId } from "../utils/isValidObjectId.js";

export const getAllRole = AsyncHandler(async (req, res) => {
  try {
    const Roles = await Role.find();
    res.status(200).json(Roles);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching Roles.",
      error: error.message,
    });
  }
});

export const getSingleRole = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the input ID to ensure it is a valid MongoDB ObjectId
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: "Invalid Role ID",
    });
  }

  try {
    const role = await Role.findById(id);

    if (!role) {
      return res.status(404).json({
        message: "Role not found",
      });
    }

    return res.status(200).json(role);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching Role.",
      error: error.message,
    });
  }
});

export const createRole = AsyncHandler(async (req, res) => {
  const { name, permissions } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({
      message: "Role name is required!",
    });
  }

  try {
    // Check if Role with the same name already exists
    const RoleCheck = await Role.findOne({ name });
    if (RoleCheck) {
      return res.status(409).json({
        message: "Role with the same name already exists!",
      });
    }

    // Create a new Role with a unique slug
    const role = await Role.create({
      name,
      slug: createUniqueSlug(name),
      permissions,
    });

    return res.status(201).json({ message: "role created successfull", role });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating the Role.",
      error: error.message,
    });
  }
});

export const updateRole = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({
      message: "Role name is required!",
    });
  }

  try {
    // Check if Role with the given ID exists
    const existingRole = await Role.findById(id);
    if (!existingRole) {
      return res.status(404).json({
        message: "Role not found!",
      });
    }

    // Check if another Role with the same name already exists
    const RoleCheck = await Role.findOne({ name });
    if (RoleCheck && RoleCheck._id.toString() !== id) {
      return res.status(409).json({
        message: "Role with the same name already exists!",
      });
    }

    // Update the Role with the new name
    existingRole.name = name;
    existingRole.slug = createUniqueSlug(name);

    // Save the updated Role
    const updatedRole = await existingRole.save();

    return res.status(200).json(updatedRole);
  } catch (error) {
    return res.status(500).json({
      message: "Error updating the Role.",
      error: error.message,
    });
  }
});

export const updateRoleStatus = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const role = await Role.findByIdAndUpdate(
      id,
      {
        status: !status,
      },
      { new: true }
    );
    return res
      .status(200)
      .json({ message: "Status updated successfull", role });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating the role.",
      error: error.message,
    });
  }
});

export const deleteRole = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Check if Role with the given ID exists
    const existingRole = await Role.findById(id);
    if (!existingRole) {
      return res.status(404).json({
        message: "Role not found!",
      });
    }

    // Delete the Role
    const role = await Role.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Role deleted successfully.",
      role,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting the Role.",
      error: error.message,
    });
  }
});
