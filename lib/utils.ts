import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { jwtDecode } from "jwt-decode";
import { IAdmin } from "@/models/adminModel";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isTokenValid = (token: string): IAdmin | null => {
  try {
    const decoded: IAdmin & { exp: number } = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);

    if (decoded.exp < currentTime) {
      return null;
    }

    return decoded;
  } catch (error) {
    return null;
  }
};
