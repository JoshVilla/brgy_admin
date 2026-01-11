import { IApiResponse, IServiceParams } from "@/utils/types";
import { jwtDecode } from "jwt-decode"; // Install: npm install jwt-decode

export const post = async <T>(
  url: string,
  params: IServiceParams | FormData = {},
  isFileUpload: boolean = false
): Promise<IApiResponse<T>> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Decode token to get username
  let userName = "Unknown User";
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      userName =
        decoded.username || decoded.name || decoded.sub || "Unknown User";
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }

  const headers: HeadersInit = {
    ...(isFileUpload ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "x-user-name": userName, // Add username from token
  };

  const body: string | FormData = isFileUpload
    ? (params as FormData)
    : JSON.stringify(params as IServiceParams);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body,
    });

    const data: IApiResponse<T> = await response.json();

    return data;
  } catch (error) {
    console.error("POST request failed:", error);
    throw error;
  }
};
