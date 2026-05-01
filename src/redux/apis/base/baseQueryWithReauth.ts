import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { clearUser, setUser } from "../../slice/authSlice";
import { rawBaseQuery } from "./rawBaseQuery";
import { IAuthUser } from "@/app/(auth)/auth.types";

// Module-level flag: prevents concurrent 401 handlers from each triggering a refresh.
let isRefreshing = false;
let pendingResolvers: Array<(token: string | null) => void> = [];

const waitForRefresh = (): Promise<string | null> =>
    new Promise((resolve) => { pendingResolvers.push(resolve); });

const resolveWaiters = (token: string | null) => {
    pendingResolvers.forEach((resolve) => resolve(token));
    pendingResolvers = [];
};

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError & { data?: unknown }
> = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions);

    if (result.error?.status === 401) {
        const requestUrl =
            typeof args === "string" ? args : (args as { url: string }).url;
        const isRefreshEndpoint = requestUrl?.includes("/auth/refresh-token");

        if (!isRefreshEndpoint) {
            if (isRefreshing) {
                // Another request is already refreshing — wait for it
                const newToken = await waitForRefresh();
                if (newToken) {
                    result = await rawBaseQuery(args, api, extraOptions);
                } else {
                    api.dispatch(clearUser());
                }
            } else {
                isRefreshing = true;
                const refreshResult = await rawBaseQuery(
                    { url: "/auth/refresh-token", method: "POST" },
                    api,
                    extraOptions
                );

                if (refreshResult.error) {
                    api.dispatch(clearUser());
                    resolveWaiters(null);
                } else {
                    const refreshData = refreshResult.data as { data?: { accessToken: string; user: IAuthUser } };
                    if (refreshData?.data?.accessToken && refreshData?.data?.user) {
                        api.dispatch(setUser({ user: refreshData.data.user, accessToken: refreshData.data.accessToken }));
                        resolveWaiters(refreshData.data.accessToken);
                        result = await rawBaseQuery(args, api, extraOptions);
                    } else {
                        api.dispatch(clearUser());
                        resolveWaiters(null);
                    }
                }
                isRefreshing = false;
            }
        } else {
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
