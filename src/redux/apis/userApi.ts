import { baseApi } from "./baseApi";

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    batch?: number;
    bloodGroup?: string;
    dob?: string;
    currentAddress?: string;
    permanentAddress?: string;
    workplace?: string;
    position?: string;
    imageUrl?: string;
    role: string;
    approvalStatus: string;
    isVerified: boolean;
}

interface UserProfileResponse {
    success: boolean;
    message: string;
    data: UserProfile;
}

export interface UpdateUserPayload {
    name?: string;
    phone?: string;
    batch?: number;
    bloodGroup?: string;
    dob?: string;
    currentAddress?: string;
    permanentAddress?: string;
    workplace?: string;
    position?: string;
}

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserProfile: builder.query<UserProfileResponse, string>({
            query: (id) => ({ url: `/users/${id}`, method: "GET" }),
            providesTags: (_result, _err, id) => [{ type: "users", id }],
        }),

        updateUser: builder.mutation<
            UserProfileResponse,
            { id: string; payload: UpdateUserPayload; image?: File | null }
        >({
            query: ({ id, payload, image }) => {
                if (image) {
                    const formData = new FormData();
                    (Object.keys(payload) as (keyof UpdateUserPayload)[]).forEach((key) => {
                        const val = payload[key];
                        if (val != null && val !== "") formData.append(key, String(val));
                    });
                    formData.append("image", image);
                    return { url: `/users/${id}`, method: "PATCH", body: formData };
                }
                // Filter out empty strings before sending JSON
                const clean = Object.fromEntries(
                    Object.entries(payload).filter(([, v]) => v != null && v !== "")
                );
                return { url: `/users/${id}`, method: "PATCH", body: clean };
            },
            invalidatesTags: (_result, _err, { id }) => [{ type: "users", id }],
        }),
    }),
    overrideExisting: false,
});

export const { useGetUserProfileQuery, useUpdateUserMutation } = userApi;
