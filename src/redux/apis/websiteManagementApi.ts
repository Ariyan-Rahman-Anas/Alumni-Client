import { baseApi } from "./base";

export interface IWebsiteManagement {
    _id: string;
    motto: string;
    schoolName: string;
    primaryColor?: string;
    primaryColorDark?: string;
    bloodBankColor?: string;
    bloodBankColorDark?: string;
    fullAddress?: string;
    postalCode: string;
    area: string;
    thana: string;
    district: string;
    division: string;
    country: string;
    contactNumber: string;
    email: string;
    whatsappNumber?: string;
    facebook?: string;
    youtube?: string;
    bannerUrl?: string;
    bannerPublicId?: string;
    updatedBy: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IWebsiteManagementResponse {
    success: boolean;
    message: string;
    data: IWebsiteManagement;
}

export type IWebsiteManagementPayload = Omit<IWebsiteManagement, "_id" | "bannerUrl" | "bannerPublicId" | "createdAt" | "updatedAt">;
export type IWebsiteManagementUpdatePayload = Partial<IWebsiteManagementPayload>;

const buildFormData = (
    payload: IWebsiteManagementPayload | IWebsiteManagementUpdatePayload,
    banner?: File | null
): FormData | Record<string, unknown> => {
    if (!banner) {
        return Object.fromEntries(
            Object.entries(payload).filter(([, v]) => v != null && v !== "")
        );
    }
    const fd = new FormData();
    Object.entries(payload).forEach(([k, v]) => {
        if (v != null && v !== "") fd.append(k, String(v));
    });
    fd.append("banner", banner);
    return fd;
};

export const websiteManagementApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getWebsiteManagement: builder.query<IWebsiteManagementResponse, void>({
            query: () => ({ url: "/website-management", method: "GET" }),
            providesTags: ["websiteManagement"],
        }),

        createWebsiteManagement: builder.mutation<
            IWebsiteManagementResponse,
            { payload: IWebsiteManagementPayload; banner?: File | null }
        >({
            query: ({ payload, banner }) => ({
                url: "/website-management",
                method: "POST",
                body: buildFormData(payload, banner),
            }),
            invalidatesTags: ["websiteManagement"],
        }),

        updateWebsiteManagement: builder.mutation<
            IWebsiteManagementResponse,
            { payload: IWebsiteManagementUpdatePayload; banner?: File | null }
        >({
            query: ({ payload, banner }) => ({
                url: "/website-management",
                method: "PATCH",
                body: buildFormData(payload, banner),
            }),
            invalidatesTags: ["websiteManagement"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useGetWebsiteManagementQuery,
    useCreateWebsiteManagementMutation,
    useUpdateWebsiteManagementMutation,
} = websiteManagementApi;
