import { useRouter } from "next/navigation";
import { IAnnouncement } from "./announcement.types";
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import { RiArrowRightLine, RiCalendarLine, RiEyeLine, RiMegaphoneLine, RiPushpin2Line, RiSparkling2Line } from "react-icons/ri";
import { format } from "date-fns";
import { announcementTypeStyle } from "@/components/pages/user/Announcements/AnnouncementsPage";
import Image from "next/image";

const FeaturedAnnouncementCard = ({ item }: { item: IAnnouncement }) => {
    const router = useRouter();
    const t = announcementTypeStyle[item.type.toLowerCase() as keyof typeof announcementTypeStyle] ?? announcementTypeStyle.general;

    return (
        <FadeUpWrapper
            onClick={() => router.push(`/announcements/${item.slug}`)}
            className="group cursor-pointer relative rounded-3xl border border-primary2-200/70 bg-gradient-to-br from-primary2-50 to-white overflow-hidden shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px]">
                {/* Content side */}
                <div className="p-7 sm:p-10 flex flex-col justify-between gap-6">
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary2-100 text-primary2-700 px-3 py-1 text-xs font-bold">
                                <RiSparkling2Line /> Featured
                            </span>
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${t.soft}`}>
                                <span className="text-sm">{t.icon}</span>{t.label}
                            </span>
                            {item.isPinned && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-surface-100 text-primary2-700 px-3 py-1 text-xs font-semibold">
                                    <RiPushpin2Line /> Pinned
                                </span>
                            )}
                        </div>
                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-primary2-950 leading-tight group-hover:text-primary2-700 transition-colors">
                            {item.title}
                        </h2>
                        <p className="mt-3 text-sm text-muted-foreground leading-relaxed line-clamp-3">
                            {item.description}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        {item.publishedAt && (
                            <span className="flex items-center gap-1.5">
                                <RiCalendarLine className="shrink-0" />
                                {format(new Date(item.publishedAt), "dd MMM yyyy")}
                            </span>
                        )}
                        <span className="flex items-center gap-1.5">
                            <RiEyeLine className="shrink-0" /> {item.viewCount.toLocaleString()} views
                        </span>
                        <span className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-primary2-700 group-hover:gap-2.5 transition-all">
                            Read announcement <RiArrowRightLine />
                        </span>
                    </div>
                </div>

                {/* Image side */}
                {item.coverImage && (
                    <div className="relative h-56 lg:h-auto overflow-hidden bg-primary2-100">
                        <Image
                            src={item.coverImage}
                            alt={item.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                    </div>
                )}
                {!item.coverImage && (
                    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-primary2-100 to-primary2-200">
                        <RiMegaphoneLine className="text-primary2-300 text-7xl" />
                    </div>
                )}
            </div>
        </FadeUpWrapper>
    )
}
export default FeaturedAnnouncementCard