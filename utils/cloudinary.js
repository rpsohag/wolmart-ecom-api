import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dgftd2zkl",
  api_key: "999152573841672",
  api_secret: "DHmeTZpLWGLph6AF248IHnad5Gs",
});

export const CloudUpload = async (req) => {
  // upload brand logo
  const data = await cloudinary.uploader.upload(req.file.path);
  return data;
};

export const CloudDelete = async (existingBrand) => {
  // upload brand logo
  const data = await cloudinary.uploader.destroy(existingBrand);
  return data;
};
