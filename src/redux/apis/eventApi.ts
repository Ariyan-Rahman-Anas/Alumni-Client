import {
    EventListResponse,
    EventResponse,
    ToggleResponse,
    EventRegistrationResponse,
    MyRegistrationsResponse,
    EventRegistrationsListResponse,
    RegisterForEventPayload,
    CancelRequestResponse,
    CancelRequestListResponse,
    SubmitCancelRequestPayload,
    ProcessCancelRequestPayload,
} from "@/types/common/events.types";
import { baseApi } from "./baseApi";



export const eventApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllEventsAdmin: builder.query<
            EventListResponse,
            { page?: number; limit?: number; category?: string; status?: string; search?: string }
        >({
            query: ({ page = 1, limit = 10, category, status, search } = {}) => ({
                url: "/events/",
                params: {
                    page,
                    limit,
                    ...(category ? { category } : {}),
                    ...(status ? { status } : {}),
                    ...(search ? { searchTerm: search } : {}),
                },
            }),
            providesTags: ["events"],
        }),


        getAllPublishedEvents: builder.query<
            EventListResponse,
            { page?: number; limit?: number; category?: string; status?: string; locationType?: string; search?: string }
        >({
            query: ({ page = 1, limit = 10, category, status, locationType,  search } = {}) => ({
                url: "/events/public",
                params: {
                    page,
                    limit,
                    ...(category ? { category } : {}),
                    ...(status ? { status } : {}),
                        ...(locationType ? { locationType } : {}),
                    ...(search ? { searchTerm: search } : {}),
                },
            }),
            providesTags: ["events"],
        }),

        getEventById: builder.query<EventResponse, string>({
            query: (id) => ({ url: `/events/public/${id}` }),
            // providesTags: (result, error, id) => [{ type: "events", id }],
            providesTags: ["events"],
        }),
        
        getEventBySlug: builder.query<EventResponse, string>({
            query: (slug) => ({ url: `/events/public/slug/${slug}` }),
            // providesTags: (result, error, slug) => [{ type: "events", id: slug }],
            providesTags: ["events"],
        }),

        createEvent: builder.mutation<EventResponse, FormData>({
            query: (body) => ({ url: "/events/", method: "POST", body }),
            invalidatesTags: ["events"],
        }),

        updateEvent: builder.mutation<EventResponse, { id: string; body: FormData }>({
            query: ({ id, body }) => ({ url: `/events/${id}`, method: "PATCH", body }),
            invalidatesTags: ["events"],
        }),

        deleteEvent: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({ url: `/events/${id}`, method: "DELETE" }),
            invalidatesTags: ["events"],
        }),

        toggleEventPublish: builder.mutation<ToggleResponse, string>({
            query: (id) => ({ url: `/events/${id}/publish`, method: "PATCH" }),
            invalidatesTags: ["events"],
        }),

        toggleEventFeature: builder.mutation<ToggleResponse, string>({
            query: (id) => ({ url: `/events/${id}/feature`, method: "PATCH" }),
            invalidatesTags: ["events"],
        }),

        /* ── Registration endpoints ── */
        registerForEvent: builder.mutation<
            EventRegistrationResponse,
            { eventId: string; body: RegisterForEventPayload }
        >({
            query: ({ eventId, body }) => ({ url: `/events/${eventId}/register`, method: "POST", body }),
            invalidatesTags: ["events", "eventRegistrations"],
        }),

        getMyRegistrations: builder.query<MyRegistrationsResponse, void>({
            query: () => ({ url: "/events/my-registrations" }),
            providesTags: ["eventRegistrations"],
        }),

        cancelMyRegistration: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({ url: `/events/registrations/${id}/cancel`, method: "PATCH" }),
            invalidatesTags: ["eventRegistrations"],
        }),

        /* ── Admin: registrations per event ── */
        getRegistrationsByEvent: builder.query<EventRegistrationsListResponse, string>({
            query: (eventId) => ({ url: `/events/${eventId}/registrations` }),
            providesTags: ["eventRegistrations"],
        }),

        verifyPayment: builder.mutation<
            EventRegistrationResponse,
            { id: string; paymentStatus: "PAID" | "WAIVED"; paymentMethod?: string; bankName?: string; transactionId?: string }
        >({
            query: ({ id, ...body }) => ({ url: `/events/registrations/${id}/verify-payment`, method: "PATCH", body }),
            invalidatesTags: ["eventRegistrations"],
        }),

        /* ── Cancel requests (user) ── */
        submitCancelRequest: builder.mutation<CancelRequestResponse, { registrationId: string; body: SubmitCancelRequestPayload }>({
            query: ({ registrationId, body }) => ({
                url: `/events/registrations/${registrationId}/cancel-request`,
                method: "POST",
                body,
            }),
            invalidatesTags: ["eventRegistrations", "cancelRequests"],
        }),

        getMyCancelRequest: builder.query<CancelRequestResponse, string>({
            query: (registrationId) => ({ url: `/events/registrations/${registrationId}/cancel-request` }),
            providesTags: ["cancelRequests"],
        }),

        getMyCancelRequests: builder.query<CancelRequestListResponse, void>({
            query: () => ({ url: "/events/my-cancel-requests" }),
            providesTags: ["cancelRequests"],
        }),

        /* ── Cancel requests (admin) ── */
        getAllCancelRequests: builder.query<CancelRequestListResponse, { status?: string } | void>({
            query: (params) => ({
                url: "/events/cancel-requests",
                params: params && (params as { status?: string }).status ? { status: (params as { status?: string }).status } : {},
            }),
            providesTags: ["cancelRequests"],
        }),

        processCancelRequest: builder.mutation<CancelRequestResponse, { id: string; body: ProcessCancelRequestPayload }>({
            query: ({ id, body }) => ({
                url: `/events/cancel-requests/${id}/process`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["eventRegistrations", "cancelRequests"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetAllEventsAdminQuery,
    useGetAllPublishedEventsQuery,
    useGetEventByIdQuery,
    useGetEventBySlugQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
    useToggleEventPublishMutation,
    useToggleEventFeatureMutation,
    useRegisterForEventMutation,
    useGetMyRegistrationsQuery,
    useCancelMyRegistrationMutation,
    useGetRegistrationsByEventQuery,
    useVerifyPaymentMutation,
    useSubmitCancelRequestMutation,
    useGetMyCancelRequestQuery,
    useGetMyCancelRequestsQuery,
    useGetAllCancelRequestsQuery,
    useProcessCancelRequestMutation,
} = eventApi;
