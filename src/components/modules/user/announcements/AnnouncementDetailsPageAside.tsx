import Image from "next/image"
import { RiAlertLine, RiCalendarLine, RiCheckboxCircleLine, RiEyeLine, RiHashtag, RiTimeLine } from "react-icons/ri"
import { IAnnouncement } from "./announcement.types"
import { PRIORITY_CONFIG } from "@/components/pages/user/Announcements/AnnouncementDetailPage";
import { format} from "date-fns";

const AnnouncementDetailsPageAside = ({ announcement }: { announcement: IAnnouncement }) => {

const priority = announcement ? PRIORITY_CONFIG[announcement.priority.toLowerCase() as keyof typeof PRIORITY_CONFIG] : null;

  return (
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
  )
}
export default AnnouncementDetailsPageAside