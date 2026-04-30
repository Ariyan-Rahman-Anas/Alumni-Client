import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONFIG } from "@/lib/config";
import type { RootState } from "@/redux/store";

export const rawBaseQuery = fetchBaseQuery({
    baseUrl: API_CONFIG.base_url,
    // credentials: "include" is still needed for the httpOnly refresh-token cookie
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.accessToken;
        if (token) {
            headers.set("Authorization", `Bearer ${token}`);
        }
        return headers;
    },
});
