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
        rejected: number;
        verified: number;
    };
    batches: {
        total: number;
        active: number;
    };
    jobs: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        closed: number;
    };
    testimonials: { pending: number };
    requests: { pending: number };
    events: {
        total: number;
        upcoming: Array<{
            _id: string;
            title: string;
            startDateTime: string;
            endDateTime?: string;
            venue: string;
            locationType: string;
            coverImage?: string;
        }>;
    };
    announcements: { total: number };
    gallery: { total: number };
    bloodDonors: { total: number };
    countries: Array<{ country: string; count: number }>;
    batchesSection: Array<{
        year: number;
        approved: number;
        scienceCount: number;
        commerceCount: number;
        artsCount: number;
    }>;
    monthlyRegistrations: Array<{ month: string; count: number }>;
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
