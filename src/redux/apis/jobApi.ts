import { baseApi } from "./baseApi";
import type { UserProfile } from "./userApi";

/* ── Enums / shared types ──────────────────────────────── */
export type JobPostStatus = "pending" | "approved" | "rejected" | "closed";
export type JobPostType = "official" | "tuition_seek" | "personal_seek";
export type JobType = "full-time" | "part-time" | "remote" | "contract" | "internship";
export type ExperienceLevel = "entry" | "mid" | "senior" | "executive";
export type Gender = "male" | "female" | "any";
export type PaymentPer = "hour" | "month" | "session";
export type ServiceCategory =
  | "electrician" | "plumber" | "cook" | "driver" | "cleaner"
  | "carpenter" | "painter" | "gardener" | "security" | "other";
export type ApplicationStatus = "pending" | "selected" | "rejected";
export type ProviderType =
  | "tutor" | "electrician" | "plumber" | "cook" | "driver" | "cleaner"
  | "carpenter" | "painter" | "gardener" | "security" | "other";
export type ProviderStatus = "pending" | "approved" | "rejected";export type CommentReactionType = "like" | "dislike" | "haha" | "angry" | "sad" | "love";

/* ── Admin note ──────────────────────────────────────────────────────── */
export interface AdminNote {
  note: string;
  addedAt: string;
}

/* ── Comment reaction ────────────────────────────────────────────── */
export interface CommentReactionEntry {
  userId: string;
  type: CommentReactionType;
}
/* ── Comment sub-types ─────────────────────────────────── */
export interface CommentReply {
  _id: string;
  author: UserProfile;
  body: string;
  reactions: CommentReactionEntry[];
  createdAt: string;
}

export interface Comment {
  _id: string;
  author: UserProfile;
  body: string;
  replies: CommentReply[];
  reactions: CommentReactionEntry[];
  createdAt: string;
}

/* ── Job Post ──────────────────────────────────────────── */
export interface JobPost {
  _id: string;
  type: JobPostType;
  status: JobPostStatus;
  title: string;
  description: string;
  postedBy: UserProfile;
  // official
  company?: string;
  jobTitle?: string;
  jobType?: JobType;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  salaryNegotiable?: boolean;
  requirements?: string[];
  experienceLevel?: ExperienceLevel;
  applicationDeadline?: string;
  applicationInstruction?: string;
  location?: string;
  isRemote?: boolean;
  // tuition_seek
  studentClass?: string;
  studentGender?: Gender;
  requiredTutorGender?: Gender;
  subjects?: string[];
  timing?: string;
  sessionDuration?: string;
  weeklyDays?: string[];
  // shared seek
  seekLocation?: string;
  paymentAmount?: number;
  paymentPer?: PaymentPer;
  paymentNegotiable?: boolean;
  startDate?: string;
  // personal_seek
  serviceCategory?: ServiceCategory;
  // reactions
  likes: string[];
  dislikes: string[];
  comments: Comment[];
  // admin
  adminNotes: AdminNote[];
  rejectedReason?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

/* ── Provider ──────────────────────────────────────────── */
export interface ProviderCertificate {
  url: string;
  publicId: string;
  name: string;
}

export interface ServiceProvider {
  _id: string;
  user: UserProfile;
  providerType: ProviderType;
  bio: string;
  experience: string;
  qualifications?: string[];
  subjects?: string[];
  classRange?: string[];
  gender: "male" | "female";
  availableGenderStudents?: Gender;
  hourlyRate?: number;
  monthlyRate?: number;
  availability?: string[];
  location: string;
  isAvailable: boolean;
  status: ProviderStatus;
  adminNotes: AdminNote[];
  certificates: ProviderCertificate[];
  createdAt: string;
}

/* ── Application ───────────────────────────────────────── */
export interface JobApplication {
  _id: string;
  job: JobPost;
  applicant: UserProfile;
  status: ApplicationStatus;
  message?: string;
  createdAt: string;
}

/* ── Contact request ───────────────────────────────────── */
export interface ProviderContact {
  _id: string;
  provider: string;
  seeker: UserProfile;
  message?: string;
  isRead: boolean;
  createdAt: string;
}

/* ── Response wrappers ─────────────────────────────────── */
export interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

interface SingleJobResponse { success: boolean; message: string; data: JobPost }
interface JobListResponse { success: boolean; message: string; data: JobPost[]; meta: Meta }
interface ProviderResponse { success: boolean; message: string; data: ServiceProvider }
interface ProviderListResponse { success: boolean; message: string; data: ServiceProvider[]; meta: Meta }
interface ApplicationListResponse { success: boolean; message: string; data: JobApplication[] }
interface ApplicationResponse { success: boolean; message: string; data: JobApplication }
interface ContactListResponse { success: boolean; message: string; data: ProviderContact[] }

/* ── Query params ──────────────────────────────────────── */
export interface JobsQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  type?: JobPostType;
  status?: JobPostStatus;
  providerType?: ProviderType;
}

/* ── Create payloads ───────────────────────────────────── */
export type CreateJobPostPayload = {
  type: JobPostType;
  title: string;
  description: string;
  [key: string]: unknown;
};

export type CreateProviderPayload = {
  providerType: ProviderType;
  bio: string;
  experience: string;
  gender: "male" | "female";
  location: string;
  [key: string]: unknown;
};

/* ══════════════════════════════════════════════════════════
   RTK Query API
══════════════════════════════════════════════════════════ */

export const jobApi = baseApi.injectEndpoints({
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

    getApprovedProviders: builder.query<ProviderListResponse, JobsQueryParams>({
      query: (params) => ({ url: "/jobs/providers", method: "GET", params }),
      providesTags: ["providers"],
    }),

    getProviderById: builder.query<ProviderResponse, string>({
      query: (id) => ({ url: `/jobs/providers/${id}`, method: "GET" }),
      providesTags: (_r, _e, id) => [{ type: "providers", id }],
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

    getMyProviderProfile: builder.query<ProviderResponse, void>({
      query: () => ({ url: "/jobs/my/provider-profile", method: "GET" }),
      providesTags: ["providers"],
    }),

    getMyProviderContacts: builder.query<ContactListResponse, void>({
      query: () => ({ url: "/jobs/my/provider-contacts", method: "GET" }),
      providesTags: ["providerContacts"],
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

    reactToJob: builder.mutation<{ success: boolean; message: string; data: { likes: number; dislikes: number } }, { id: string; reactionType: "like" | "dislike" }>({
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

    registerProvider: builder.mutation<ProviderResponse, { payload: CreateProviderPayload; certificates?: File[] }>({
      query: ({ payload, certificates }) => {
        if (certificates?.length) {
          const formData = new FormData();
          Object.entries(payload).forEach(([key, val]) => {
            if (val == null) return;
            if (Array.isArray(val)) formData.append(key, JSON.stringify(val));
            else formData.append(key, String(val));
          });
          certificates.forEach((f) => formData.append("certificates", f));
          return { url: "/jobs/providers/register", method: "POST", body: formData };
        }
        return { url: "/jobs/providers/register", method: "POST", body: payload };
      },
      invalidatesTags: ["providers"],
    }),

    updateProviderProfile: builder.mutation<ProviderResponse, { id: string; payload: Partial<CreateProviderPayload> }>({
      query: ({ id, payload }) => ({ url: `/jobs/providers/${id}`, method: "PATCH", body: payload }),
      invalidatesTags: ["providers"],
    }),

    contactProvider: builder.mutation<{ success: boolean; message: string }, { id: string; message?: string }>({
      query: ({ id, message }) => ({ url: `/jobs/providers/${id}/contact`, method: "POST", body: { message } }),
      invalidatesTags: ["providerContacts"],
    }),

    /* ── Admin ── */
    adminGetAllJobs: builder.query<JobListResponse, JobsQueryParams>({
      query: (params) => ({ url: "/jobs/admin/all-jobs", method: "GET", params }),
      providesTags: ["jobs"],
    }),

    adminUpdateJobStatus: builder.mutation<SingleJobResponse, { id: string; status: JobPostStatus; adminNote?: string; rejectedReason?: string }>({
      query: ({ id, ...body }) => ({ url: `/jobs/admin/${id}/status`, method: "PATCH", body }),
      invalidatesTags: ["jobs"],
    }),

    adminGetAllApplications: builder.query<{ success: boolean; message: string; data: JobApplication[]; meta: Meta }, JobsQueryParams>({
      query: (params) => ({ url: "/jobs/admin/all-applications", method: "GET", params }),
      providesTags: ["jobApplications"],
    }),

    adminGetAllProviders: builder.query<ProviderListResponse, JobsQueryParams>({
      query: (params) => ({ url: "/jobs/admin/all-providers", method: "GET", params }),
      providesTags: ["providers"],
    }),

    adminUpdateProviderStatus: builder.mutation<ProviderResponse, { id: string; status: "approved" | "rejected"; adminNote?: string }>({
      query: ({ id, ...body }) => ({ url: `/jobs/admin/providers/${id}/status`, method: "PATCH", body }),
      invalidatesTags: ["providers"],
    }),

    adminGetAllContactRequests: builder.query<ContactListResponse, JobsQueryParams>({
      query: (params) => ({ url: "/jobs/admin/all-contact-requests", method: "GET", params }),
      providesTags: ["providerContacts"],
    }),
  }),
});

export const {
  useGetApprovedJobsQuery,
  useGetJobByIdQuery,
  useGetApprovedProvidersQuery,
  useGetProviderByIdQuery,
  useGetMyJobsQuery,
  useGetMyApplicationsQuery,
  useGetMyProviderProfileQuery,
  useGetMyProviderContactsQuery,
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
  useRegisterProviderMutation,
  useUpdateProviderProfileMutation,
  useContactProviderMutation,
  useAdminGetAllJobsQuery,
  useAdminUpdateJobStatusMutation,
  useAdminGetAllApplicationsQuery,
  useAdminGetAllProvidersQuery,
  useAdminUpdateProviderStatusMutation,
  useAdminGetAllContactRequestsQuery,
} = jobApi;
