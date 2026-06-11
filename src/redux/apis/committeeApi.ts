import type {
    ICommitteeListResponse,
    ICommitteeResponse,
    ICreateCommitteePayload,
} from "@/types/common/committee.types";
import { baseApi } from "./baseApi";

export const committeeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /* ── Public ───────────────────────────────────────────── */
        getActiveCommittee: builder.query<ICommitteeResponse, void>({
            query: () => ({ url: "/committees/active" }),
            providesTags: ["committees"],
        }),

        /* ── Admin ────────────────────────────────────────────── */
        getAllCommitteesAdmin: builder.query<ICommitteeListResponse, void>({
            query: () => ({ url: "/committees" }),
            providesTags: ["committees"],
        }),

        getCommitteeByIdAdmin: builder.query<ICommitteeResponse, string>({
            query: (id) => ({ url: `/committees/${id}` }),
            providesTags: (_result, _err, id) => [{ type: "committees", id }],
        }),

        createCommittee: builder.mutation<ICommitteeResponse, ICreateCommitteePayload>({
            query: (body) => ({ url: "/committees", method: "POST", body }),
            invalidatesTags: ["committees"],
        }),

        updateCommittee: builder.mutation<ICommitteeResponse, { id: string; body: Partial<ICreateCommitteePayload> }>({
            query: ({ id, body }) => ({ url: `/committees/${id}`, method: "PATCH", body }),
            invalidatesTags: ["committees"],
        }),

        setActiveCommittee: builder.mutation<ICommitteeResponse, string>({
            query: (id) => ({ url: `/committees/${id}/activate`, method: "PATCH" }),
            invalidatesTags: ["committees"],
        }),

        deleteCommittee: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({ url: `/committees/${id}`, method: "DELETE" }),
            invalidatesTags: ["committees"],
        }),
    }),
});

export const {
    useGetActiveCommitteeQuery,
    useGetAllCommitteesAdminQuery,
    useGetCommitteeByIdAdminQuery,
    useCreateCommitteeMutation,
    useUpdateCommitteeMutation,
    useSetActiveCommitteeMutation,
    useDeleteCommitteeMutation,
} = committeeApi;
