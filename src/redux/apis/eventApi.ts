import { EventListResponse, EventResponse, ToggleResponse } from "@/types/common/events.types";
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
    useGetAllPublishedEventsQuery,
    useGetEventByIdQuery,
    useCreateEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation,
    useToggleEventPublishMutation,
    useToggleEventFeatureMutation,
} = eventApi;
