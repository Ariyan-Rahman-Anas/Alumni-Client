"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useInView } from "framer-motion";
import {
    RiBookmarkLine,
    RiErrorWarningLine,
    RiInformationLine,
    RiCheckboxCircleLine,
    RiMegaphoneLine,
    RiPushpin2Line,
    RiTimeLine,
    RiCalendarEventLine,
    RiNewspaperLine,
    RiAlertLine,
    RiRefreshLine,
} from "react-icons/ri";
import { Badge } from "@/components/ui/badge";
import {
    useGetPublishedAnnouncementsQuery,
    type Announcement,
    type AnnouncementType,
} from "@/redux/apis/announcementApi";
import { format } from "date-fns";

/* ── FadeUp ─────────────────────────────────────────────── */
const FadeUp = ({
    children,
    delay = 0,
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay, ease: [0.19, 1, 0.22, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

/* ── Priority style map ──────────────────────────────────── */
const PRIORITY_STYLES = {
    urgent: {
        card: "bg-red-50 border-red-200 text-red-800",
        badge: "bg-red-100 text-red-700",
        icon: <RiErrorWarningLine />,
        label: "Urgent",
    },
    high: {
        card: "bg-amber-50 border-amber-200 text-amber-800",
        badge: "bg-amber-100 text-amber-700",
        icon: <RiErrorWarningLine />,
        label: "High",
    },
    normal: {
        card: "bg-surface-50 border-surface-200 text-primary2-800",
        badge: "bg-primary2-50 text-primary2-700",
        icon: <RiCheckboxCircleLine />,
        label: "Info",
    },
};

/* ── Single card ─────────────────────────────────────────── */
const AnnouncementCard = ({ item, idx }: { item: Announcement; idx: number }) => {
    const router = useRouter();
    const p = PRIORITY_STYLES[item.priority];

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.06 }}
        >
            <div className={`rounded-2xl border p-5 h-full ${p.card}`}>
                <div className="flex items-start justify-between gap-2">
                    <span className="text-xl mt-0.5">{p.icon}</span>
                    <div className="flex items-center gap-1.5">
                        {item.isPinned && (
                            <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium flex items-center gap-1 ${p.badge}`}
                            >
                                <RiPushpin2Line /> Pinned
                            </span>
                        )}
                        <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${p.badge}`}
                        >
                            {p.label}
                        </span>
                    </div>
                </div>
                <p className="mt-3 text-sm font-semibold leading-snug">{item.title}</p>
                <p className="mt-1.5 text-xs opacity-75 leading-relaxed line-clamp-2">
                    {item.description}
                </p>
                {item.publishedAt && (
                    <p className="mt-2 text-xs opacity-60 flex items-center gap-1">
                        <RiTimeLine />
                        {format(new Date(item.publishedAt), "dd MMM yyyy")}
                    </p>
                )}
                <button
                    type="button"
                    onClick={() => router.push(`/announcements/${item.slug}`)}
                    className="mt-3 flex items-center gap-1 text-xs font-medium opacity-80 hover:opacity-100"
                >
                    <RiBookmarkLine /> Read more
                </button>
            </div>
        </motion.div>
    );
};

/* ── Type filter options ────────────────────────────────── */
const TYPE_FILTERS: { label: string; value: AnnouncementType | "all"; icon?: React.ReactNode }[] = [
    { label: "All", value: "all" },
    { label: "General", value: "general", icon: <RiMegaphoneLine /> },
    { label: "Notice", value: "notice", icon: <RiInformationLine /> },
    { label: "Event", value: "event", icon: <RiCalendarEventLine /> },
    { label: "News", value: "news", icon: <RiNewspaperLine /> },
    { label: "Update", value: "update", icon: <RiRefreshLine /> },
    { label: "Alert", value: "alert", icon: <RiAlertLine /> },
];

/* ── Page ─────────────────────────────────────────────────── */
const AnnouncementsPage = () => {
    const [typeFilter, setTypeFilter] = useState<AnnouncementType | "all">("all");
    const [page, setPage] = useState(1);

    const { data, isLoading } = useGetPublishedAnnouncementsQuery({
        page,
        limit: 12,
        type: typeFilter === "all" ? undefined : typeFilter,
    });

    const announcements = data?.data ?? [];
    const meta = data?.meta;

    const priorityItems = announcements
        .filter((a) => a.isPinned || a.priority === "urgent" || a.priority === "high")
        .slice(0, 3);

    return (
        <div className="three-xl-section-setup pb-20 space-y-16">

            {/* ═══ 1. HERO ════════════════════════════════════════ */}
            <section className="rounded-3xl border border-surface-300/60 bg-surface overflow-hidden relative">
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "radial-gradient(ellipse at 90% 0%, rgba(46,139,87,0.15), transparent 55%)",
                    }}
                />
                <div className="relative z-10 px-7 py-12 sm:px-12 sm:py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55 }}
                    >
                        <Badge className="mb-5 bg-primary2-100 text-primary2-700 border-primary2-200 hover:bg-primary2-100">
                            <RiMegaphoneLine className="mr-1.5" /> Announcements
                        </Badge>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-primary2-900 leading-tight max-w-2xl">
                            Signal Center for alumni updates
                        </h1>
                        <p className="mt-5 max-w-xl text-sm sm:text-lg text-muted-foreground leading-relaxed">
                            High-priority notices, verified updates, and policy communication in one
                            clearly layered command board.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ═══ 2. PRIORITY NOTICES ════════════════════════════ */}
            {(isLoading || priorityItems.length > 0) && (
                <FadeUp>
                    <div className="mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-primary2-900">
                            Priority Notices
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Time-sensitive, source-verified communications.
                        </p>
                    </div>
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-36 rounded-2xl animate-pulse bg-gray-100" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {priorityItems.map((item, idx) => (
                                <AnnouncementCard key={item._id} item={item} idx={idx} />
                            ))}
                        </div>
                    )}
                </FadeUp>
            )}

            {/* ═══ 3. ALL ANNOUNCEMENTS ════════════════════════════ */}
            <FadeUp>
                <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-primary2-900">
                            All Announcements
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Browse the full archive of official communications.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                        {TYPE_FILTERS.map(({ label, value }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => {
                                    setTypeFilter(value);
                                    setPage(1);
                                }}
                                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${typeFilter === value
                                    ? "bg-primary2-800 text-white border-primary2-800"
                                    : "border-surface-300 text-primary2-700 hover:border-primary2-400"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="h-44 rounded-2xl animate-pulse bg-gray-100" />
                        ))}
                    </div>
                ) : announcements.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        No announcements found.
                    </p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {announcements.map((item, idx) => (
                                <AnnouncementCard key={item._id} item={item} idx={idx} />
                            ))}
                        </div>
                        {meta && meta.totalPage > 1 && (
                            <div className="mt-8 flex items-center justify-center gap-2">
                                {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPage(p)}
                                        className={`h-8 w-8 text-sm rounded-lg transition-colors ${p === page
                                            ? "bg-primary2-700 text-white"
                                            : "hover:bg-surface-100 text-muted-foreground"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </FadeUp>

            {/* ═══ 4. UPGRADE BANNER ═══════════════════════════════ */}
            <FadeUp>
                <div
                    className="rounded-3xl border border-primary2-200/60 px-6 py-5 flex flex-wrap items-center gap-3"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(46,139,87,0.07) 0%, rgba(126,158,37,0.05) 100%)",
                    }}
                >
                    <RiMegaphoneLine className="text-primary2-700 text-xl shrink-0" />
                    <p className="text-sm text-primary2-900 flex-1 min-w-0">
                        <strong>Next upgrade-ready:</strong> read-status sync, per-member bookmarks,
                        and push notification hooks.
                    </p>
                </div>
            </FadeUp>
        </div>
    );
};

export default AnnouncementsPage;
