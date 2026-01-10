"use server";
import cloudinary from "@/lib/cloudinaryConfig";
import { connectToDatabase } from "@/lib/mongodb";

import { CLOUD_FOLDER_NAME, SALT_ROUNDS } from "./constant";
import bcrypt from "bcryptjs";
import { getCloudinaryPublicId } from "./nonAsyncHelpers";

export const deleteCloudinaryImage = async (publicId: string) => {
  if (!publicId) return null;

  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

export const replaceNewImagefromCurrentImage = async (
  collection: any,
  id: string
): Promise<void> => {
  try {
    await connectToDatabase();
    const existingDoc = await collection.findById(id);

    if (!existingDoc) {
      console.warn(`Document with id "${id}" not found.`);
      return;
    }

    const publicId = getCloudinaryPublicId(existingDoc.imgProof);
    if (publicId) {
      await deleteCloudinaryImage(publicId);
    } else {
      console.warn("No valid Cloudinary public ID found.");
    }
  } catch (error) {
    console.error("Error replacing image:", error);
  }
};

export const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  return await bcrypt.compare(password, hashedPassword);
};

export async function uploadImageToCloudinary(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());

  // Determine resource type based on file type
  const isPdf = file.type === "application/pdf";
  const resourceType = isPdf ? "raw" : "image";

  return new Promise<string>((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream(
        {
          folder: CLOUD_FOLDER_NAME,
          resource_type: resourceType, // Add this!
        },
        (error, result) => {
          if (error || !result?.secure_url) {
            console.error("Cloudinary upload failed:", error);
            return reject("Failed to upload image");
          }
          resolve(result.secure_url);
        }
      )
      .end(buffer);
  });
}
