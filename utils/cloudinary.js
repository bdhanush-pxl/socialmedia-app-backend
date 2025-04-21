import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            console.error("Local file path is undefined or null");
            return null;
        }
        console.log("Uploading file to Cloudinary:", localFilePath);

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("File uploaded successfully:", response.url);
        fs.unlinkSync(localFilePath); // Remove the local file
        return response;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        fs.unlinkSync(localFilePath); // Remove the local file if upload fails
        return null;
    }
};

export {uploadOnCloudinary}