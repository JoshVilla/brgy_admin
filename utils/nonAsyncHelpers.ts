import { format } from "date-fns";
import type { Metadata } from "next";
import jwt, { JwtPayload } from "jsonwebtoken";

export const getCloudinaryPublicId = (url: string) => {
  if (!url) return null;

  try {
    const urlParts = url.split("/");
    const filenameWithExtension = urlParts.pop();
    const folder = urlParts.pop();

    if (!folder || !filenameWithExtension) return null;

    const filename = filenameWithExtension.split(".")[0];
    return `${folder}/${filename}`;
  } catch (error) {
    console.error("Error parsing Cloudinary URL:", error);
    return null;
  }
};

export const passwordValidation = (
  isValidFormat: boolean,
  isPasswordMatch: boolean
) => {
  return isValidFormat && isPasswordMatch ? true : false;
};

export const getMetadata = (title: string, description?: string): Metadata => {
  return {
    title: `${title || "Blogify"}`,
    description: description || "Be updated on what is happening",
  };
};

export const verifyToken = (authHeader: string | null): JwtPayload | null => {
  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(
      token,
      process.env.NEXT_PUBLIC_JWT_SECRET as string
    );
    return decoded as JwtPayload;
  } catch (err) {
    console.error("Token verification failed:", err);
    return null;
  }
};

export const getDecodedToken = (): JwtPayload | null => {
  if (typeof window === "undefined") return null; // SSR safety

  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const decoded = jwt.decode(token);
    return decoded as JwtPayload;
  } catch (err) {
    console.error("Error decoding token:", err);
    return null;
  }
};
export const formattedDate = (dateString?: string | Date): string => {
  if (!dateString) return "N/A";

  const date = dateString instanceof Date ? dateString : new Date(dateString);

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Manila",
  };

  return date.toLocaleDateString("en-PH", options);
};

export function formatDateTime(rawDate: string | Date): string {
  const date = new Date(rawDate);

  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return new Intl.DateTimeFormat("en-US", options)
    .format(date)
    .replace(",", ""); // remove comma between date and time
}

export const requestTypeText = (val: number) => {
  const index = val - 1;
  const arrText = [
    "Barangay Clearance", // 1
    "Certificate of Indigency", // 2
    "Barangay Cedula", // 3
    "Certificate of Residency", // 4
    "Business Clearance", // 5
    "Certificate of Good Moral", // 6
    "Certificate of No Income", // 7
    "Solo Parent Certificate", // 8
    "Senior Citizen Certificate", // 9
    "PWD Certificate", // 10
    "Barangay ID", // 11
    "Travel Certificate", // 12
    "Event Permit", // 13
  ];

  return arrText[index] || "Unknown Request";
};
