import { IUserProfile } from "@/components/modules/user/user.types";
import { baseApi } from "./baseApi";

export type AnnouncementStatus = "draft" | "published" | "scheduled" | "archived";
export type AnnouncementPriority = "urgent" | "high" | "normal";
export type AnnouncementType = "general" | "notice" | "event" | "news" | "update" | "alert";

export interface AnnouncementAttachment {
  url: string;
  publicId: string;
  name: string;
  fileType: string;
  size: number;
}

export interface Announcement {
  _id: string;
  title: string;
  slug: string;
  description: string;
  body?: string;
  coverImage?: string;
  coverImagePublicId?: string;
  status: AnnouncementStatus;
  priority: AnnouncementPriority;
  type: AnnouncementType;
  createdBy: IUserProfile;
  updatedBy?: IUserProfile;
  publishedAt?: string;
  scheduledAt?: string;
  expiresAt?: string;
  isPinned: boolean;
  isFeatured: boolean;
  tags: string[];
  attachments: AnnouncementAttachment[];
  ctaLink?: string;
  ctaLabel?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface AnnouncementResponse {
  success: boolean;
  message: string;
  data: Announcement;
}

interface AnnouncementListResponse {
  success: boolean;
  message: string;
  data: Announcement[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface CreateAnnouncementPayload {
  title: string;
  description: string;
  body?: string;
  status?: AnnouncementStatus;
  priority?: AnnouncementPriority;
  type?: AnnouncementType;
  scheduledAt?: string;
  expiresAt?: string;
  isPinned?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  ctaLink?: string;
  ctaLabel?: string;
}

export interface GetAnnouncementsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: AnnouncementStatus;
  priority?: AnnouncementPriority;
  type?: AnnouncementType;
  isPinned?: boolean;
}

export const announcementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Public
    getPublishedAnnouncements: builder.query<AnnouncementListResponse, GetAnnouncementsParams>({
      query: (params) => ({ url: "/announcements", method: "GET", params }),
      providesTags: ["announcements"],
    }),

    getAnnouncementBySlug: builder.query<AnnouncementResponse, string>({
      query: (slug) => ({ url: `/announcements/slug/${slug}`, method: "GET" }),
      providesTags: (_result, _err, slug) => [{ type: "announcements", id: slug }],
    }),

    // Admin
    getAllAnnouncementsAdmin: builder.query<AnnouncementListResponse, GetAnnouncementsParams>({
      query: (params) => ({ url: "/announcements/admin", method: "GET", params }),
      providesTags: ["announcements"],
    }),

    getAnnouncementByIdAdmin: builder.query<AnnouncementResponse, string>({
      query: (id) => ({ url: `/announcements/admin/${id}`, method: "GET" }),
      providesTags: (_result, _err, id) => [{ type: "announcements", id }],
    }),

    createAnnouncement: builder.mutation<
      AnnouncementResponse,
      { payload: CreateAnnouncementPayload; coverImage?: File | null }
    >({
      query: ({ payload, coverImage }) => {
        if (coverImage) {
          const formData = new FormData();
          (Object.keys(payload) as (keyof CreateAnnouncementPayload)[]).forEach((key) => {
            const val = payload[key];
            if (val == null) return;
            if (Array.isArray(val)) {
              formData.append(key, JSON.stringify(val));
            } else {
              formData.append(key, String(val));
            }
          });
          formData.append("coverImage", coverImage);
          return { url: "/announcements", method: "POST", body: formData };
        }
        return { url: "/announcements", method: "POST", body: payload };
      },
      invalidatesTags: ["announcements"],
    }),

    updateAnnouncement: builder.mutation<
      AnnouncementResponse,
      { id: string; payload: Partial<CreateAnnouncementPayload>; coverImage?: File | null }
    >({
      query: ({ id, payload, coverImage }) => {
        if (coverImage) {
          const formData = new FormData();
          (Object.keys(payload) as (keyof CreateAnnouncementPayload)[]).forEach((key) => {
            const val = payload[key];
            if (val == null) return;
            if (Array.isArray(val)) {
              formData.append(key, JSON.stringify(val));
            } else {
              formData.append(key, String(val));
            }
          });
          formData.append("coverImage", coverImage);
          return { url: `/announcements/${id}`, method: "PATCH", body: formData };
        }
        return { url: `/announcements/${id}`, method: "PATCH", body: payload };
      },
      invalidatesTags: ["announcements"],
    }),

    deleteAnnouncement: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/announcements/${id}`, method: "DELETE" }),
      invalidatesTags: ["announcements"],
    }),

    updateAnnouncementStatus: builder.mutation<
      AnnouncementResponse,
      { id: string; status: AnnouncementStatus }
    >({
      query: ({ id, status }) => ({
        url: `/announcements/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["announcements"],
    }),

    toggleAnnouncementPin: builder.mutation<AnnouncementResponse, string>({
      query: (id) => ({ url: `/announcements/${id}/pin`, method: "PATCH" }),
      invalidatesTags: ["announcements"],
    }),

    toggleAnnouncementFeatured: builder.mutation<AnnouncementResponse, string>({
      query: (id) => ({ url: `/announcements/${id}/featured`, method: "PATCH" }),
      invalidatesTags: ["announcements"],
    }),

    addAnnouncementAttachment: builder.mutation<
      AnnouncementResponse,
      { id: string; file: File }
    >({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("attachment", file);
        return { url: `/announcements/${id}/attachments`, method: "POST", body: formData };
      },
      invalidatesTags: ["announcements"],
    }),

    removeAnnouncementAttachment: builder.mutation<
      AnnouncementResponse,
      { id: string; publicId: string }
    >({
      query: ({ id, publicId }) => ({
        url: `/announcements/${id}/attachments/${encodeURIComponent(publicId)}`,
        method: "DELETE",
      }),
      invalidatesTags: ["announcements"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetPublishedAnnouncementsQuery,
  useGetAnnouncementBySlugQuery,
  useGetAllAnnouncementsAdminQuery,
  useGetAnnouncementByIdAdminQuery,
  useCreateAnnouncementMutation,
  useUpdateAnnouncementMutation,
  useDeleteAnnouncementMutation,
  useUpdateAnnouncementStatusMutation,
  useToggleAnnouncementPinMutation,
  useToggleAnnouncementFeaturedMutation,
  useAddAnnouncementAttachmentMutation,
  useRemoveAnnouncementAttachmentMutation,
} = announcementApi;
