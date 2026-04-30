import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { clearUser, setUser } from "../../slice/authSlice";
import type { AuthUser } from "../../slice/authSlice";
import { rawBaseQuery } from "./rawBaseQuery";

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError & { data?: unknown }
> = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        // Never retry the refresh-token endpoint itself — it would loop.
        const requestUrl =
            typeof args === "string" ? args : (args as { url: string }).url;
        const isRefreshEndpoint = requestUrl?.includes("/auth/refresh-token");

        if (!isRefreshEndpoint) {
            // Try to get a fresh access token using the httpOnly refresh-token cookie
            const refreshResult = await rawBaseQuery(
                { url: "/auth/refresh-token", method: "POST" },
                api,
                extraOptions
            );

            if (refreshResult.error) {
                api.dispatch(clearUser());
            } else {
                const refreshData = refreshResult.data as { data?: { accessToken: string; user: AuthUser } };
                if (refreshData?.data?.accessToken && refreshData?.data?.user) {
                    api.dispatch(setUser({ user: refreshData.data.user, accessToken: refreshData.data.accessToken }));
                }
                // Retry the original request — now the Bearer header will carry the new token
                result = await rawBaseQuery(args, api, extraOptions);
            }
        } else {
            // Refresh token endpoint itself got 401 → user is not logged in
            api.dispatch(clearUser());
        }
    }

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

        result.error.data = { ...errData, message };
    }

    return result;
};
