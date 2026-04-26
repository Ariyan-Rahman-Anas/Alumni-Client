import { baseApi } from "./baseApi";

export interface UserProfile {
    _id: string;
    userId: string;
    name: string;
    email: string;
    phone?: string;
    batch?: number;
    section?: string;
    country?: string;
    bloodGroup?: string;
    dob?: string;
    currentAddress?: string;
    permanentAddress?: string;
    workplace?: string;
    position?: string;
    imageUrl?: string;
    alumniProofUrl?: string;
    role: string;
    approvalStatus: string;
    isVerified: boolean;
}

interface UserProfileResponse {
    success: boolean;
    message: string;
    data: UserProfile;
}

interface UserListResponse {
    success: boolean;
    message: string;
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data: UserProfile[];
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

        getAllUsers: builder.query<UserListResponse, { page?: number; limit?: number; approvalStatus?: string; search?: string; bloodGroup?: string; section?: string; dobYear?: number; dobMonth?: number; dobDay?: number; isVerified?: boolean }>({
            query: ({ page = 1, limit = 10, approvalStatus, search, bloodGroup, section, dobYear, dobMonth, dobDay, isVerified } = {}) => ({
                url: "/users",
                method: "GET",
                params: {
                    page,
                    limit,
                    ...(approvalStatus ? { approvalStatus } : {}),
                    ...(search ? { searchTerm: search } : {}),
                    ...(bloodGroup ? { bloodGroup } : {}),
                    ...(section ? { section } : {}),
                    ...(dobYear ? { dobYear } : {}),
                    ...(dobMonth ? { dobMonth } : {}),
                    ...(dobDay ? { dobDay } : {}),
                    ...(isVerified !== undefined ? { isVerified } : {}),
                },
            }),
            providesTags: ["users"],
        }),
      
        getAllApprovedUsers: builder.query<UserListResponse, { page?: number; limit?: number; search?: string; bloodGroup?: string; section?: string; batch?: string }>({
            query: ({ page = 1, limit = 10, search, bloodGroup, section, batch } = {}) => ({
                url: "/users/approved",
                method: "GET",
                params: {
                    page,
                    limit,
                    ...(search ? { searchTerm: search } : {}),
                    ...(bloodGroup ? { bloodGroup } : {}),
                    ...(section ? { section } : {}),
                    ...(batch ? { batch } : {}),
                },
            }),
            providesTags: ["users"],
        }),

        approveUser: builder.mutation<UserProfileResponse, string>({
            query: (id) => ({ url: `/users/${id}/approve`, method: "PATCH" }),
            invalidatesTags: ["users"],
        }),

        deleteUser: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
            invalidatesTags: ["users"],
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

export const {
    useGetUserProfileQuery,
    useGetAllUsersQuery,
    useGetAllApprovedUsersQuery,
    useApproveUserMutation,
    useDeleteUserMutation,
    useUpdateUserMutation,
} = userApi;
