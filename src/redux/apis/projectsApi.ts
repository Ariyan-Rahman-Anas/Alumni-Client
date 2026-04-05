import { baseApi } from './baseApi';

const projectsApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        createProject: builder.mutation({
            query: (projectData) => ({
                url: "/projects/create",
                method: "POST",
                body:projectData
            }),
            invalidatesTags:["projects"]
        }),
        getAllProjects: builder.query({
            query: () => "/projects/all",
            providesTags:["projects"]
        }),
        getAllCategories: builder.query({
            query: () => "/projects/categories",
            providesTags: ["projects"]
        }),
        deleteProject: builder.mutation({
            query: (id) => ({
                url: `/projects/delete/${id}`,
                method: "DELETE"
            }),
            invalidatesTags: ["projects"]
        })
    })
})


export const {
    useCreateProjectMutation,
    useGetAllProjectsQuery,
    useGetAllCategoriesQuery,
    useDeleteProjectMutation
} = projectsApi