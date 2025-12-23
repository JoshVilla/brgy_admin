import { IApiResponse, IServiceParams } from "@/utils/types";

export const post = async <T>(
  url: string,
  params: IServiceParams | FormData = {},
  isFileUpload: boolean = false
): Promise<IApiResponse<T>> => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    ...(isFileUpload ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
