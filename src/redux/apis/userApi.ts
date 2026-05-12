import { IUpdateUserPayload, IUserListResponse, IUserProfileResponse } from "@/components/modules/user/user.types";
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUserProfile: builder.query<IUserProfileResponse, string>({
            query: (id) => ({ url: `/users/${id}`, method: "GET" }),
            providesTags: (_result, _err, id) => [{ type: "users", id }],
        }),

        getAllUsers: builder.query<IUserListResponse, { page?: number; limit?: number; approvalStatus?: string; search?: string; bloodGroup?: string; section?: string; dobYear?: number; dobMonth?: number; dobDay?: number; isVerified?: boolean }>({
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
      
        getAllApprovedUsers: builder.query<IUserListResponse, { page?: number; limit?: number; search?: string; bloodGroup?: string; section?: string; batch?: string }>({
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

        approveUser: builder.mutation<IUserProfileResponse, string>({
            query: (id) => ({ url: `/users/${id}/approve`, method: "PATCH" }),
            invalidatesTags: ["users"],
        }),

        makeAdmin: builder.mutation<IUserProfileResponse, string>({
            query: (id) => ({ url: `/users/${id}/make-admin`, method: "PATCH" }),
            invalidatesTags: ["users"],
        }),

        makeAdminToUser: builder.mutation<IUserProfileResponse, string>({
            query: (id) => ({ url: `/users/${id}/make-user`, method: "PATCH" }),
            invalidatesTags: ["users"],
        }),

        deleteUser: builder.mutation<{ success: boolean; message: string }, string>({
            query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
            invalidatesTags: ["users"],
        }),

        updateUser: builder.mutation<
            IUserProfileResponse,
            { id: string; payload: IUpdateUserPayload; image?: File | null }
        >({
            query: ({ id, payload, image }) => {
                if (image) {
                    const formData = new FormData();
                    (Object.keys(payload) as (keyof IUpdateUserPayload)[]).forEach((key) => {
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
    useMakeAdminMutation,
    useMakeAdminToUserMutation,
    useDeleteUserMutation,
    useUpdateUserMutation,
} = userApi;
