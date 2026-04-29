import { IUserProfile } from "@/components/modules/user/user.types";
import { baseApi } from "./baseApi";

export interface GalleryCategory {
  _id: string;
  name: string;
}

export interface GalleryImage {
  _id: string;
  title: string;
  innerTitle?: string;
  description?: string;
  category: {
    _id: string;
    name: string;
  };
  imageUrl: string;
  imagePublicId: string;
  uploadedBy: IUserProfile;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export type PopulatedGalleryImage = Omit<GalleryImage, "category"> & {
  category: GalleryCategory;
};

interface GalleryListResponse {
  success: boolean;
  message: string;
  data: GalleryImage[];
}

interface GalleryPaginatedResponse {
  success: boolean;
  message: string;
  data: GalleryImage[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

interface GalleryCursorResponse {
  success: boolean;
  message: string;
  data: GalleryImage[];
  meta: {
    nextCursor: string | null;
    hasMore: boolean;
  };
}

interface GalleryResponse {
  success: boolean;
  message: string;
  data: GalleryImage;
}

interface BulkResponse {
  success: boolean;
  message: string;
  data: { deleted?: number; updated?: number };
}

interface CreateGalleryPayload {
  category: string;
  title?: string;
  description?: string;
}

export interface UpdateGalleryPayload {
  title?: string;
  innerTitle?: string;
  description?: string;
  category?: string;
  isPublished?: boolean;
  isFeatured?: boolean;
}

interface GetAdminGalleriesParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  category?: string;
}

interface GetPublishedGalleriesParams {
  cursor?: string;
  limit?: number;
  category?: string;
}

export interface TopContributor {
  user: IUserProfile;
  imageCount: number;
}

interface TopContributorsResponse {
  success: boolean;
  message: string;
  data: TopContributor[];
}


export const galleryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTopContributors: builder.query<TopContributorsResponse, void>({
      query: () => ({ url: "/gallery/top-contributors", method: "GET" }),
      providesTags: ["galleryImages"],
    }),

    getImagesByContributor: builder.query<GalleryCursorResponse, { userId: string; cursor?: string; limit?: number }>({
      query: ({ userId, ...params }) => ({ url: `/gallery/contributor/${userId}`, method: "GET", params }),
      providesTags: ["galleryImages"],
    }),

    getPublishedImages: builder.query<GalleryCursorResponse, GetPublishedGalleriesParams>({
      query: (params) => ({ url: "/gallery", method: "GET", params }),
      providesTags: ["galleryImages"],
    }),

    getAllImages: builder.query<GalleryPaginatedResponse, GetAdminGalleriesParams>({
      query: (params) => ({ url: "/gallery/admin", method: "GET", params }),
      providesTags: ["galleryImages"],
    }),

    createGallery: builder.mutation<
      GalleryListResponse,
      { payload: CreateGalleryPayload; images: File[]; innerTitles?: string[] }
    >({
      query: ({ payload, images, innerTitles }) => {
        const formData = new FormData();
        formData.append("category", payload.category);
        if (payload.title) formData.append("title", payload.title);
        if (payload.description) formData.append("description", payload.description);
        if (innerTitles && innerTitles.length > 0) {
          formData.append("innerTitles", JSON.stringify(innerTitles));
        }
        images.forEach((img) => formData.append("images", img));
        return { url: "/gallery", method: "POST", body: formData };
      },
      invalidatesTags: ["galleryImages"],
    }),

    updateGallery: builder.mutation<GalleryResponse, { id: string; payload: UpdateGalleryPayload }>({
      query: ({ id, payload }) => ({
        url: `/gallery/${id}`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: ["galleryImages"],
    }),

    deleteGallery: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/gallery/${id}`, method: "DELETE" }),
      invalidatesTags: ["galleryImages"],
    }),

    deleteMultipleGalleries: builder.mutation<BulkResponse, string[]>({
      query: (ids) => ({ url: "/gallery/bulk", method: "DELETE", body: { ids } }),
      invalidatesTags: ["galleryImages"],
    }),

    toggleGalleryPublish: builder.mutation<GalleryResponse, string>({
      query: (id) => ({ url: `/gallery/${id}/publish`, method: "PATCH" }),
      invalidatesTags: ["galleryImages"],
    }),

    toggleGalleryFeatured: builder.mutation<GalleryResponse, string>({
      query: (id) => ({ url: `/gallery/${id}/featured`, method: "PATCH" }),
      invalidatesTags: ["galleryImages"],
    }),

    toggleGalleryPublishMultiple: builder.mutation<BulkResponse, string[]>({
      query: (ids) => ({ url: "/gallery/bulk-publish", method: "PATCH", body: { ids } }),
      invalidatesTags: ["galleryImages"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTopContributorsQuery,
  useGetImagesByContributorQuery,
  useGetPublishedImagesQuery,
  useGetAllImagesQuery,
  useCreateGalleryMutation,
  useUpdateGalleryMutation,
  useDeleteGalleryMutation,
  useDeleteMultipleGalleriesMutation,
  useToggleGalleryPublishMutation,
  useToggleGalleryFeaturedMutation,
  useToggleGalleryPublishMultipleMutation,
} = galleryApi;
