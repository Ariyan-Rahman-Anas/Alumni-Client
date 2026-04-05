import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_CONFIG } from "@/lib/config";

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: fetchBaseQuery({
        baseUrl: API_CONFIG.base_url 
    }),
    tagTypes: ["projects", "certificates", "experiences", "specalities", "skills", "educations"],
    endpoints: () => ({})
})