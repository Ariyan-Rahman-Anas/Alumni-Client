import { TAnnouncementPriority, TAnnouncementStatus, TAnnouncementType } from "@/constants";
import { IUserProfile } from "../profile/user-profile.types";

export interface IAnnouncementAttachment {
  url: string;
  publicId: string;
  name: string;
  fileType: string;
  size: number;
}

export interface IAnnouncement {
  _id: string;
  title: string;
  slug: string;
  description: string;
  body?: string;
  coverImage?: string;
  coverImagePublicId?: string;
  status: TAnnouncementStatus;
  priority: TAnnouncementPriority;
  type: TAnnouncementType;
  createdBy: IUserProfile;
  updatedBy?: IUserProfile;
  publishedAt?: string;
  scheduledAt?: string;
  expiresAt?: string;
  isPinned: boolean;
  isFeatured: boolean;
  tags: string[];
  attachments: IAnnouncementAttachment[];
  ctaLink?: string;
  ctaLabel?: string;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IAnnouncementResponse {
  success: boolean;
  message: string;
  data: IAnnouncement;
}

export interface IAnnouncementListResponse {
  success: boolean;
  message: string;
  data: IAnnouncement[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface ICreateAnnouncementPayload {
  title: string;
  description: string;
  body?: string;
  status?: TAnnouncementStatus;
  priority?: TAnnouncementPriority;
  type?: TAnnouncementType;
  scheduledAt?: string;
  expiresAt?: string;
  isPinned?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  ctaLink?: string;
  ctaLabel?: string;
}

export interface IGetAnnouncementsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: TAnnouncementStatus;
  priority?: TAnnouncementPriority;
  type?: TAnnouncementType;
  isPinned?: boolean;
}

/* ── Props  */
export interface IAdminAnnouncementFormModalProps {
    open: boolean;
    onClose: () => void;
    announcement?: IAnnouncement | null;
}