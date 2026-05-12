import { IUserProfile } from "../profile/user-profile.types";

export type TTab = "all" | TJobPostType | "providers";

/* ── Enums / shared types ──────────────────────────────── */
export type TJobPostStatus = "PENDING" | "APPROVED" | "REJECTED" | "CLOSED";
export type TJobPostType = "OFFICIAL" | "TUITION" | "PERSONAL";
export type TJobType = "FULL_TIME" | "PART_TIME" | "REMOTE" | "CONTRACT" | "INTERN";
export type TExperienceLevel = "ENTRY" | "MID" | "SENIOR" | "EXECUTIVE";
export type TGender = "MALE" | "FEMALE" | "ANY";
export type TPaymentPer = "HOUR" | "MONTH" | "SESSION";
export type TServiceCategory =
    | "ELECTRICIAN" | "PLUMBER" | "COOK" | "DRIVER" | "CLEANER"
    | "CARPENTER" | "PAINTER" | "GARDENER" | "SECURITY";
export type TApplicationStatus = "PENDING" | "SELECTED" | "REJECTED";
export type TProviderType =
    | "TUTOR" | "ELECTRICIAN" | "PLUMBER" | "COOK" | "DRIVER" | "CLEANER"
    | "CARPENTER" | "PAINTER" | "GARDENER" | "SECURITY";
export type TProviderStatus = "PENDING" | "APPROVED" | "REJECTED";
export type TCommentReactionType = "LIKE" | "DISLIKE" | "HAHA" | "ANGRY" | "SAD" | "LOVE";

/* ── Admin note ──────────────────────────────────────────── */
export interface IAdminNote {
    note: string;
    addedBy: { _id: string; name: string; email: string; imageUrl?: string };
    addedAt: string;
}

/* ── Comments ────────────────────────────────────────────── */
export interface ICommentReactionEntry {
    userId: string;
    type: TCommentReactionType;
}

export interface ICommentReply {
    _id: string;
    author: IUserProfile;
    body: string;
    reactions: ICommentReactionEntry[];
    createdAt: string;
}

export interface IComment {
    _id: string;
    author: IUserProfile;
    body: string;
    replies: ICommentReply[];
    reactions: ICommentReactionEntry[];
    createdAt: string;
}

/* ── Job Post ────────────────────────────────────────────── */
export interface IJobPost {
    _id: string;
    type: TJobPostType;
    status: TJobPostStatus;
    title: string;
    description: string;
    postedBy: IUserProfile;
    // official
    company?: string;
    jobTitle?: string;
    jobType?: TJobType;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    salaryNegotiable?: boolean;
    requirements?: string[];
    experienceLevel?: TExperienceLevel;
    applicationDeadline?: string;
    applicationInstruction?: string;
    location?: string;
    isRemote?: boolean;
    // tuition
    studentClass?: string;
    employerGender?: TGender;
    employeeGender?: TGender;
    subjects?: string[];
    timing?: string;
    sessionDuration?: string;
    weeklyDays?: string[];
    // shared seek
    seekLocation?: string;
    paymentAmount?: number;
    paymentPer?: TPaymentPer;
    paymentNegotiable?: boolean;
    startDate?: string;
    // personal seek
    serviceCategory?: TServiceCategory;
    // reactions
    likes: string[];
    dislikes: string[];
    likeUsers?: Pick<IUserProfile, "_id" | "name" | "imageUrl">[];
    dislikeUsers?: Pick<IUserProfile, "_id" | "name" | "imageUrl">[];
    comments: IComment[];
    // admin
    adminNotes: IAdminNote[];
    rejectedReason?: string;
    approvedAt?: string;
    createdAt: string;
    updatedAt: string;
}

/* ── Provider ────────────────────────────────────────────── */
export interface IProviderCertificate {
    url: string;
    publicId: string;
    name: string;
}

export interface IServiceProvider {
    _id: string;
    user: IUserProfile;
    providerType: TProviderType;
    bio: string;
    experience: string;
    qualifications?: string[];
    subjects?: string[];
    classRange?: string[];
    gender: "MALE" | "FEMALE";
    availableGenderStudents?: TGender;
    hourlyRate?: number;
    monthlyRate?: number;
    availability?: string[];
    location: string;
    isAvailable: boolean;
    status: TProviderStatus;
    adminNotes: IAdminNote[];
    certificates: IProviderCertificate[];
    createdAt: string;
}

/* ── Application ─────────────────────────────────────────── */
export interface IJobApplication {
    _id: string;
    job: IJobPost;
    applicant: IUserProfile;
    status: TApplicationStatus;
    message?: string;
    createdAt: string;
}

/* ── Contact request ─────────────────────────────────────── */
export interface IContactReply {
    _id: string;
    author: IUserProfile;
    body: string;
    createdAt: string;
    seenBy?: string[];
}

export interface IProviderContact {
    _id: string;
    provider: IServiceProvider;
    seeker: IUserProfile;
    message?: string;
    isRead: boolean;
    createdAt: string;
    replies: IContactReply[];
}

/* ── Response wrappers ───────────────────────────────────── */
export interface IJobDataMeta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export interface ISingleJobResponse { success: boolean; message: string; data: IJobPost }
export interface IJobListResponse { success: boolean; message: string; data: IJobPost[]; meta: IJobDataMeta }
export interface IProviderResponse { success: boolean; message: string; data: IServiceProvider }
export interface IProviderListResponse { success: boolean; message: string; data: IServiceProvider[]; meta: IJobDataMeta }
export interface IApplicationListResponse { success: boolean; message: string; data: IJobApplication[] }
export interface IApplicationResponse { success: boolean; message: string; data: IJobApplication }
export interface IContactListResponse { success: boolean; message: string; data: IProviderContact[] }

/* ── Query params ────────────────────────────────────────── */
export interface IJobsQueryParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    type?: TJobPostType;
    status?: TJobPostStatus;
    providerType?: TProviderType;
}

/* ── Create payloads ─────────────────────────────────────── */
export type TCreateJobPostPayload = {
    type: TJobPostType;
    title: string;
    description: string;
    [key: string]: unknown;
};

export type TCreateProviderPayload = {
    providerType: TProviderType;
    bio: string;
    experience: string;
    gender: TGender;
    location: string;
    [key: string]: unknown;
};
