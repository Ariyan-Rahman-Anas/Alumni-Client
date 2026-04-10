import { baseApi } from "./baseApi";

/* ── Public: GET /stats/public/home ─────────────────────── */
export interface HomeStats {
    totalUsers: number;
    yearsOfExcellence: number;
    totalBatches: number;
    totalCountries: number;
    countriesRepresented: Array<{ country: string; count: number }>;
    batchesSection: Array<{
        year: number;
        approved: number;
        scienceCount: number;
        commerceCount: number;
        artsCount: number;
    }>;
}

interface HomeStatsResponse {
    success: boolean;
    message: string;
    data: HomeStats;
}

/* ── Private: GET /stats/private/ ───────────────────────── */
export interface AdminStats {
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
    countries: Array<{ country: string; count: number }>;
    batchesSection: Array<{
        year: number;
        approved: number;
        scienceCount: number;
        commerceCount: number;
        artsCount: number;
    }>;
}

interface AdminStatsResponse {
    success: boolean;
    message: string;
    data: AdminStats;
}

export const statsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getHomeStats: builder.query<HomeStatsResponse, void>({
            query: () => ({ url: "/stats/public/home", method: "GET" }),
        }),
        getAdminStats: builder.query<AdminStatsResponse, void>({
            query: () => ({ url: "/stats/private/", method: "GET" }),
            providesTags: ["users", "batches"],
        }),
    }),
    overrideExisting: false,
});

export const { useGetHomeStatsQuery, useGetAdminStatsQuery } = statsApi;
