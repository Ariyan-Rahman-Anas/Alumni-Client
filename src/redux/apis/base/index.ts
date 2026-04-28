import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        "projects",
        "certificates",
        "experiences",
        "specalities",
        "skills",
        "educations",
        "batches",
        "users",
        "events",
        "imageCategories",
        "galleryImages",
        "announcements",
        "jobs",
        "jobApplications",
        "providers",
        "providerContacts",
    ],
    endpoints: () => ({}),
});
