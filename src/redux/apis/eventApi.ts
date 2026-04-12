import { baseApi } from "./baseApi";

export interface PriceTier {
    _id?: string;
    label: string;
    fee: number;
    batchFrom?: number;
    batchTo?: number;
}

export interface Event {
    _id: string;
    title: string;
    description: string;
    coverImage?: string;
    coverImagePublicId?: string;
    category: string;
    status: string;
    startDateTime: string;
    endDateTime?: string;
    locationType: string;
    venue: string;
    meetingLink?: string;
    organizer?: string;
    contactInfo?: string;
    isRegistrationRequired: boolean;
    registrationOpensAt?: string;
    registrationDeadline?: string;
    maxAttendees?: number;
    isFree: boolean;
    priceTiers: PriceTier[];
    allowGuests: boolean;
    maxGuestsPerAlumni: number;
    guestFee: number;
    collectsTShirtSize: boolean;
    eventFlow: string[];
    isPublished: boolean;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
}

interface EventListResponse {
    success: boolean;
    message: string;
    meta: { page: number; limit: number; total: number; totalPage: number };
    data: Event[];
}

interface EventResponse {
    success: boolean;
    message: string;
    data: Event;
}

interface ToggleResponse {
    success: boolean;
    message: string;
    data: Event;
}

export const eventApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllEventsAdmin: builder.query<
            EventListResponse,
            { page?: number; limit?: number; category?: string; status?: string; search?: string }
        >({
            query: ({ page = 1, limit = 10, category, status, search } = {}) => ({
                url: "/events/",
                method: "GET",
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
    }),
    overrideExisting: false,
});

export const {
    useGetAllEventsAdminQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
    useToggleEventPublishMutation,
    useToggleEventFeatureMutation,
} = eventApi;
