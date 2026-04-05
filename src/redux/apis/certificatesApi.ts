import { baseApi } from "./baseApi";

const certificatesApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        createCertificate: builder.mutation({
            query: certificateData => ({
                url: "/certificates/create",
                method: "POST",
                body:certificateData
            }),
            invalidatesTags:["certificates"]
        }),
        getAllCertificates: builder.query({
            query: () => "/certificates/all",
            providesTags:["certificates"]
        })
    })
})

export const {
    useCreateCertificateMutation,
    useGetAllCertificatesQuery
} = certificatesApi