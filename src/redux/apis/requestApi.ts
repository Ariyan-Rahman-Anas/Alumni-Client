import { baseApi } from "./baseApi";
import type {
  ICreateRequestPayload,
  IRequestListResponse,
  IRequestSingleResponse,
  IUpdateRequestPayload,
} from "@/types/request.types";

export const requestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // User: submit a new request
    createRequest: builder.mutation<IRequestSingleResponse, ICreateRequestPayload>({
      query: (body) => ({ url: "/requests", method: "POST", body }),
      invalidatesTags: ["requests"],
    }),

    // User: my own requests
    getMyRequests: builder.query<IRequestListResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 } = {}) => ({
        url: "/requests/my",
        method: "GET",
        params: { page, limit, sort: "-createdAt" },
      }),
      providesTags: ["requests"],
    }),

    // Admin: all requests
    getAllRequests: builder.query<
      IRequestListResponse,
      { page?: number; limit?: number; status?: string; search?: string; category?: string }
    >({
      query: ({ page = 1, limit = 10, status, search, category } = {}) => ({
        url: "/requests",
        method: "GET",
        params: {
          page,
          limit,
          sort: "-createdAt",
          ...(status ? { status } : {}),
          ...(search ? { searchTerm: search } : {}),
          ...(category ? { category } : {}),
        },
      }),
      providesTags: ["requests"],
    }),

    // Admin: single request
    getRequestById: builder.query<IRequestSingleResponse, string>({
      query: (id) => ({ url: `/requests/${id}`, method: "GET" }),
      providesTags: (_r, _e, id) => [{ type: "requests", id }],
    }),

    // Admin: update status / adminMessage
    updateRequest: builder.mutation<IRequestSingleResponse, { id: string; body: IUpdateRequestPayload }>({
      query: ({ id, body }) => ({ url: `/requests/${id}`, method: "PATCH", body }),
      invalidatesTags: (_r, _e, { id }) => ["requests", { type: "requests", id }],
    }),

    // Admin: delete
    deleteRequest: builder.mutation<{ success: boolean; message: string }, string>({
      query: (id) => ({ url: `/requests/${id}`, method: "DELETE" }),
      invalidatesTags: ["requests"],
    }),
  }),
});

export const {
  useCreateRequestMutation,
  useGetMyRequestsQuery,
  useGetAllRequestsQuery,
  useGetRequestByIdQuery,
  useUpdateRequestMutation,
  useDeleteRequestMutation,
} = requestApi;
