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

interface ImageCategoryPayload {
  name: string;
  description?: string;
}

export const imageCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllImageCategories: builder.query<ImageCategoryListResponse, void>({
      query: () => ({ url: "/image-categories/public", method: "GET" }),
      providesTags: ["imageCategories"],
    }),

    createImageCategory: builder.mutation<ImageCategoryResponse, {payload: ImageCategoryPayload, image?: File | null}>({
      query: ({ payload, image }) => {
        const formData = new FormData();
        (Object.keys(payload) as (keyof ImageCategoryPayload)[]).forEach((key) => {
          const val = payload[key];
          if (val != null) formData.append(key, String(val));
        });
        if (image) formData.append("image", image);
        return { url: "/image-categories/create", method: "POST", body: formData };
      },
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
