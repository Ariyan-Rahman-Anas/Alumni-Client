import type { IUserProfile as UserProfile } from "@/components/modules/user/user.types";

export interface BatchRoomInfo {
    _id: string;
    batchYear: number;
    name?: string;
    coordinator?: UserProfile | null;
    createdAt: string;
}

export interface BatchMessage {
    _id: string;
    batchYear: number;
    author: UserProfile;
    type: "text" | "call_started" | "call_joined";
    body?: string;
    imageUrl?: string;
    imagePublicId?: string;
    callMeta?: { hasVideo: boolean; endedAt?: string };
    isDeleted: boolean;
    seenBy: string[];
    createdAt: string;
    updatedAt: string;
}

export interface PollOption {
    _id: string;
    text: string;
    voters: string[];
}

export interface BatchPoll {
    _id: string;
    batchYear: number;
    createdBy: UserProfile;
    question: string;
    options: PollOption[];
    isCoordinatorElection: boolean;
    isCoordinatorRemoval: boolean;
    applicationId?: string;
    deadline?: string;
    isOpen: boolean;
    createdAt: string;
}

export type CoordinatorApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface BatchCoordinatorApplication {
    _id: string;
    batchYear: number;
    applicant: UserProfile;
    status: CoordinatorApplicationStatus;
    rejectionNote?: string;
    poll?: BatchPoll;
    createdAt: string;
}

/* ── Response wrappers ─────────────────────────────────── */
export interface BatchRoomResponse { success: boolean; message: string; data: BatchRoomInfo }
export interface BatchMessagesResponse { success: boolean; message: string; data: BatchMessage[] }
export interface BatchMessageResponse { success: boolean; message: string; data: BatchMessage }
export interface BatchPollsResponse { success: boolean; message: string; data: BatchPoll[] }
export interface BatchPollResponse { success: boolean; message: string; data: BatchPoll }
export interface CoordinatorApplicationsResponse { success: boolean; message: string; data: BatchCoordinatorApplication[] }
export interface CoordinatorApplicationResponse { success: boolean; message: string; data: BatchCoordinatorApplication }
export interface UnseenCountResponse { success: boolean; message: string; data: { count: number } }
