import type {
    TestimonialListResponse,
    TestimonialResponse,
    SubmitTestimonialPayload,
    TTestimonialStatus,
} from "@/types/common/testimonial.types";
import { baseApi } from "./baseApi";

export const testimonialApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /* ── Public ───────────────────────────────────────────── */
        getApprovedTestimonials: builder.query<TestimonialListResponse, void>({
            query: () => ({ url: "/testimonials" }),
            providesTags: ["testimonials"],
        }),

        /* ── Authenticated user ───────────────────────────────── */
        submitTestimonial: builder.mutation<TestimonialResponse, SubmitTestimonialPayload>({
            query: (body) => ({ url: "/testimonials/submit", method: "POST", body }),
            invalidatesTags: ["testimonials"],
        }),

        getMyTestimonial: builder.query<TestimonialResponse, void>({
            query: () => ({ url: "/testimonials/my" }),
            providesTags: ["testimonials"],
        }),

        /* ── Admin ────────────────────────────────────────────── */
        getAdminTestimonials: builder.query<
            TestimonialListResponse,
            { status?: TTestimonialStatus } | void
        >({
            query: (arg) => ({
                url: "/testimonials/admin",
                params: arg?.status ? { status: arg.status } : {},
            }),
            providesTags: ["testimonials"],
        }),

        approveTestimonial: builder.mutation<TestimonialResponse, { id: string; order?: number }>({
            query: ({ id, order }) => ({
                url: `/testimonials/${id}/approve`,
                method: "PATCH",
                body: { order },
            }),
            invalidatesTags: ["testimonials"],
        }),

        rejectTestimonial: builder.mutation<
            TestimonialResponse,
            { id: string; rejectionReason?: string }
        >({
            query: ({ id, rejectionReason }) => ({
                url: `/testimonials/${id}/reject`,
                method: "PATCH",
                body: { rejectionReason },
            }),
            invalidatesTags: ["testimonials"],
        }),

        deleteTestimonial: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({ url: `/testimonials/${id}`, method: "DELETE" }),
            invalidatesTags: ["testimonials"],
        }),
    }),
});

export const {
    useGetApprovedTestimonialsQuery,
    useSubmitTestimonialMutation,
    useGetMyTestimonialQuery,
    useGetAdminTestimonialsQuery,
    useApproveTestimonialMutation,
    useRejectTestimonialMutation,
    useDeleteTestimonialMutation,
} = testimonialApi;
