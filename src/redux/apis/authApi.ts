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
    batch: number;
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
    data: { user: AuthUser };
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
            { payload: RegisterPayload; image?: File | null }
        >({
            query: ({ payload, image }) => {
                if (image) {
                    const formData = new FormData();
                    (Object.keys(payload) as (keyof RegisterPayload)[]).forEach((key) => {
                        const val = payload[key];
                        if (val != null) formData.append(key, String(val));
                    });
                    formData.append("image", image);
                    return { url: "/auth/register", method: "POST", body: formData };
                }
                return { url: "/auth/register", method: "POST", body: payload };
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
    useGetMeQuery,
    useChangePasswordMutation,
} = authApi;

