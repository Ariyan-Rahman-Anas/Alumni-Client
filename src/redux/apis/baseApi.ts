import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react"
import { clearUser } from "../authSlice";
import { API_CONFIG } from "@/lib/config";

const rawBaseQuery = fetchBaseQuery({
    baseUrl: API_CONFIG.base_url,
    credentials: "include",
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        // Try to refresh
        const refreshResult = await rawBaseQuery(
            { url: "/auth/refresh-token", method: "POST" },
            api,
            extraOptions
        );

        if (refreshResult.error) {
            // Refresh failed — clear user and let caller handle redirect
            api.dispatch(clearUser());
        } else {
            // Retry original request with fresh cookie
            result = await rawBaseQuery(args, api, extraOptions);
        }
    }

    return result;
};

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: ["projects", "certificates", "experiences", "specalities", "skills", "educations", "batches"],
    endpoints: () => ({})
})