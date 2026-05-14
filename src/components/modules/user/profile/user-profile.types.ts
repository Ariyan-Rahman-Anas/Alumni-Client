import z from "zod";
import { profileSchema } from "./user-profiel.schema";

export interface IUserProfile {
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
    isInterestedToDonateBlood?: boolean;
    bloodDonateCount?: number;
    lastBloodDonationDate?: string;
}

export interface IUserProfileResponse {
    success: boolean;
    message: string;
    data: IUserProfile;
}

export interface IUserListResponse {
    success: boolean;
    message: string;
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    };
    data: IUserProfile[];
}

export interface IEligibleDonor {
    _id: string;
    name: string;
    phone: string;
    email: string;
    imageUrl?: string;
    bloodGroup: string;
    bloodDonateCount: number;
    lastBloodDonationDate: string;
    daysSinceLastDonation: number;
}

export interface IEligibleDonorGroup {
    bloodGroup: string;
    topDonors: IEligibleDonor[];
}

export interface IEligibleDonorsByBloodGroupResponse {
    success: boolean;
    message: string;
    data: IEligibleDonorGroup[];
}

export interface IUpdateUserPayload {
    name?: string;
    phone?: string;
    batch?: number;
    bloodGroup?: string;
    dob?: string;
    currentAddress?: string;
    permanentAddress?: string;
    workplace?: string;
    position?: string;
    isInterestedToDonateBlood?: boolean;
    bloodDonateCount?: number;
    lastBloodDonationDate?: string;
}

export type TProfileFormValues = z.infer<typeof profileSchema>;

export interface ISectionCardProps {
    title: string;
    icon: React.ReactNode;
    index: number;
    children: React.ReactNode;
}