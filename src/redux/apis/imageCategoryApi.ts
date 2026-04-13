import { baseApi } from "./baseApi";

export interface ImageCategory {
  _id: string;
  name: string;
  description?: string;
  coverImageUrl?: string;
  coverImagePublicId?: string;
  isPublished: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ImageCategoryListResponse {
  success: boolean;
  message: string;
  data: ImageCategory[];
}

interface ImageCategoryResponse {
  success: boolean;
  message: string;
  data: ImageCategory;
}

export const imageCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllImageCategories: builder.query<ImageCategoryListResponse, void>({
      query: () => ({ url: "/image-categories/public", method: "GET" }),
      providesTags: ["imageCategories"],
    }),
    createImageCategory: builder.mutation<ImageCategoryResponse, FormData>({
      query: (body) => ({ url: "/image-categories/create", method: "POST", body }),
      invalidatesTags: ["imageCategories"],
    }),
    deleteImageCategory: builder.mutation<ImageCategoryResponse, string>({
      query: (id) => ({ url: `/image-categories/${id}`, method: "DELETE" }),
      invalidatesTags: ["imageCategories"],
    }),
    togglePublish: builder.mutation<ImageCategoryResponse, string>({
      query: (id) => ({ url: `/image-categories/${id}/publish`, method: "PATCH" }),
      invalidatesTags: ["imageCategories"],
    }),
    toggleFeature: builder.mutation<ImageCategoryResponse, string>({
      query: (id) => ({ url: `/image-categories/${id}/feature`, method: "PATCH" }),
      invalidatesTags: ["imageCategories"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAllImageCategoriesQuery,
  useCreateImageCategoryMutation,
  useDeleteImageCategoryMutation,
  useTogglePublishMutation,
  useToggleFeatureMutation,
} = imageCategoryApi;
