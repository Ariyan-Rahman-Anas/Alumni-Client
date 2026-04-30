import { AuthUser } from "../slice/authSlice";
import { baseApi } from "./baseApi";

interface RegisterResponse {
    success: boolean;
    message: string;
    data: {
        user: {
            _id: string;
            name: string;
            email: string;
        };
        email: string;
    };
}

interface VerifyOtpResponse {
    success: boolean;
    message: string;
    data: { isVerified: boolean };
}

interface ResendOtpResponse {
    success: boolean;
    message: string;
    data: null;
}

export interface RegisterPayload {
    name: string;
    email: string;
    phone: string;
    country: string;
    batch: number;
    section: string;
    bloodGroup: string;
    dob: string;
    currentAddress: string;
    permanentAddress: string;
    workplace?: string;
    position?: string;
    password: string;
}

interface LoginResponse {
    success: boolean;
    message: string;
    data: { user: AuthUser; accessToken: string };
}

interface RefreshTokenResponse {
    success: boolean;
    message: string;
    data: { accessToken: string; user: AuthUser } | null;
}

interface GetMeResponse {
    success: boolean;
    message: string;
    data: AuthUser;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        registerUser: builder.mutation<
            RegisterResponse,
            { payload: RegisterPayload; image?: File | null; alumniProof?: File | null }
        >({
            query: ({ payload, image, alumniProof }) => {
                const formData = new FormData();
                (Object.keys(payload) as (keyof RegisterPayload)[]).forEach((key) => {
                    const val = payload[key];
                    if (val != null) formData.append(key, String(val));
                });
                if (image) formData.append("image", image);
                if (alumniProof) formData.append("alumniProof", alumniProof);
                return { url: "/auth/register", method: "POST", body: formData };
            },
        }),

        verifyOtp: builder.mutation<VerifyOtpResponse, { email: string; otp: string }>({
            query: (body) => ({
                url: "/auth/verify-email",
                method: "POST",
                body,
            }),
        }),

        resendOtp: builder.mutation<ResendOtpResponse, { email: string }>({
            query: (body) => ({
                url: "/auth/resend-otp",
                method: "POST",
                body,
            }),
        }),

        loginUser: builder.mutation<LoginResponse, LoginPayload>({
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
        restoreSession: builder.query<RefreshTokenResponse, void>({
            query: () => ({ url: "/auth/refresh-token", method: "POST" }),
        }),

        getMe: builder.query<GetMeResponse, void>({
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

