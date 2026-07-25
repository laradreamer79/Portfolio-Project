import multer from "multer";
import cloudinary, { hasCloudinaryConfig } from "../config/cloudinary.js";
import { HttpError } from "../utils/http-error.js";

const storage = multer.memoryStorage();
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (_request, file, callback) => {
    if (!allowedImageTypes.includes(file.mimetype)) {
      return callback(new Error("Only JPEG, PNG, and WEBP images are allowed"));
    }

    callback(null, true);
  },
});

export async function uploadToCloudinary(
  file: Express.Multer.File,
  folder = "oyster/catalog",
): Promise<string> {
  if (!hasCloudinaryConfig()) {
    throw new HttpError(
      500,
      "Cloudinary upload is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.",
    );
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
        } else {
          resolve(result.secure_url);
        }
      }
    ).end(file.buffer);
  });
}
