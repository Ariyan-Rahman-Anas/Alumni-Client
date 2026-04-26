"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { format } from "date-fns";
import {
    RiArrowLeftLine,
    RiCalendarLine,
    RiEyeLine,
    RiLinkM,
    RiPushpin2Line,
    RiTimeLine,
    RiAttachmentLine,
    RiDownloadLine,
} from "react-icons/ri";
import { Badge } from "@/components/ui/badge";
import { useGetAnnouncementBySlugQuery } from "@/redux/apis/announcementApi";

const PRIORITY_BADGE = {
    urgent: "bg-red-50 text-red-700 border-red-200",
    high: "bg-amber-50 text-amber-700 border-amber-200",
    normal: "bg-surface-100 text-gray-600 border-surface-200",
};

const TYPE_BADGE: Record<string, string> = {
    general: "bg-primary2-50 text-primary2-700 border-primary2-200",
    notice: "bg-sky-50 text-sky-700 border-sky-200",
    event: "bg-violet-50 text-violet-700 border-violet-200",
    news: "bg-teal-50 text-teal-700 border-teal-200",
    update: "bg-indigo-50 text-indigo-700 border-indigo-200",
    alert: "bg-red-50 text-red-700 border-red-200",
};

interface AnnouncementDetailPageProps {
    slug: string;
}

const AnnouncementDetailPage = ({ slug }: AnnouncementDetailPageProps) => {
    const router = useRouter();
    const { data, isLoading, isError } = useGetAnnouncementBySlugQuery(slug);
    const announcement = data?.data;

    return (
        <div className="three-xl-section-setup pb-20">
            {/* Back */}
            <button
                type="button"
                onClick={() => router.back()}
                className="inline-flex items-center gap-1.5 text-sm text-primary2-600 hover:text-primary2-900 transition-colors mb-8"
            >
                <RiArrowLeftLine /> Back to Announcements
            </button>

            {isLoading ? (
                <div className="space-y-4 max-w-3xl">
                    <div className="h-8 w-2/3 rounded bg-gray-100 animate-pulse" />
                    <div className="h-4 w-full rounded bg-gray-100 animate-pulse" />
                    <div className="h-4 w-5/6 rounded bg-gray-100 animate-pulse" />
                    <div className="h-64 rounded-2xl bg-gray-100 animate-pulse mt-8" />
                </div>
            ) : isError || !announcement ? (
                <div className="py-20 text-center">
                    <p className="text-muted-foreground text-sm">Announcement not found.</p>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-3xl"
                >
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge
                            variant="outline"
                            className={`capitalize text-xs ${TYPE_BADGE[announcement.type] ?? ""}`}
                        >
                            {announcement.type}
                        </Badge>
                        <Badge
                            variant="outline"
                            className={`capitalize text-xs ${PRIORITY_BADGE[announcement.priority]}`}
                        >
                            {announcement.priority}
                        </Badge>
                        {announcement.isPinned && (
                            <Badge
                                variant="outline"
                                className="text-xs bg-primary2-50 text-primary2-700 border-primary2-200"
                            >
                                <RiPushpin2Line className="mr-1" /> Pinned
                            </Badge>
                        )}
                        {announcement.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs capitalize">
                                {tag}
                            </Badge>
                        ))}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-bold text-primary2-900 leading-tight">
                        {announcement.title}
                    </h1>

                    {/* Meta row */}
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        {announcement.publishedAt && (
                            <span className="flex items-center gap-1">
                                <RiCalendarLine />
                                {format(new Date(announcement.publishedAt), "dd MMMM yyyy")}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <RiEyeLine /> {announcement.viewCount} views
                        </span>
                        {announcement.expiresAt && (
                            <span className="flex items-center gap-1">
                                <RiTimeLine /> Expires{" "}
                                {format(new Date(announcement.expiresAt), "dd MMM yyyy")}
                            </span>
                        )}
                    </div>

                    {/* Cover image */}
                    {announcement.coverImage && (
                        <div className="mt-8 rounded-2xl overflow-hidden border border-surface-300/60">
                            <Image
                                src={announcement.coverImage}
                                alt={announcement.title}
                                width={900}
                                height={450}
                                className="w-full h-auto object-cover"
                            />
                        </div>
                    )}

                    {/* Description */}
                    <p className="mt-8 text-base text-muted-foreground leading-relaxed">
                        {announcement.description}
                    </p>

                    {/* Rich text body */}
                    {announcement.body && (
                        <div
                            className="mt-8 prose prose-sm max-w-none prose-headings:text-primary2-900 prose-a:text-primary2-600 prose-blockquote:border-primary2-300 border-t border-surface-200 pt-6"
                            dangerouslySetInnerHTML={{ __html: announcement.body }}
                        />
                    )}

                    {/* CTA */}
                    {announcement.ctaLink && (
                        <div className="mt-8">
                            <a
                                href={announcement.ctaLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-primary2-700 hover:bg-primary2-800 text-white px-5 py-2.5 text-sm font-medium transition-colors"
                            >
                                <RiLinkM />
                                {announcement.ctaLabel || "Learn More"}
                            </a>
                        </div>
                    )}

                    {/* Attachments */}
                    {announcement.attachments.length > 0 && (
                        <div className="mt-10 border-t border-surface-200 pt-6">
                            <h3 className="text-sm font-semibold text-primary2-900 mb-3 flex items-center gap-2">
                                <RiAttachmentLine /> Attachments ({announcement.attachments.length})
                            </h3>
                            <div className="space-y-2">
                                {announcement.attachments.map((att) => (
                                    <a
                                        key={att.publicId}
                                        href={att.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 rounded-xl border border-surface-200 bg-surface-50 px-4 py-3 text-sm hover:border-primary2-300 hover:bg-primary2-50 transition-colors"
                                    >
                                        <RiDownloadLine className="text-primary2-600 shrink-0" />
                                        <span className="flex-1 truncate font-medium text-primary2-800">
                                            {att.name}
                                        </span>
                                        <span className="text-xs text-muted-foreground shrink-0">
                                            {(att.size / 1024).toFixed(0)} KB
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Author */}
                    {announcement.createdBy && (
                        <div className="mt-10 border-t border-surface-200 pt-6 flex items-center gap-3">
                            {announcement.createdBy.imageUrl ? (
                                <Image
                                    src={announcement.createdBy.imageUrl}
                                    alt={announcement.createdBy.name}
                                    width={36}
                                    height={36}
                                    className="rounded-full object-cover border border-surface-200"
                                />
                            ) : (
                                <div className="h-9 w-9 rounded-full bg-primary2-100 flex items-center justify-center text-primary2-700 font-semibold text-sm">
                                    {announcement.createdBy.name[0]}
                                </div>
                            )}
                            <div>
                                <p className="text-sm font-medium text-primary2-900">
                                    {announcement.createdBy.name}
                                </p>
                                <p className="text-xs text-muted-foreground">Posted by</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default AnnouncementDetailPage;
