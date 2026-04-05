import { baseApi } from "./baseApi";

const educationsApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        createEducation: builder.mutation({
            query: educationData => ({
                url: "/educations/create",
                method: "POST",
                body:educationData
            }),
            invalidatesTags:["educations"]
        }),
        getAllEducations: builder.query({
            query: () => "/educations/list",
            providesTags:["educations"]
        }),
        deleteEducation: builder.mutation({
            query: (id: string) => ({
                url: `/educations/delete/${id}`,
                method: "DELETE"
            }),
            invalidatesTags:["educations"]
        })
    })
})

export const {
    useCreateEducationMutation,
    useGetAllEducationsQuery,
    useDeleteEducationMutation
} = educationsApi