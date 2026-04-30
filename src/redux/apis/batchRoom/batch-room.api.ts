import { baseApi } from "../base";
import type {
    BatchRoomResponse,
    BatchMessagesResponse,
    BatchMessageResponse,
    BatchPollsResponse,
    BatchPollResponse,
    CoordinatorApplicationsResponse,
    CoordinatorApplicationResponse,
    UnseenCountResponse,
} from "./types";

export const batchRoomApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /* ── Room ─────────────────────────────────────────── */
        getBatchRoom: builder.query<BatchRoomResponse, number>({
            query: (year) => ({ url: `/batch-rooms/${year}/info`, method: "GET" }),
            providesTags: ["batchRoom"],
        }),
        renameBatchRoom: builder.mutation<BatchRoomResponse, { year: number; name: string }>({
            query: ({ year, name }) => ({ url: `/batch-rooms/${year}/rename`, method: "PATCH", body: { name } }),
            invalidatesTags: ["batchRoom"],
        }),

        /* ── Messages ─────────────────────────────────────── */
        getBatchMessages: builder.query<BatchMessagesResponse, { year: number; before?: string; limit?: number }>({
            query: ({ year, before, limit }) => ({
                url: `/batch-rooms/${year}/messages`,
                method: "GET",
                params: { before, limit },
            }),
            providesTags: ["batchMessages"],
        }),
        sendBatchMessage: builder.mutation<BatchMessageResponse, { year: number; body?: string }>({
            query: ({ year, body }) => ({ url: `/batch-rooms/${year}/messages`, method: "POST", body: { body } }),
        }),
        sendBatchMediaMessage: builder.mutation<BatchMessageResponse, { year: number; formData: FormData }>({
            query: ({ year, formData }) => ({
                url: `/batch-rooms/${year}/messages`,
                method: "POST",
                body: formData,
                formData: true,
            }),
        }),
        deleteBatchMessage: builder.mutation<{ success: boolean; message: string }, { year: number; messageId: string }>({
            query: ({ year, messageId }) => ({ url: `/batch-rooms/${year}/messages/${messageId}`, method: "DELETE" }),
            // Socket handles broadcast
        }),
        markBatchSeen: builder.mutation<{ success: boolean; message: string }, { year: number; upToMessageId: string }>({
            query: ({ year, upToMessageId }) => ({ url: `/batch-rooms/${year}/messages/seen`, method: "POST", body: { upToMessageId } }),
        }),
        getUnseenCount: builder.query<UnseenCountResponse, number>({
            query: (year) => ({ url: `/batch-rooms/${year}/messages/unseen`, method: "GET" }),
            providesTags: ["batchMessages"],
        }),

        /* ── Polls ────────────────────────────────────────── */
        getBatchPolls: builder.query<BatchPollsResponse, number>({
            query: (year) => ({ url: `/batch-rooms/${year}/polls`, method: "GET" }),
            providesTags: ["batchPolls"],
        }),
        createBatchPoll: builder.mutation<BatchPollResponse, { year: number; question: string; options: string[]; deadline?: string }>({
            query: ({ year, ...body }) => ({ url: `/batch-rooms/${year}/polls`, method: "POST", body }),
            invalidatesTags: ["batchPolls"],
        }),
        voteBatchPoll: builder.mutation<BatchPollResponse, { year: number; pollId: string; optionId: string }>({
            query: ({ year, pollId, optionId }) => ({
                url: `/batch-rooms/${year}/polls/${pollId}/vote`,
                method: "POST",
                body: { optionId },
            }),
            invalidatesTags: ["batchPolls"],
        }),
        closeBatchPoll: builder.mutation<BatchPollResponse, { year: number; pollId: string }>({
            query: ({ year, pollId }) => ({ url: `/batch-rooms/${year}/polls/${pollId}/close`, method: "PATCH" }),
            invalidatesTags: ["batchPolls"],
        }),
        deleteBatchPoll: builder.mutation<{ success: boolean; message: string }, { year: number; pollId: string }>({
            query: ({ year, pollId }) => ({ url: `/batch-rooms/${year}/polls/${pollId}`, method: "DELETE" }),
            invalidatesTags: ["batchPolls"],
        }),

        /* ── Coordinator ──────────────────────────────────── */
        applyAsCoordinator: builder.mutation<CoordinatorApplicationResponse, number>({
            query: (year) => ({ url: `/batch-rooms/${year}/coordinator/apply`, method: "POST" }),
            invalidatesTags: ["coordinatorApplications", "batchPolls", "batchRoom"],
        }),
        /** Public: get all coordinator applications for a specific batch year */
        getBatchCoordinatorApplications: builder.query<CoordinatorApplicationsResponse, number>({
            query: (year) => ({ url: `/batch-rooms/${year}/coordinator/applications`, method: "GET" }),
            providesTags: ["coordinatorApplications"],
        }),
        getCoordinatorApplications: builder.query<CoordinatorApplicationsResponse, number | undefined>({
            query: (batchYear) => ({
                url: "/batch-rooms/admin/coordinator-applications",
                method: "GET",
                params: batchYear ? { batchYear } : undefined,
            }),
            providesTags: ["coordinatorApplications"],
        }),
        reviewCoordinatorApplication: builder.mutation<
            CoordinatorApplicationResponse,
            { applicationId: string; decision: "APPROVED" | "REJECTED"; rejectionNote?: string }
        >({
            query: ({ applicationId, ...body }) => ({
                url: `/batch-rooms/admin/coordinator-applications/${applicationId}/review`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["coordinatorApplications", "batchRoom"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetBatchRoomQuery,
    useRenameBatchRoomMutation,
    useGetBatchMessagesQuery,
    useSendBatchMessageMutation,
    useSendBatchMediaMessageMutation,
    useDeleteBatchMessageMutation,
    useMarkBatchSeenMutation,
    useGetUnseenCountQuery,
    useGetBatchPollsQuery,
    useCreateBatchPollMutation,
    useVoteBatchPollMutation,
    useCloseBatchPollMutation,
    useDeleteBatchPollMutation,
    useApplyAsCoordinatorMutation,
    useGetBatchCoordinatorApplicationsQuery,
    useGetCoordinatorApplicationsQuery,
    useReviewCoordinatorApplicationMutation,
} = batchRoomApi;
