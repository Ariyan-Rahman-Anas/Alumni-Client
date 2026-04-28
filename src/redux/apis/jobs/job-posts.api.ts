import { baseApi } from "../base";
import type {
    JobsQueryParams,
    JobListResponse,
    SingleJobResponse,
    ApplicationListResponse,
    ApplicationResponse,
    CreateJobPostPayload,
    Comment,
    CommentReactionType,
    JobPostStatus,
    Meta,
    JobApplication,
} from "./types";

export const jobPostsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /* ── Public ── */
        getApprovedJobs: builder.query<JobListResponse, JobsQueryParams>({
            query: (params) => ({ url: "/jobs", method: "GET", params }),
            providesTags: ["jobs"],
        }),

        getJobById: builder.query<SingleJobResponse, string>({
            query: (id) => ({ url: `/jobs/${id}`, method: "GET" }),
            providesTags: (_r, _e, id) => [{ type: "jobs", id }],
        }),

        /* ── Authenticated ── */
        getMyJobs: builder.query<JobListResponse, JobsQueryParams>({
            query: (params) => ({ url: "/jobs/my/posts", method: "GET", params }),
            providesTags: ["jobs"],
        }),

        getMyApplications: builder.query<{ success: boolean; message: string; data: JobApplication[]; meta: Meta }, JobsQueryParams>({
            query: (params) => ({ url: "/jobs/my/applications", method: "GET", params }),
            providesTags: ["jobApplications"],
        }),

        createJobPost: builder.mutation<SingleJobResponse, CreateJobPostPayload>({
            query: (payload) => ({ url: "/jobs", method: "POST", body: payload }),
            invalidatesTags: ["jobs"],
        }),

        updateJobPost: builder.mutation<SingleJobResponse, { id: string; payload: Partial<CreateJobPostPayload> }>({
            query: ({ id, payload }) => ({ url: `/jobs/${id}`, method: "PATCH", body: payload }),
            invalidatesTags: (_r, _e, { id }) => ["jobs", { type: "jobs", id }],
        }),

        deleteJobPost: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({ url: `/jobs/${id}`, method: "DELETE" }),
            invalidatesTags: ["jobs"],
        }),

        reactToJob: builder.mutation<{ success: boolean; message: string; data: { likes: number; dislikes: number } }, { id: string; reactionType: "LIKE" | "DISLIKE" }>({
            query: ({ id, reactionType }) => ({ url: `/jobs/${id}/react`, method: "PATCH", body: { reactionType } }),
            invalidatesTags: (_r, _e, { id }) => [{ type: "jobs", id }],
        }),

        addComment: builder.mutation<{ success: boolean; message: string; data: Comment[] }, { id: string; body: string }>({
            query: ({ id, body }) => ({ url: `/jobs/${id}/comments`, method: "POST", body: { body } }),
            invalidatesTags: (_r, _e, { id }) => [{ type: "jobs", id }],
        }),

        addReply: builder.mutation<{ success: boolean; message: string; data: Comment[] }, { id: string; commentId: string; body: string }>({
            query: ({ id, commentId, body }) => ({ url: `/jobs/${id}/comments/${commentId}/replies`, method: "POST", body: { body } }),
            invalidatesTags: (_r, _e, { id }) => [{ type: "jobs", id }],
        }),

        deleteComment: builder.mutation<{ success: boolean; message: string }, { id: string; commentId: string }>({
            query: ({ id, commentId }) => ({ url: `/jobs/${id}/comments/${commentId}`, method: "DELETE" }),
            invalidatesTags: (_r, _e, { id }) => [{ type: "jobs", id }],
        }),

        deleteReply: builder.mutation<{ success: boolean; message: string }, { id: string; commentId: string; replyId: string }>({
            query: ({ id, commentId, replyId }) => ({ url: `/jobs/${id}/comments/${commentId}/replies/${replyId}`, method: "DELETE" }),
            invalidatesTags: (_r, _e, { id }) => [{ type: "jobs", id }],
        }),

        reactToComment: builder.mutation<{ success: boolean; message: string; data: Comment[] }, { id: string; commentId: string; reactionType: CommentReactionType }>({
            query: ({ id, commentId, reactionType }) => ({ url: `/jobs/${id}/comments/${commentId}/react`, method: "PATCH", body: { reactionType } }),
            invalidatesTags: (_r, _e, { id }) => [{ type: "jobs", id }],
        }),

        reactToReply: builder.mutation<{ success: boolean; message: string; data: Comment[] }, { id: string; commentId: string; replyId: string; reactionType: CommentReactionType }>({
            query: ({ id, commentId, replyId, reactionType }) => ({ url: `/jobs/${id}/comments/${commentId}/replies/${replyId}/react`, method: "PATCH", body: { reactionType } }),
            invalidatesTags: (_r, _e, { id }) => [{ type: "jobs", id }],
        }),

        applyToJob: builder.mutation<ApplicationResponse, { id: string; message?: string }>({
            query: ({ id, message }) => ({ url: `/jobs/${id}/apply`, method: "POST", body: { message } }),
            invalidatesTags: ["jobApplications"],
        }),

        getJobApplications: builder.query<ApplicationListResponse, string>({
            query: (id) => ({ url: `/jobs/${id}/applications`, method: "GET" }),
            providesTags: (_r, _e, id) => [{ type: "jobApplications", id }],
        }),

        selectApplicant: builder.mutation<{ success: boolean; message: string }, { jobId: string; appId: string }>({
            query: ({ jobId, appId }) => ({ url: `/jobs/${jobId}/applications/${appId}/select`, method: "PATCH" }),
            invalidatesTags: ["jobApplications", "jobs"],
        }),

        /* ── Admin ── */
        adminGetAllJobs: builder.query<JobListResponse, JobsQueryParams>({
            query: (params) => ({ url: "/jobs/admin/all-jobs", method: "GET", params }),
            providesTags: ["jobs"],
        }),

        adminUpdateJobStatus: builder.mutation<SingleJobResponse, { id: string; status: JobPostStatus; adminNote: string; rejectedReason?: string }>({
            query: ({ id, ...body }) => ({ url: `/jobs/admin/${id}/status`, method: "PATCH", body }),
            invalidatesTags: ["jobs"],
        }),

        adminGetAllApplications: builder.query<{ success: boolean; message: string; data: JobApplication[]; meta: Meta }, JobsQueryParams>({
            query: (params) => ({ url: "/jobs/admin/all-applications", method: "GET", params }),
            providesTags: ["jobApplications"],
        }),
    }),
});

export const {
    useGetApprovedJobsQuery,
    useGetJobByIdQuery,
    useGetMyJobsQuery,
    useGetMyApplicationsQuery,
    useCreateJobPostMutation,
    useUpdateJobPostMutation,
    useDeleteJobPostMutation,
    useReactToJobMutation,
    useAddCommentMutation,
    useAddReplyMutation,
    useDeleteCommentMutation,
    useDeleteReplyMutation,
    useReactToCommentMutation,
    useReactToReplyMutation,
    useApplyToJobMutation,
    useGetJobApplicationsQuery,
    useSelectApplicantMutation,
    useAdminGetAllJobsQuery,
    useAdminUpdateJobStatusMutation,
    useAdminGetAllApplicationsQuery,
} = jobPostsApi;
