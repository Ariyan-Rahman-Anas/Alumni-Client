import { baseApi } from "./baseApi";

export interface AppStats {
    users: {
        total: number;
        pending: number;
        approved: number;
        verified: number;
    };
    batches: {
        total: number;
        active: number;
    };
    recentUsers: Array<{
        _id: string;
        name: string;
        email: string;
        imageUrl?: string;
        approvalStatus: string;
        createdAt: string;
    }>;
}

interface StatsResponse {
    success: boolean;
    message: string;
    data: AppStats;
}

export const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getStats: builder.query<StatsResponse, void>({
            query: () => ({ url: "/admin/stats", method: "GET" }),
            providesTags: ["users", "batches"],
        }),
    }),
    overrideExisting: false,
});

export const { useGetStatsQuery } = adminApi;
