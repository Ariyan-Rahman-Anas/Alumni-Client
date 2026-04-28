import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { clearUser } from "../../slice/authSlice";
import { rawBaseQuery } from "./rawBaseQuery";

export const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError & { data?: unknown }
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
