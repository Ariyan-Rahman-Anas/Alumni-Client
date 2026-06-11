export interface ICommitteeMemberUser {
    _id: string;
    name: string;
    email: string;
    imageUrl?: string;
    batch: number;
    section: string;
}

export interface ICommitteeMember {
    member: ICommitteeMemberUser | string;
    designation: string;
}

export interface ICommittee {
    _id: string;
    name: string;
    description?: string;
    functionalFrom: string;
    functionalTo?: string;
    isActive: boolean;
    members: ICommitteeMember[];
    createdBy?: { _id: string; name: string; email: string } | string;
    createdAt: string;
    updatedAt: string;
}

export interface ICommitteeListResponse {
    success: boolean;
    message: string;
    data: ICommittee[];
}

export interface ICommitteeResponse {
    success: boolean;
    message: string;
    data: ICommittee;
}

export interface ICreateCommitteeMemberPayload {
    member: string; // User _id
    designation: string;
}

export interface ICreateCommitteePayload {
    name: string;
    description?: string;
    functionalFrom: string;
    functionalTo?: string;
    isActive?: boolean;
    members: ICreateCommitteeMemberPayload[];
}
