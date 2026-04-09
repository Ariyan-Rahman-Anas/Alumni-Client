import { baseApi } from "./baseApi";

interface Batch {
    _id: string;
    year: number;
    isActive: boolean;
    stats: {
        totalRegistrations: number;
        approved: number;
        emailVerified: number;
        lastRegistration: string | null;
        last30Days: number;
    };
}

interface BatchListResponse {
    success: boolean;
    message: string;
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data: Batch[];
}

interface BatchResponse {
    success: boolean;
    message: string;
    data: Batch;
}

export type { Batch };

export const batchApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getActiveBatches: builder.query<BatchListResponse, void>({
            query: () => ({
                url: "/batches/active",
                method: "GET",
                params: { limit: 200, sort: "-year" },
            }),
            providesTags: ["batches"],
        }),

        getAllBatches: builder.query<BatchListResponse, { page?: number; limit?: number }>({
            query: ({ page = 1, limit = 10 } = {}) => ({
                url: "/batches/list",
                method: "GET",
                params: { page, limit, sort: "-year" },
            }),
            providesTags: ["batches"],
        }),

        createBatch: builder.mutation<BatchResponse, { year: number; isActive?: boolean }>({
            query: (body) => ({ url: "/batches/create", method: "POST", body }),
            invalidatesTags: ["batches"],
        }),

        updateBatch: builder.mutation<BatchResponse, { id: string; year?: number; isActive?: boolean }>({
            query: ({ id, ...body }) => ({ url: `/batches/${id}`, method: "PATCH", body }),
            invalidatesTags: ["batches"],
        }),

        deleteBatch: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({ url: `/batches/${id}`, method: "DELETE" }),
            invalidatesTags: ["batches"],
        }),

        toggleBatchActive: builder.mutation<BatchResponse, string>({
            query: (id) => ({ url: `/batches/${id}/toggle`, method: "PATCH" }),
            invalidatesTags: ["batches"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetActiveBatchesQuery,
    useGetAllBatchesQuery,
    useCreateBatchMutation,
    useUpdateBatchMutation,
    useDeleteBatchMutation,
    useToggleBatchActiveMutation,
} = batchApi;
