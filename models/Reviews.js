import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    // customer: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Customer",
    // },
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

export default mongoose.model("Reviews", reviewsSchema);
