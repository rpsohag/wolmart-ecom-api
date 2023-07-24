import mongoose from "mongoose";

const useSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
    },
    mobile: {
      type: String,
      trim: true,
      default: null,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    resetToken: {
      type: String,
      trim: true,
    },
    resetTokenExpiration: {
      type: Date,
    },
    role: {
      type: String,
      default: "Author",
    },
    gender: {
      type: String,
      enum: ["Female", "Male", "undefined"],
      default: "undefined",
    },
    address: {
      type: String,
      default: null,
    },
    bio: {
      type: String,
      default: null,
    },
    photo: {
      type: String,
      default: null,
    },
    status: {
      type: Boolean,
      default: true,
    },
    trash: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", useSchema);
