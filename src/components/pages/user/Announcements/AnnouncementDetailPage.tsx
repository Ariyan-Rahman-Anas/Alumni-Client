"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import {
    RiArrowLeftLine,
    RiCalendarLine,
    RiEyeLine,
    RiLinkM,
    RiPushpin2Line,
    RiTimeLine,
    RiAttachmentLine,
    RiDownloadLine,
    RiFileTextLine,
    RiFilePdfLine,
    RiFileImageLine,
    RiFileZipLine,
    RiFileUnknowLine,
    RiExternalLinkLine,
    RiHashtag,
    RiAlertLine,
    RiInformationLine,
    RiCheckboxCircleLine,
    RiMegaphoneLine,
    RiCalendarEventLine,
    RiNewspaperLine,
    RiRefreshLine,
} from "react-icons/ri";
import { useGetAnnouncementBySlugQuery } from "@/redux/apis/announcementApi";

/* --- Priority config --- */
const PRIORITY_CONFIG = {
    urgent: {
        bar: "bg-red-500",
        badge: "bg-red-50 text-red-700 ring-1 ring-red-200",
        accent: "text-red-600",
        icon: <RiAlertLine />,
        label: "Urgent",
    },
    high: {
        bar: "bg-amber-500",
        badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        accent: "text-amber-600",
        icon: <RiAlertLine />,
        label: "High Priority",
    },
    normal: {
        bar: "bg-primary2-400",
        badge: "bg-primary2-50 text-primary2-700 ring-1 ring-primary2-200",
        accent: "text-primary2-600",
        icon: <RiInformationLine />,
        label: "Normal",
    },
};

/* --- Type config --- */
const TYPE_CONFIG: Record<string, { badge: string; icon: React.ReactNode; label: string }> = {
    general: {
        badge: "bg-primary2-50 text-primary2-700 ring-1 ring-primary2-200",
        icon: <RiMegaphoneLine />,
        label: "General",
    },
    notice: {
        badge: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
        icon: <RiInformationLine />,
        label: "Notice",
    },
    event: {
        badge: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
        icon: <RiCalendarEventLine />,
        label: "Event",
    },
    news: {
        badge: "bg-teal-50 text-teal-700 ring-1 ring-teal-200",
        icon: <RiNewspaperLine />,
        label: "News",
    },
    update: {
        badge: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
        icon: <RiRefreshLine />,
        label: "Update",
    },
    alert: {
        badge: "bg-red-50 text-red-700 ring-1 ring-red-200",
        icon: <RiAlertLine />,
        label: "Alert",
    },
};

/* --- File icon helper --- */
function FileIcon({ fileType }: { fileType: string }) {
    const type = fileType.toLowerCase();
    if (type.includes("pdf")) return <RiFilePdfLine className="text-red-500 text-lg shrink-0" />;
    if (type.includes("image") || type.match(/png|jpg|jpeg|gif|webp/))
        return <RiFileImageLine className="text-violet-500 text-lg shrink-0" />;
    if (type.includes("zip") || type.includes("rar"))
        return <RiFileZipLine className="text-amber-500 text-lg shrink-0" />;
    if (type.includes("text") || type.match(/doc|docx|txt/))
        return <RiFileTextLine className="text-blue-500 text-lg shrink-0" />;
    return <RiFileUnknowLine className="text-gray-400 text-lg shrink-0" />;
}

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* --- Skeleton --- */
function DetailSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="h-4 w-32 rounded-full bg-surface-200" />
            <div className="space-y-3">
                <div className="flex gap-2">
                    <div className="h-6 w-20 rounded-full bg-surface-200" />
                    <div className="h-6 w-16 rounded-full bg-surface-200" />
                </div>
                <div className="h-10 w-3/4 rounded-lg bg-surface-200" />
                <div className="h-5 w-1/2 rounded-lg bg-surface-200" />
                <div className="flex gap-4 mt-2">
                    <div className="h-4 w-28 rounded bg-surface-200" />
                    <div className="h-4 w-20 rounded bg-surface-200" />
                </div>
            </div>
            <div className="h-72 w-full rounded-2xl bg-surface-200" />
            <div className="space-y-2">
                <div className="h-4 w-full rounded bg-surface-200" />
                <div className="h-4 w-5/6 rounded bg-surface-200" />
                <div className="h-4 w-4/5 rounded bg-surface-200" />
            </div>
        </div>
    );
}

interface AnnouncementDetailPageProps {
    slug: string;
}

const AnnouncementDetailPage = ({ slug }: AnnouncementDetailPageProps) => {
    const router = useRouter();
    const { data, isLoading, isError } = useGetAnnouncementBySlugQuery(slug);
    const announcement = data?.data;

    const priority = announcement ? PRIORITY_CONFIG[announcement.priority] : null;
    const typeConfig = announcement ? (TYPE_CONFIG[announcement.type] ?? TYPE_CONFIG.general) : null;

    return (
        <div className="three-xl-section-setup pb-24">
            {/* Back button */}
            <motion.button
                type="button"
                onClick={() => router.back()}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35 }}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary2-600 hover:text-primary2-900 transition-colors mb-10 group"
            >
                <span className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-primary2-200 bg-primary2-50 group-hover:bg-primary2-100 transition-colors">
                    <RiArrowLeftLine className="text-sm" />
                </span>
                Back to Announcements
            </motion.button>

            {isLoading ? (
                <DetailSkeleton />
            ) : isError || !announcement ? (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="h-16 w-16 rounded-full bg-surface-100 flex items-center justify-center mb-4">
                        <RiMegaphoneLine className="text-2xl text-muted-foreground" />
                    </div>
                    <h2 className="text-lg font-semibold text-primary2-900 mb-1">
                        Announcement not found
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        This announcement may have been removed or the link is invalid.
                    </p>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary2-700 hover:bg-primary2-800 text-white px-5 py-2.5 text-sm font-medium transition-colors"
                    >
                        <RiArrowLeftLine /> Go Back
                    </button>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 items-start"
                >
                    {/* LEFT — Main content */}
                    <article>
                        {/* Priority accent bar */}
                        <div className={`h-1 w-24 rounded-full mb-5 ${priority?.bar}`} />

                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-5">
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold capitalize ${typeConfig?.badge}`}
                            >
                                <span className="text-sm">{typeConfig?.icon}</span>
                                {typeConfig?.label}
                            </span>
                            <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${priority?.badge}`}
                            >
                                <span className="text-sm">{priority?.icon}</span>
                                {priority?.label}
                            </span>
                            {announcement.isPinned && (
                                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-primary2-50 text-primary2-700 ring-1 ring-primary2-200">
                                    <RiPushpin2Line className="text-sm" /> Pinned
                                </span>
                            )}
                            {announcement.isFeatured && (
                                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold bg-amber-50 text-amber-700 ring-1 ring-amber-200">
                                    &#9733; Featured
                                </span>
                            )}
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl font-extrabold text-primary2-950 leading-[1.2] tracking-tight">
                            {announcement.title}
                        </h1>

                        {/* Meta row */}
                        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground border-b border-surface-200 pb-5">
                            {announcement.publishedAt && (
                                <span className="flex items-center gap-1.5">
                                    <RiCalendarLine className="text-base shrink-0" />
                                    {format(new Date(announcement.publishedAt), "dd MMMM yyyy")}
                                    <span className="text-xs text-surface-400">
                                        ({formatDistanceToNow(new Date(announcement.publishedAt), { addSuffix: true })})
                                    </span>
                                </span>
                            )}
                            <span className="flex items-center gap-1.5">
                                <RiEyeLine className="text-base shrink-0" />
                                {announcement.viewCount.toLocaleString()} views
                            </span>
                            {announcement.expiresAt && (
                                <span className="flex items-center gap-1.5 text-amber-600">
                                    <RiTimeLine className="text-base shrink-0" />
                                    Expires {format(new Date(announcement.expiresAt), "dd MMM yyyy")}
                                </span>
                            )}
                        </div>

                        {/* Cover image */}
                        {announcement.coverImage && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.15 }}
                                className="mt-7 rounded-2xl overflow-hidden border border-surface-200 shadow-sm"
                            >
                                <Image
                                    src={announcement.coverImage}
                                    alt={announcement.title}
                                    width={900}
                                    height={450}
                                    className="w-full h-auto object-cover"
                                    priority
                                />
                            </motion.div>
                        )}

                        {/* Description */}
                        <p className="mt-7 text-base text-primary2-800/80 leading-relaxed font-medium border-l-4 border-primary2-200 pl-4 bg-primary2-50/50 py-3 pr-3 rounded-r-xl">
                            {announcement.description}
                        </p>

                        {/* Rich-text body */}
                        {announcement.body && (
                            <div
                                className="mt-8 prose prose-base max-w-none prose-headings:font-bold prose-headings:text-primary2-900 prose-p:text-primary2-800/80 prose-p:leading-relaxed prose-a:text-primary2-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline prose-blockquote:border-primary2-300 prose-strong:text-primary2-900 prose-code:bg-surface-100 prose-code:rounded prose-code:px-1 prose-hr:border-surface-200 prose-li:text-primary2-800/80 prose-img:rounded-xl prose-img:shadow-sm"
                                dangerouslySetInnerHTML={{ __html: announcement.body }}
                            />
                        )}

                        {/* CTA */}
                        {announcement.ctaLink && (
                            <div className="mt-9 p-5 rounded-2xl bg-primary2-50 border border-primary2-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold text-primary2-600 uppercase tracking-wide mb-0.5">
                                        Call to Action
                                    </p>
                                    <p className="text-sm text-primary2-800">
                                        {announcement.ctaLabel
                                            ? `Click the button to ${announcement.ctaLabel.toLowerCase()}`
                                            : "Follow the link to learn more about this announcement."}
                                    </p>
                                </div>
                                <a
                                    href={announcement.ctaLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 shrink-0 rounded-xl bg-primary2-700 hover:bg-primary2-800 active:bg-primary2-900 text-white px-5 py-2.5 text-sm font-semibold transition-colors shadow-sm"
                                >
                                    <RiLinkM />
                                    {announcement.ctaLabel || "Learn More"}
                                    <RiExternalLinkLine className="opacity-70" />
                                </a>
                            </div>
                        )}

                        {/* Attachments */}
                        {announcement.attachments.length > 0 && (
                            <div className="mt-9 border-t border-surface-200 pt-7">
                                <h3 className="text-sm font-bold text-primary2-900 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                    <RiAttachmentLine className="text-base" />
                                    Attachments
                                    <span className="ml-1 inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-primary2-100 text-primary2-700 text-xs font-bold">
                                        {announcement.attachments.length}
                                    </span>
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {announcement.attachments.map((att) => (
                                        <a
                                            key={att.publicId}
                                            href={att.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-center gap-3 rounded-xl border border-surface-200 bg-white px-4 py-3.5 hover:border-primary2-300 hover:bg-primary2-50 hover:shadow-sm transition-all"
                                        >
                                            <FileIcon fileType={att.fileType} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-primary2-900 truncate group-hover:text-primary2-700">
                                                    {att.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {formatBytes(att.size)}
                                                </p>
                                            </div>
                                            <RiDownloadLine className="text-primary2-400 group-hover:text-primary2-600 text-base shrink-0 transition-colors" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </article>

                    {/* RIGHT — Sticky sidebar */}
                    <aside className="lg:sticky lg:top-6 space-y-5">
                        {/* Author card */}
                        {announcement.createdBy && (
                            <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                                    Posted By
                                </p>
                                <div className="flex items-center gap-3">
                                    {announcement.createdBy.imageUrl ? (
                                        <div className="h-12 w-12 rounded-full overflow-hidden border border-primary2-900">
                                            <Image
                                                src={announcement.createdBy.imageUrl}
                                                alt={announcement.createdBy.name}
                                                width={500}
                                                height={500}
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary2-400 to-primary2-600 flex items-center justify-center text-white font-bold text-base shrink-0 shadow-sm">
                                            {announcement.createdBy.name[0]?.toUpperCase()}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-primary2-900 truncate">
                                            {announcement.createdBy.name}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Details card */}
                        <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm space-y-4">
                            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                                Details
                            </p>
                            <dl className="space-y-3 text-sm">
                                <div className="flex items-center justify-between gap-2">
                                    <dt className="text-muted-foreground flex items-center gap-1.5">
                                        <RiCheckboxCircleLine className="shrink-0" /> Type
                                    </dt>
                                    <dd className="font-semibold text-primary2-900 capitalize">
                                        {announcement.type}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between gap-2">
                                    <dt className="text-muted-foreground flex items-center gap-1.5">
                                        <RiAlertLine className="shrink-0" /> Priority
                                    </dt>
                                    <dd className={`font-semibold capitalize ${priority?.accent}`}>
                                        {announcement.priority}
                                    </dd>
                                </div>
                                {announcement.publishedAt && (
                                    <div className="flex items-center justify-between gap-2">
                                        <dt className="text-muted-foreground flex items-center gap-1.5">
                                            <RiCalendarLine className="shrink-0" /> Published
                                        </dt>
                                        <dd className="font-semibold text-primary2-900 text-right">
                                            {format(new Date(announcement.publishedAt), "dd MMM yyyy")}
                                        </dd>
                                    </div>
                                )}
                                {announcement.expiresAt && (
                                    <div className="flex items-center justify-between gap-2">
                                        <dt className="text-muted-foreground flex items-center gap-1.5">
                                            <RiTimeLine className="shrink-0" /> Expires
                                        </dt>
                                        <dd className="font-semibold text-amber-600 text-right">
                                            {format(new Date(announcement.expiresAt), "dd MMM yyyy")}
                                        </dd>
                                    </div>
                                )}
                                <div className="flex items-center justify-between gap-2">
                                    <dt className="text-muted-foreground flex items-center gap-1.5">
                                        <RiEyeLine className="shrink-0" /> Views
                                    </dt>
                                    <dd className="font-semibold text-primary2-900">
                                        {announcement.viewCount.toLocaleString()}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* Tags */}
                        {announcement.tags.length > 0 && (
                            <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-3">
                                    Tags
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {announcement.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="inline-flex items-center gap-1 rounded-full bg-surface-100 text-primary2-700 px-3 py-1 text-xs font-semibold capitalize hover:bg-primary2-50 transition-colors"
                                        >
                                            <RiHashtag className="text-xs opacity-60" />
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </motion.div>
            )}
        </div>
    );
};

export default AnnouncementDetailPage;
