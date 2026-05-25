export type TRequestCategory = "general" | "correction" | "complaint" | "suggestion" | "other";
export type TRequestStatus = "PENDING" | "IN_REVIEW" | "RESOLVED" | "REJECTED";

export interface IRequestUser {
  _id: string;
  name: string;
  email: string;
  imageUrl?: string;
  userId: string;
  phone?: string;
}

export interface IRequest {
  _id: string;
  user: IRequestUser;
  category: TRequestCategory;
  subject: string;
  description: string;
  status: TRequestStatus;
  adminMessage?: string;
  resolvedAt?: string;
  resolvedBy?: { _id: string; name: string; email: string } | string;
  createdAt: string;
  updatedAt: string;
}

export interface IRequestListResponse {
  success: boolean;
  message: string;
  meta?: { page: number; limit: number; total: number; totalPage: number };
  data: IRequest[];
}

export interface IRequestSingleResponse {
  success: boolean;
  message: string;
  data: IRequest;
}

export interface ICreateRequestPayload {
  category: TRequestCategory;
  subject: string;
  description: string;
}

export interface IUpdateRequestPayload {
  status?: TRequestStatus;
  adminMessage?: string;
}
