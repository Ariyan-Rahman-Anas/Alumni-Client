import { format, formatDistanceToNow } from "date-fns"
import Image from "next/image"
import { RiAttachmentLine, RiCalendarLine, RiDownloadLine, RiExternalLinkLine, RiEyeLine, RiLinkM, RiPushpin2Line, RiTimeLine } from "react-icons/ri"
import { IAnnouncement } from "./announcement.types"
import { formatBytes, LocalFileIcon, PRIORITY_CONFIG, TYPE_CONFIG } from "@/components/pages/user/Announcements/AnnouncementDetailPage"
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"

const AnnouncementDetailsPageArticle = ({ announcement }: { announcement: IAnnouncement }) => {
    const priority = announcement ? PRIORITY_CONFIG[announcement.priority] : null;
    const typeConfig = announcement ? (TYPE_CONFIG[announcement.type] ?? TYPE_CONFIG.general) : null;
    return (
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
                // <motion.div
                <FadeUpWrapper
                    // initial={{ opacity: 0, scale: 0.98 }}
                    // animate={{ opacity: 1, scale: 1 }}
                    // transition={{ duration: 0.5, delay: 0.15 }}
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
                </FadeUpWrapper>
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
                                <LocalFileIcon fileType={att.fileType} />
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
    )
}

export default AnnouncementDetailsPageArticle