import { baseApi } from "./baseApi";

const specalitisApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getSpecalities: builder.query({
            query: () => "/specalities/list",
            providesTags:["specalities"]
        }),
        editSpecalities:builder.mutation({
            query: ({id, editData}: {id: string, editData: any}) => ({
                url: `/specalities/edit/${id}`,
                method: "PATCH",
                body: editData,
            }),
            invalidatesTags:["specalities"]
        })
    })
})

export const {
    useGetSpecalitiesQuery,
    useEditSpecalitiesMutation
} = specalitisApi