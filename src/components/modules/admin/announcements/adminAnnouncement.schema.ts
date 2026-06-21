import { constantsData } from "@/constants";
import {object, string, z, boolean, enum as zEnum } from "zod"

export const adminAnnouncementFormSchema = object({
    title: string().trim().min(3, "Title must be at least 3 characters").max(200),
    description: string().trim().min(10, "Description must be at least 10 characters").max(500),
    body: string().optional(),
    status: zEnum(Object.values(constantsData.announcement.status)).optional(),
    priority: zEnum(Object.values(constantsData.announcement.priority)).optional(),
    type: zEnum(Object.values(constantsData.announcement.type)).optional(),
    scheduledAt: string().optional(),
    expiresAt: string().optional(),
    isPinned: boolean().optional(),
    isFeatured: boolean().optional(),
    tags: string().optional(), // comma-separated string → parsed to array on submit
    ctaLink: string().optional(),
    ctaLabel: string().max(50).optional(),
    coverImage: z.instanceof(File).nullable().optional(),
});
export type TAdminAnnouncementFormValues = z.infer<typeof adminAnnouncementFormSchema>;

export const ANNOUNCEMENT_CREATE_FIELD_ORDER: (keyof TAdminAnnouncementFormValues)[] = ["title", "description", "body"];