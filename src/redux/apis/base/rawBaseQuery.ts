import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_CONFIG } from "@/lib/config";

export const rawBaseQuery = fetchBaseQuery({
    baseUrl: API_CONFIG.base_url,
    credentials: "include",
});
