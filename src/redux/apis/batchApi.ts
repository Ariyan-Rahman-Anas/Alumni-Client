import { baseApi } from "./baseApi";

interface Batch {
    _id: string;
    year: number;
    isActive: boolean;
}

interface BatchListResponse {
    success: boolean;
    message: string;
    // data: {
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPage: number;
        };
        data: Batch[];
    // };
}

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
    }),
    overrideExisting: false,
});

export const { useGetActiveBatchesQuery } = batchApi;
