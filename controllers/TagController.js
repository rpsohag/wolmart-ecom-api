import AsyncHandler from "express-async-handler";
import Tag from "../models/Tag.js";
import { createUniqueSlug } from "../utils/generateSlug.js";
import { isValidObjectId } from "../utils/isValidObjectId.js";

export const getAllTag = AsyncHandler(async (req, res) => {
  try {
    const tags = await Tag.find();
    if (tags.length > 0) {
      res.status(200).json(tags);
    } else {
      res.status(404).json({
        message: "No Tags Found",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error fetching tags.",
      error: error.message,
    });
  }
});

export const getSingleTag = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the input ID to ensure it is a valid MongoDB ObjectId
  if (!isValidObjectId(id)) {
    return res.status(400).json({
      message: "Invalid Tag ID",
    });
  }

  try {
    const tag = await Tag.findById(id);

    if (!Tag) {
      return res.status(404).json({
        message: "Tag not found",
      });
    }

    return res.status(200).json(tag);
  } catch (error) {
    return res.status(500).json({
      message: "Error fetching Tag.",
      error: error.message,
    });
  }
});

export const createTag = AsyncHandler(async (req, res) => {
  const { name } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({
      message: "Tag name is required!",
    });
  }

  try {
    // Check if Tag with the same name already exists
    const TagCheck = await Tag.findOne({ name });
    if (TagCheck) {
      return res.status(409).json({
        message: "Tag with the same name already exists!",
      });
    }

    // Create a new Tag with a unique slug
    const tag = await Tag.create({
      name,
      slug: createUniqueSlug(name),
    });

    return res.status(201).json({ message: "Tag created successfull", tag });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating the Tag.",
      error: error.message,
    });
  }
});

export const updateTag = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, permissions } = req.body;

  // Validate input
  if (!name) {
    return res.status(400).json({
      message: "Tag name is required!",
    });
  }

  try {
    // Check if Tag with the given ID exists
    const existingTag = await Tag.findById(id);
    if (!existingTag) {
      return res.status(404).json({
        message: "Tag not found!",
      });
    }

    // Check if another Tag with the same name already exists
    const TagCheck = await Tag.findOne({ name });
    if (TagCheck && TagCheck._id.toString() !== id) {
      return res.status(409).json({
        message: "Tag with the same name already exists!",
      });
    }

    const tag = await Tag.findByIdAndUpdate(
      id,
      {
        name,
        slug: createUniqueSlug(name),
        permissions: permissions,
      },
      { new: true }
    );

    return res.status(200).json({ message: "Tag updated Successfully", tag });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating the Tag.",
      error: error.message,
    });
  }
});

export const updateTagStatus = AsyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const tag = await Tag.findByIdAndUpdate(
      id,
      {
        status: !status,
      },
      { new: true }
    );
    return res.status(200).json({ message: "Status updated successfull", tag });
  } catch (error) {
    return res.status(500).json({
      message: "Error updating the Tag.",
      error: error.message,
    });
  }
});

export const deleteTag = AsyncHandler(async (req, res) => {
  const { id } = req.params;

  try {
    // Check if Tag with the given ID exists
    const existingTag = await Tag.findById(id);
    if (!existingTag) {
      return res.status(404).json({
        message: "Tag not found!",
      });
    }

    // Delete the Tag
    const tag = await Tag.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Tag deleted successfully.",
      tag,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error deleting the Tag.",
      error: error.message,
    });
  }
});
