import axios, { AxiosError, type Method } from "axios";

export async function apiRequest<T = any>(
  method: Method,
  url: string,
  body: any = {}
): Promise<T> {
  try {
    const { data } = await axios({
      method,
      url,
      data: body,
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    // success: return EXACT backend response
    return data as T;
  } catch (err) {
    const error = err as AxiosError<any>;

    if (error?.status === 401) {
      if (window.location.pathname.startsWith("/officer")) {
        window.location.href = "/officer/login";
      } else {
        window.location.href = "/";
      }
    }
    // throw the backend error as-is, or fallback
    throw (
      error.response?.data || {
        message: "Something went wrong",
        success: false,
        statusCode: 500,
      }
    );
  }
}
