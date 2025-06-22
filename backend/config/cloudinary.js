import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API - KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (filePath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath);

    fs.unlink(filePath);

    return uploadResult.secure_url;
  } catch (error) {
    fs.unlink(filePath);
    console.log(error);
    return res.status(500).json({ message: "Cloudinary error" });
  }
};
export default uploadOnCloudinary;
