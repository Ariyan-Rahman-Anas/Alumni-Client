import { baseApi } from "./baseApi";

const experiencesApi = baseApi.injectEndpoints({
    endpoints:builder=>({
        createExperience: builder.mutation({
            query: (experienceData) => ({
                url: "/experiences/create",
                method: "POST",
                body:experienceData
            }),
            invalidatesTags: ['experiences']
        }),
        getAllExperiences: builder.query({
            query: () => "/experiences/list",
            providesTags:["experiences"]
        }),
        getExperienceById: builder.query({
            query: (id) => `/experiences/${id}`,    
                providesTags:["experiences"]
        }),
        updateExperience: builder.mutation({
            query: ( { id, ...experienceData } ) => ({
                url:`/experiences/${id}`,
                method: "PATCH",
                body: experienceData
            }),
            invalidatesTags: ['experiences']
        }),
        deleteExperience: builder.mutation({
            query: (id) => ({
                url:`/experiences/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ['experiences']
        })
    })
})

export const {
    useCreateExperienceMutation,
    useGetAllExperiencesQuery,
    useGetExperienceByIdQuery,
    useUpdateExperienceMutation,
    useDeleteExperienceMutation
} = experiencesApi