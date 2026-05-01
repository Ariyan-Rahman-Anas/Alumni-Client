export interface IAuthUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    approvalStatus: string;
    isVerified: boolean;
    imageUrl?: string;
    batch?: number;
}

export interface IAuthState {
    user: IAuthUser | null;
    accessToken: string | null;
    isInitialized: boolean;
}

export interface IRegisterResponse {
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

export interface IVerifyOtpResponse {
    success: boolean;
    message: string;
    data: { isVerified: boolean };
}

export interface IResendOtpResponse {
    success: boolean;
    message: string;
    data: null;
}

export interface IRegisterPayload {
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

export interface ILoginResponse {
    success: boolean;
    message: string;
    data: { user: IAuthUser; accessToken: string };
}

export interface IRefreshTokenResponse {
    success: boolean;
    message: string;
    data: { accessToken: string; user: IAuthUser } | null;
}

export interface IGetMeResponse {
    success: boolean;
    message: string;
    data: IAuthUser;
}

export interface ILoginPayload {
    email: string;
    password: string;
}