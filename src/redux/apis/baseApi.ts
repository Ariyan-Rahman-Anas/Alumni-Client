import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import { API_CONFIG } from "@/lib/config";
import { clearUser } from "../slice/authSlice";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: API_CONFIG.base_url,
    credentials: "include",
});


const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError & { data?: any }
> = async (args, api, extraOptions) => {
  let result = await rawBaseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshResult = await rawBaseQuery(
      { url: "/auth/refresh-token", method: "POST" },
      api,
      extraOptions
    );

    if (refreshResult.error) {
      api.dispatch(clearUser());
    } else {
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  // ✅ normalize error message
  if (result.error) {
    const errData = result.error.data as {
      message?: string;
      errors?: { message?: string }[];
    };

    let message = "Something went wrong";

    if (errData?.errors?.length) {
      message = errData.errors[0].message || message;
    } else if (errData?.message) {
      message = errData.message;
    }

    result.error.data = {
      ...errData,
      message,
    };
  }

  return result;
};

// const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
//     args,
//     api,
//     extraOptions
// ) => {
//     let result = await rawBaseQuery(args, api, extraOptions);

//     if (result.error?.status === 401) {
//         // Try to refresh
//         const refreshResult = await rawBaseQuery(
//             { url: "/auth/refresh-token", method: "POST" },
//             api,
//             extraOptions
//         );

//         if (refreshResult.error) {
//             // Refresh failed — clear user and let caller handle redirect
//             api.dispatch(clearUser());
//         } else {
//             // Retry original request with fresh cookie
//             result = await rawBaseQuery(args, api, extraOptions);
//         }
//     }

//     return result;
// };

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["projects", "certificates", "experiences", "specalities", "skills", "educations", "batches", "users", "events", "imageCategories", "galleryImages"],
    endpoints: () => ({})
})