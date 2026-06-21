import {
  IAnnouncementListResponse,
  IAnnouncementResponse,
  ICreateAnnouncementPayload,
  IGetAnnouncementsParams,
} from "@/components/modules/user/announcements/announcement.types";

import { baseApi } from "./baseApi";
import { TAnnouncementStatus } from "@/constants";

export const announcementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Public
    getPublishedAnnouncements: builder.query<IAnnouncementListResponse, IGetAnnouncementsParams>({
      query: (params) => ({ url: "/announcements", method: "GET", params }),
      providesTags: ["announcements"],
    }),

    getAnnouncementBySlug: builder.query<IAnnouncementResponse, string>({

      query: (slug) => ({ url: `/announcements/slug/${slug}`, method: "GET" }),
      providesTags: (_result, _err, slug) => [{ type: "announcements", id: slug }],
    }),

    // Admin
    getAllAnnouncementsAdmin: builder.query<IAnnouncementListResponse, IGetAnnouncementsParams>({
      query: (params) => ({ url: "/announcements/admin", method: "GET", params }),
      providesTags: ["announcements"],
    }),

    getAnnouncementByIdAdmin: builder.query<IAnnouncementResponse, string>({
      query: (id) => ({ url: `/announcements/admin/${id}`, method: "GET" }),
      providesTags: (_result, _err, id) => [{ type: "announcements", id }],
    }),

    createAnnouncement: builder.mutation<
      IAnnouncementResponse,
      { payload: ICreateAnnouncementPayload; coverImage?: File | null }
    >({
      query: ({ payload, coverImage }) => {
        if (coverImage) {
          const formData = new FormData();
          (Object.keys(payload) as (keyof ICreateAnnouncementPayload)[]).forEach((key) => {
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
      IAnnouncementResponse,
      { id: string; payload: Partial<ICreateAnnouncementPayload>; coverImage?: File | null }
    >({
      query: ({ id, payload, coverImage }) => {
        if (coverImage) {
          const formData = new FormData();
          (Object.keys(payload) as (keyof ICreateAnnouncementPayload)[]).forEach((key) => {
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
      IAnnouncementResponse,
      { id: string; status: TAnnouncementStatus }
    >({
      query: ({ id, status }) => ({
        url: `/announcements/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["announcements"],
    }),

    toggleAnnouncementPin: builder.mutation<IAnnouncementResponse, string>({
      query: (id) => ({ url: `/announcements/${id}/pin`, method: "PATCH" }),
      invalidatesTags: ["announcements"],
    }),

    toggleAnnouncementFeatured: builder.mutation<IAnnouncementResponse, string>({
      query: (id) => ({ url: `/announcements/${id}/featured`, method: "PATCH" }),
      invalidatesTags: ["announcements"],
    }),

    addAnnouncementAttachment: builder.mutation<
      IAnnouncementResponse,
      { id: string; file: File }>({
      query: ({ id, file }) => {
        const formData = new FormData();
        formData.append("attachment", file);
        return { url: `/announcements/${id}/attachments`, method: "POST", body: formData };
      },
      invalidatesTags: ["announcements"],
    }),

    removeAnnouncementAttachment: builder.mutation<
      IAnnouncementResponse,
      { id: string; publicId: string }>({
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
