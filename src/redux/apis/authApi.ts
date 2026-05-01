import { IGetMeResponse, ILoginPayload, ILoginResponse, IRefreshTokenResponse, IRegisterPayload, IRegisterResponse, IResendOtpResponse, IVerifyOtpResponse } from "@/app/(auth)/auth.types";
import { baseApi } from "./baseApi";

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        registerUser: builder.mutation<
            IRegisterResponse,
            { payload: IRegisterPayload; image?: File | null; alumniProof?: File | null }
        >({
            query: ({ payload, image, alumniProof }) => {
                const formData = new FormData();
                (Object.keys(payload) as (keyof IRegisterPayload)[]).forEach((key) => {
                    const val = payload[key];
                    if (val != null) formData.append(key, String(val));
                });
                if (image) formData.append("image", image);
                if (alumniProof) formData.append("alumniProof", alumniProof);
                return { url: "/auth/register", method: "POST", body: formData };
            },
        }),

        verifyOtp: builder.mutation<IVerifyOtpResponse, { email: string; otp: string }>({
            query: (body) => ({
                url: "/auth/verify-email",
                method: "POST",
                body,
            }),
        }),

        resendOtp: builder.mutation<IResendOtpResponse, { email: string }>({
            query: (body) => ({
                url: "/auth/resend-otp",
                method: "POST",
                body,
            }),
        }),

        loginUser: builder.mutation<ILoginResponse, ILoginPayload>({
            query: (body) => ({
                url: "/auth/login",
                method: "POST",
                body,
            }),
        }),

        logoutUser: builder.mutation<{ success: boolean; message: string }, void>({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
        }),

        // Called on every page load to restore in-memory access token from httpOnly refresh cookie
        restoreSession: builder.query<IRefreshTokenResponse, void>({
            query: () => ({ url: "/auth/refresh-token", method: "POST" }),
        }),

        getMe: builder.query<IGetMeResponse, void>({
            query: () => ({ url: "/auth/me", method: "GET" }),
        }),

        changePassword: builder.mutation<
            { success: boolean; message: string },
            { currentPassword: string; newPassword: string }
        >({
            query: (body) => ({
                url: "/auth/change-password",
                method: "PATCH",
                body,
            }),
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useVerifyOtpMutation,
    useResendOtpMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useRestoreSessionQuery,
    useGetMeQuery,
    useChangePasswordMutation,
} = authApi;

