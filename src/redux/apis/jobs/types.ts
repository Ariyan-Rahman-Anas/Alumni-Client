import type { UserProfile } from "../userApi";

/* ── Enums / shared types ──────────────────────────────── */
export type JobPostStatus = "PENDING" | "APPROVED" | "REJECTED" | "CLOSED";
export type JobPostType = "OFFICIAL" | "TUITION" | "PERSONAL";
export type JobType = "FULL_TIME" | "PART_TIME" | "REMOTE" | "CONTRACT" | "INTERN";
export type ExperienceLevel = "ENTRY" | "MID" | "SENIOR" | "EXECUTIVE";
export type Gender = "MALE" | "FEMALE" | "ANY";
export type PaymentPer = "HOUR" | "MONTH" | "SESSION";
export type ServiceCategory =
    | "ELECTRICIAN" | "PLUMBER" | "COOK" | "DRIVER" | "CLEANER"
    | "CARPENTER" | "PAINTER" | "GARDENER" | "SECURITY";
export type ApplicationStatus = "PENDING" | "SELECTED" | "REJECTED";
export type ProviderType =
    | "TUTOR" | "ELECTRICIAN" | "PLUMBER" | "COOK" | "DRIVER" | "CLEANER"
    | "CARPENTER" | "PAINTER" | "GARDENER" | "SECURITY";
export type ProviderStatus = "PENDING" | "APPROVED" | "REJECTED";
export type CommentReactionType = "LIKE" | "DISLIKE" | "HAHA" | "ANGRY" | "SAD" | "LOVE";

/* ── Admin note ──────────────────────────────────────────── */
export interface AdminNote {
    note: string;
    addedBy: { _id: string; name: string; email: string; imageUrl?: string };
    addedAt: string;
}

/* ── Comments ────────────────────────────────────────────── */
export interface CommentReactionEntry {
    userId: string;
    type: CommentReactionType;
}

export interface CommentReply {
    _id: string;
    author: UserProfile;
    body: string;
    reactions: CommentReactionEntry[];
    createdAt: string;
}

export interface Comment {
    _id: string;
    author: UserProfile;
    body: string;
    replies: CommentReply[];
    reactions: CommentReactionEntry[];
    createdAt: string;
}

/* ── Job Post ────────────────────────────────────────────── */
export interface JobPost {
    _id: string;
    type: JobPostType;
    status: JobPostStatus;
    title: string;
    description: string;
    postedBy: UserProfile;
    // official
    company?: string;
    jobTitle?: string;
    jobType?: JobType;
    salaryMin?: number;
    salaryMax?: number;
    salaryCurrency?: string;
    salaryNegotiable?: boolean;
    requirements?: string[];
    experienceLevel?: ExperienceLevel;
    applicationDeadline?: string;
    applicationInstruction?: string;
    location?: string;
    isRemote?: boolean;
    // tuition
    studentClass?: string;
    employerGender?: Gender;
    employeeGender?: Gender;
    subjects?: string[];
    timing?: string;
    sessionDuration?: string;
    weeklyDays?: string[];
    // shared seek
    seekLocation?: string;
    paymentAmount?: number;
    paymentPer?: PaymentPer;
    paymentNegotiable?: boolean;
    startDate?: string;
    // personal seek
    serviceCategory?: ServiceCategory;
    // reactions
    likes: string[];
    dislikes: string[];
    likeUsers?: Pick<UserProfile, "_id" | "name" | "imageUrl">[];
    dislikeUsers?: Pick<UserProfile, "_id" | "name" | "imageUrl">[];
    comments: Comment[];
    // admin
    adminNotes: AdminNote[];
    rejectedReason?: string;
    approvedAt?: string;
    createdAt: string;
    updatedAt: string;
}

/* ── Provider ────────────────────────────────────────────── */
export interface ProviderCertificate {
    url: string;
    publicId: string;
    name: string;
}

export interface ServiceProvider {
    _id: string;
    user: UserProfile;
    providerType: ProviderType;
    bio: string;
    experience: string;
    qualifications?: string[];
    subjects?: string[];
    classRange?: string[];
    gender: "MALE" | "FEMALE";
    availableGenderStudents?: Gender;
    hourlyRate?: number;
    monthlyRate?: number;
    availability?: string[];
    location: string;
    isAvailable: boolean;
    status: ProviderStatus;
    adminNotes: AdminNote[];
    certificates: ProviderCertificate[];
    createdAt: string;
}

/* ── Application ─────────────────────────────────────────── */
export interface JobApplication {
    _id: string;
    job: JobPost;
    applicant: UserProfile;
    status: ApplicationStatus;
    message?: string;
    createdAt: string;
}

/* ── Contact request ─────────────────────────────────────── */
export interface ContactReply {
    _id: string;
    author: UserProfile;
    body: string;
    createdAt: string;
}

export interface ProviderContact {
    _id: string;
    provider: ServiceProvider;
    seeker: UserProfile;
    message?: string;
    isRead: boolean;
    createdAt: string;
    replies: ContactReply[];
}

/* ── Response wrappers ───────────────────────────────────── */
export interface Meta {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
}

export interface SingleJobResponse { success: boolean; message: string; data: JobPost }
export interface JobListResponse { success: boolean; message: string; data: JobPost[]; meta: Meta }
export interface ProviderResponse { success: boolean; message: string; data: ServiceProvider }
export interface ProviderListResponse { success: boolean; message: string; data: ServiceProvider[]; meta: Meta }
export interface ApplicationListResponse { success: boolean; message: string; data: JobApplication[] }
export interface ApplicationResponse { success: boolean; message: string; data: JobApplication }
export interface ContactListResponse { success: boolean; message: string; data: ProviderContact[] }

/* ── Query params ────────────────────────────────────────── */
export interface JobsQueryParams {
    page?: number;
    limit?: number;
    searchTerm?: string;
    type?: JobPostType;
    status?: JobPostStatus;
    providerType?: ProviderType;
}

/* ── Create payloads ─────────────────────────────────────── */
export type CreateJobPostPayload = {
    type: JobPostType;
    title: string;
    description: string;
    [key: string]: unknown;
};

export type CreateProviderPayload = {
    providerType: ProviderType;
    bio: string;
    experience: string;
    gender: "MALE" | "FEMALE";
    location: string;
    [key: string]: unknown;
};
