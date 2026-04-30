import { IContactListResponse, IJobsQueryParams, IProviderContact, IProviderListResponse, IProviderResponse, TCreateProviderPayload } from "@/components/modules/user/job/job.types";
import { baseApi } from "../base";

export const providersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /* ── Public ── */
        getApprovedProviders: builder.query<IProviderListResponse, IJobsQueryParams>({
            query: (params) => ({ url: "/jobs/providers", method: "GET", params }),
            providesTags: ["providers"],
        }),

        getProviderById: builder.query<IProviderResponse, string>({
            query: (id) => ({ url: `/jobs/providers/${id}`, method: "GET" }),
            providesTags: (_r, _e, id) => [{ type: "providers", id }],
        }),

        /* ── Authenticated ── */
        getMyProviderProfile: builder.query<IProviderResponse, void>({
            query: () => ({ url: "/jobs/my/provider-profile", method: "GET" }),
            providesTags: ["providers"],
        }),

        getMyProviderContacts: builder.query<IContactListResponse, void>({
            query: () => ({ url: "/jobs/my/provider-contacts", method: "GET" }),
            providesTags: ["providerContacts"],
        }),

        getMySentContacts: builder.query<IContactListResponse, void>({
            query: () => ({ url: "/jobs/my/sent-contacts", method: "GET" }),
            providesTags: ["providerContacts"],
        }),

        registerProvider: builder.mutation<IProviderResponse, { payload: TCreateProviderPayload; certificates?: File[] }>({
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

        updateProviderProfile: builder.mutation<IProviderResponse, { id: string; payload: Partial<TCreateProviderPayload> }>({
            query: ({ id, payload }) => ({ url: `/jobs/providers/${id}`, method: "PATCH", body: payload }),
            invalidatesTags: ["providers"],
        }),

        deleteProviderProfile: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({ url: `/jobs/providers/${id}`, method: "DELETE" }),
            invalidatesTags: ["providers"],
        }),

        replyToContact: builder.mutation<{ success: boolean; message: string; data: IProviderContact }, { id: string; body: string }>({
            // No invalidatesTags — state updated optimistically in MyProviderContactsPanel
            query: ({ id, body }) => ({ url: `/jobs/contacts/${id}/reply`, method: "POST", body: { body } }),
        }),

        contactProvider: builder.mutation<{ success: boolean; message: string }, { id: string; message?: string }>({
            query: ({ id, message }) => ({ url: `/jobs/providers/${id}/contact`, method: "POST", body: { message } }),
            invalidatesTags: ["providerContacts"],
        }),

        deleteContact: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({ url: `/jobs/contacts/${id}`, method: "DELETE" }),
            invalidatesTags: ["providerContacts"],
        }),

        deleteInitialMessage: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({ url: `/jobs/contacts/${id}/initial`, method: "DELETE" }),
            invalidatesTags: ["providerContacts"],
        }),

        deleteContactReply: builder.mutation<{ success: boolean; message: string; data: IProviderContact }, { contactId: string; replyId: string }>({
            // No invalidatesTags — deleted optimistically in MyProviderContactsPanel
            query: ({ contactId, replyId }) => ({ url: `/jobs/contacts/${contactId}/replies/${replyId}`, method: "DELETE" }),
        }),

        /* ── Admin ── */
        adminGetAllProviders: builder.query<IProviderListResponse, IJobsQueryParams>({
            query: (params) => ({ url: "/jobs/admin/all-providers", method: "GET", params }),
            providesTags: ["providers"],
        }),

        adminUpdateProviderStatus: builder.mutation<IProviderResponse, { id: string; status: "APPROVED" | "REJECTED"; adminNote: string }>({
            query: ({ id, ...body }) => ({ url: `/jobs/admin/providers/${id}/status`, method: "PATCH", body }),
            invalidatesTags: ["providers"],
        }),

        adminGetAllContactRequests: builder.query<IContactListResponse, IJobsQueryParams>({
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
    useDeleteInitialMessageMutation,
    useDeleteContactReplyMutation,
    useAdminGetAllProvidersQuery,
    useAdminUpdateProviderStatusMutation,
    useAdminGetAllContactRequestsQuery,
} = providersApi;
