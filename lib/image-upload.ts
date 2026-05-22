import "server-only";

import { createHash } from "node:crypto";

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxImageSize = 5 * 1024 * 1024;

export function getImageUploadError(file: File) {
  if (!file || file.size === 0) return null;
  if (!allowedImageTypes.includes(file.type)) return "Images must be JPG, PNG or WEBP.";
  if (file.size > maxImageSize) return "Images must be 5MB or smaller.";
  return null;
}

export function isUploadConfigured() {
  return Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);
}

export async function uploadImage(file: File, folder = "staynest") {
  if (!file || file.size === 0) return null;

  const validationError = getImageUploadError(file);
  if (validationError) {
    throw new Error(validationError);
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return fileToDataUrl(file);
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const uploadFolder = process.env.CLOUDINARY_UPLOAD_FOLDER || folder;
  const signature = signCloudinaryParams({ folder: uploadFolder, timestamp }, apiSecret);
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("folder", uploadFolder);
  formData.append("signature", signature);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error("Image upload failed. Please try again.");
  }

  const result = (await response.json()) as { secure_url?: string };
  if (!result.secure_url) {
    throw new Error("Image upload did not return a URL.");
  }

  return result.secure_url;
}

async function fileToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString("base64")}`;
}

function signCloudinaryParams(params: Record<string, string>, apiSecret: string) {
  const serialized = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${serialized}${apiSecret}`).digest("hex");
}
