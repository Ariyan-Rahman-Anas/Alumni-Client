import { baseApi } from "../base";
import type {
    JobsQueryParams,
    ProviderListResponse,
    ProviderResponse,
    ContactListResponse,
    CreateProviderPayload,
} from "./types";

export const providersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /* ── Public ── */
        getApprovedProviders: builder.query<ProviderListResponse, JobsQueryParams>({
            query: (params) => ({ url: "/jobs/providers", method: "GET", params }),
            providesTags: ["providers"],
        }),

        getProviderById: builder.query<ProviderResponse, string>({
            query: (id) => ({ url: `/jobs/providers/${id}`, method: "GET" }),
            providesTags: (_r, _e, id) => [{ type: "providers", id }],
        }),

        /* ── Authenticated ── */
        getMyProviderProfile: builder.query<ProviderResponse, void>({
            query: () => ({ url: "/jobs/my/provider-profile", method: "GET" }),
            providesTags: ["providers"],
        }),

        getMyProviderContacts: builder.query<ContactListResponse, void>({
            query: () => ({ url: "/jobs/my/provider-contacts", method: "GET" }),
            providesTags: ["providerContacts"],
        }),

        getMySentContacts: builder.query<ContactListResponse, void>({
            query: () => ({ url: "/jobs/my/sent-contacts", method: "GET" }),
            providesTags: ["providerContacts"],
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

        deleteProviderProfile: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({ url: `/jobs/providers/${id}`, method: "DELETE" }),
            invalidatesTags: ["providers"],
        }),

        replyToContact: builder.mutation<{ success: boolean; message: string; data: import("./types").ProviderContact }, { id: string; body: string }>({
            query: ({ id, body }) => ({ url: `/jobs/contacts/${id}/reply`, method: "POST", body: { body } }),
            invalidatesTags: ["providerContacts"],
        }),

        contactProvider: builder.mutation<{ success: boolean; message: string }, { id: string; message?: string }>({
            query: ({ id, message }) => ({ url: `/jobs/providers/${id}/contact`, method: "POST", body: { message } }),
            invalidatesTags: ["providerContacts"],
        }),

        deleteContact: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({ url: `/jobs/contacts/${id}`, method: "DELETE" }),
            invalidatesTags: ["providerContacts"],
        }),

        deleteContactReply: builder.mutation<{ success: boolean; message: string; data: import("./types").ProviderContact }, { contactId: string; replyId: string }>({
            query: ({ contactId, replyId }) => ({ url: `/jobs/contacts/${contactId}/replies/${replyId}`, method: "DELETE" }),
            invalidatesTags: ["providerContacts"],
        }),

        /* ── Admin ── */
        adminGetAllProviders: builder.query<ProviderListResponse, JobsQueryParams>({
            query: (params) => ({ url: "/jobs/admin/all-providers", method: "GET", params }),
            providesTags: ["providers"],
        }),

        adminUpdateProviderStatus: builder.mutation<ProviderResponse, { id: string; status: "APPROVED" | "REJECTED"; adminNote: string }>({
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
    useGetApprovedProvidersQuery,
    useGetProviderByIdQuery,
    useGetMyProviderProfileQuery,
    useGetMyProviderContactsQuery,
    useGetMySentContactsQuery,
    useRegisterProviderMutation,
    useUpdateProviderProfileMutation,
    useDeleteProviderProfileMutation,
    useReplyToContactMutation,
    useContactProviderMutation,
    useDeleteContactMutation,
    useDeleteContactReplyMutation,
    useAdminGetAllProvidersQuery,
    useAdminUpdateProviderStatusMutation,
    useAdminGetAllContactRequestsQuery,
} = providersApi;
