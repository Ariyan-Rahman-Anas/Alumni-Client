import { baseApi } from "./baseApi";

interface RegisterResponse {
    success: boolean;
    message: string;
    data: {
        _id: string;
        name: string;
        email: string;
    };
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

export const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        /**
         * Sends registration data. When an image file is provided the request
         * uses multipart/form-data; otherwise plain JSON is sent.
         */
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
    }),
});

export const { useRegisterUserMutation } = authApi;
