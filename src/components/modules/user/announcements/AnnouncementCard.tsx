import { FadeUpWrapper } from '@/components/pages/user/Home/HomePage'
import { formatDistanceToNow } from "date-fns";
import { IAnnouncement } from './announcement.types';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { RiArrowRightLine, RiEyeLine, RiPushpin2Line, RiTimeLine } from 'react-icons/ri';
import { announcementPriorityStyle, announcementTypeStyle } from '@/components/pages/user/Announcements/AnnouncementsPage';

const AnnouncementCard = ({ item, idx }: { item: IAnnouncement; idx: number }) => {
    const router = useRouter();
    const p = announcementPriorityStyle[item.priority.toLowerCase() as keyof typeof announcementPriorityStyle] ?? announcementPriorityStyle.normal;
    const t = announcementTypeStyle[item.type.toLowerCase() as keyof typeof announcementTypeStyle] ?? announcementTypeStyle.general;

    return (
        <FadeUpWrapper
            delay={0.1 + idx * 0.05}
            onClick={() => router.push(`/announcements/${item.slug}`)}
            className="group cursor-pointer flex flex-col bg-white rounded-2xl border border-surface-200 hover:border-primary2-300 hover:shadow-md transition-all overflow-hidden"
        >
            {/* Cover image */}
            {item.coverImage && (
                <div className="relative h-44 overflow-hidden bg-surface-100 shrink-0">
                    <Image
                        src={item.coverImage}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                </div>
            )}

            {/* Priority top bar */}
            <div className={`h-1 w-full shrink-0 ${p.bar}`} />

            {/* Body */}
            <div className="flex flex-col flex-1 p-5 gap-3">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${t.soft}`}>
                        <span className="text-xs">{t.icon}</span>{t.label}
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${p.soft}`}>
                        <span className="text-xs">{p.icon}</span>{p.label}
                    </span>
                    {item.isPinned && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-surface-100 text-primary2-600 px-2.5 py-0.5 text-[11px] font-semibold">
                            <RiPushpin2Line className="text-xs" /> Pinned
                        </span>
                    )}
                </div>

                {/* Title */}
                <h3 className="text-sm font-bold text-primary2-900 leading-snug line-clamp-2 group-hover:text-primary2-700 transition-colors">
                    {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
                    {item.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-surface-100">
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
                        {item.publishedAt && (
                            <span className="flex items-center gap-1">
                                <RiTimeLine className="shrink-0" />
                                {formatDistanceToNow(new Date(item.publishedAt), { addSuffix: true })}
                            </span>
                        )}
                        <span className="flex items-center gap-1">
                            <RiEyeLine className="shrink-0" /> {item.viewCount.toLocaleString()}
                        </span>
                    </div>
                    <span className="text-[11px] font-semibold text-primary2-600 flex items-center gap-0.5 group-hover:gap-1.5 transition-all">
                        Read <RiArrowRightLine />
                    </span>
                </div>
            </div>
        </FadeUpWrapper>
    )
}
export default AnnouncementCard