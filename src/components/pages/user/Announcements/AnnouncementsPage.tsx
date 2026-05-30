"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
    RiMegaphoneLine,
    RiPushpin2Line,
    RiTimeLine,
    RiCalendarLine,
    RiEyeLine,
    RiArrowRightLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiSearchLine,
    RiCloseLine,
    RiAlertLine,
    RiInformationLine,
    RiCheckboxCircleLine,
    RiCalendarEventLine,
    RiNewspaperLine,
    RiRefreshLine,
    RiErrorWarningLine,
    RiSparkling2Line,
} from "react-icons/ri";
import { useGetPublishedAnnouncementsQuery } from "@/redux/apis/announcementApi";
import { format, formatDistanceToNow } from "date-fns";
import { useDebounce } from "@/hooks/useDebounce";
import AnnouncementsPageHead from "@/components/modules/user/announcements/AnnouncementsPageHead";
import SectionLabel from "@/components/shared/SectionLabel";
import { FadeUpWrapper } from "../Home/HomePage";
import { IAnnouncement, TAnnouncementType } from "@/components/modules/user/announcements/announcement.types";

/* ─── FadeUp utility ────────────────────────────────────── */
function FadeUp({
    children,
    delay = 0,
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
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
}

/* ─── Priority config ───────────────────────────────────── */
const PRIORITY = {
    urgent: {
        bar: "bg-red-500",
        soft: "bg-red-50 text-red-700 ring-1 ring-red-200",
        icon: <RiErrorWarningLine />,
        label: "Urgent",
    },
    high: {
        bar: "bg-amber-400",
        soft: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        icon: <RiAlertLine />,
        label: "High",
    },
    normal: {
        bar: "bg-primary2-400",
        soft: "bg-primary2-50 text-primary2-700 ring-1 ring-primary2-200",
        icon: <RiCheckboxCircleLine />,
        label: "Info",
    },
};

/* ─── Type config ───────────────────────────────────────── */
const TYPE: Record<string, { soft: string; icon: React.ReactNode; label: string }> = {
    general: { soft: "bg-primary2-50 text-primary2-700", icon: <RiMegaphoneLine />, label: "General" },
    notice: { soft: "bg-sky-50 text-sky-700", icon: <RiInformationLine />, label: "Notice" },
    event: { soft: "bg-violet-50 text-violet-700", icon: <RiCalendarEventLine />, label: "Event" },
    news: { soft: "bg-primary2-50 text-primary2-700", icon: <RiNewspaperLine />, label: "News" },
    update: { soft: "bg-indigo-50 text-indigo-700", icon: <RiRefreshLine />, label: "Update" },
    alert: { soft: "bg-red-50 text-red-700", icon: <RiAlertLine />, label: "Alert" },
};

/* ─── Type filter tabs ──────────────────────────────────── */
const TYPE_FILTERS: { label: string; value: TAnnouncementType | "all"; icon?: React.ReactNode }[] = [
    { label: "All", value: "all" },
    { label: "General", value: "general", icon: <RiMegaphoneLine /> },
    { label: "Notice", value: "notice", icon: <RiInformationLine /> },
    { label: "Event", value: "event", icon: <RiCalendarEventLine /> },
    { label: "News", value: "news", icon: <RiNewspaperLine /> },
    { label: "Update", value: "update", icon: <RiRefreshLine /> },
    { label: "Alert", value: "alert", icon: <RiAlertLine /> },
];

/* ═══════════════════════════════════════════════════════════
   FEATURED CARD  — big horizontal spotlight
═══════════════════════════════════════════════════════════ */
function FeaturedCard({ item }: { item: IAnnouncement }) {
    const router = useRouter();
    const t = TYPE[item.type] ?? TYPE.general;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
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
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════
   ANNOUNCEMENT CARD
═══════════════════════════════════════════════════════════ */
function AnnouncementCard({ item, idx }: { item: IAnnouncement; idx: number }) {
    const router = useRouter();
    const p = PRIORITY[item.priority];
    const t = TYPE[item.type] ?? TYPE.general;

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.45 }}
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
        </motion.div>
    );
}

/* ═══════════════════════════════════════════════════════════
   CARD SKELETON
═══════════════════════════════════════════════════════════ */
function CardSkeleton() {
    return (
        <div className="animate-pulse rounded-2xl border border-surface-200 bg-white overflow-hidden">
            <div className="h-1 w-full bg-surface-200" />
            <div className="p-5 space-y-3">
                <div className="flex gap-1.5">
                    <div className="h-5 w-16 rounded-full bg-surface-200" />
                    <div className="h-5 w-12 rounded-full bg-surface-200" />
                </div>
                <div className="h-4 w-5/6 rounded bg-surface-200" />
                <div className="h-4 w-3/4 rounded bg-surface-200" />
                <div className="h-3 w-full rounded bg-surface-200" />
                <div className="h-3 w-4/5 rounded bg-surface-200" />
                <div className="h-px w-full bg-surface-100 mt-2" />
                <div className="flex justify-between">
                    <div className="h-3 w-24 rounded bg-surface-200" />
                    <div className="h-3 w-10 rounded bg-surface-200" />
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
const AnnouncementsPage = () => {
    const router = useRouter();
    const [typeFilter, setTypeFilter] = useState<TAnnouncementType | "all">("all");
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);

    const { data, isLoading } = useGetPublishedAnnouncementsQuery({
        page,
        limit: 12,
        type: typeFilter === "all" ? undefined : typeFilter,
        searchTerm: debouncedSearch || undefined,
    });


    const announcements = data?.data ?? [];
    const meta = data?.meta;

    const featuredItem = announcements.find((a) => a.isFeatured);
    const gridItems = announcements.filter((a) => !a.isFeatured || announcements.indexOf(a) !== 0);

    const handleFilterChange = (val: TAnnouncementType | "all") => {
        setTypeFilter(val);
        setPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <div className="three-xl-section-setup pb-24 space-y-16">

            {/* ═══ 1. HERO ════════════════════════════════════════ */}
            <AnnouncementsPageHead />

            {/* ═══ 2. FEATURED SPOTLIGHT ══════════════════════════ */}
            {!isLoading && featuredItem && (
                <FadeUpWrapper delay={0.1} className="space-y-6">
                    <SectionLabel text="Featured Announcements" align="left" icon={<RiSparkling2Line />} className="capitalize" />
                    <FeaturedCard item={featuredItem} />
                </FadeUpWrapper>
            )}

            {/* ═══ 3. SEARCH + FILTERS ════════════════════════════ */}
            <FadeUp>
                <div className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
                    {/* Search bar */}
                    <div className="relative">
                        <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-base pointer-events-none" />
                        <input
                            type="text"
                            value={search}
                            onChange={handleSearchChange}
                            placeholder="Search announcements..."
                            className="w-full rounded-xl border border-surface-200 bg-surface-50 pl-10 pr-10 py-2.5 text-sm text-primary2-900 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary2-300 focus:border-primary2-300 transition-all"
                        />
                        {search && (
                            <button
                                type="button"
                                onClick={() => { setSearch(""); setPage(1); }}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary2-700 transition-colors"
                            >
                                <RiCloseLine />
                            </button>
                        )}
                    </div>

                    {/* Type filter pills */}
                    <div className="flex flex-wrap gap-2">
                        {TYPE_FILTERS.map(({ label, value, icon }) => (
                            <button
                                key={value}
                                type="button"
                                onClick={() => handleFilterChange(value)}
                                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all border ${typeFilter === value
                                    ? "bg-primary2-800 text-white border-primary2-800 shadow-sm"
                                    : "border-surface-200 text-primary2-700 hover:border-primary2-300 hover:bg-primary2-50"
                                    }`}
                            >
                                {icon && <span className="text-sm">{icon}</span>}
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </FadeUp>

            {/* ═══ 4. GRID ════════════════════════════════════════ */}
            <FadeUp>
                {/* Section header */}
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-primary2-900">
                            {debouncedSearch
                                ? `Results for "${debouncedSearch}"`
                                : typeFilter === "all"
                                    ? "All Announcements"
                                    : `${TYPE_FILTERS.find((f) => f.value === typeFilter)?.label} Announcements`}
                        </h2>
                        {meta && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                {meta.total} announcement{meta.total !== 1 ? "s" : ""} found
                            </p>
                        )}
                    </div>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-28 text-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-surface-100 flex items-center justify-center">
                            <RiMegaphoneLine className="text-2xl text-muted-foreground" />
                        </div>
                        <div>
                            <p className="text-base font-semibold text-primary2-900">No announcements found</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                {debouncedSearch
                                    ? "Try a different search term or clear the filter."
                                    : "Check back soon for new updates."}
                            </p>
                        </div>
                        {(debouncedSearch || typeFilter !== "all") && (
                            <button
                                type="button"
                                onClick={() => { setSearch(""); setTypeFilter("all"); setPage(1); }}
                                className="inline-flex items-center gap-2 rounded-xl border border-surface-200 px-4 py-2 text-sm font-medium text-primary2-700 hover:bg-surface-50 transition-colors"
                            >
                                <RiCloseLine /> Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${typeFilter}-${page}-${debouncedSearch}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {gridItems.map((item, idx) => (
                                    <AnnouncementCard key={item._id} item={item} idx={idx} />
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}

                {/* Pagination */}
                {meta && meta.totalPage > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-1.5">
                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-surface-200 text-primary2-700 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <RiArrowLeftSLine className="text-lg" />
                        </button>

                        {Array.from({ length: meta.totalPage }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPage(p)}
                                className={`inline-flex items-center justify-center h-9 w-9 rounded-xl text-sm font-semibold transition-colors border ${p === page
                                    ? "bg-primary2-800 text-white border-primary2-800 shadow-sm"
                                    : "border-surface-200 text-muted-foreground hover:bg-surface-50 hover:text-primary2-900"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}

                        <button
                            type="button"
                            onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
                            disabled={page === meta.totalPage}
                            className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-surface-200 text-primary2-700 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            <RiArrowRightSLine className="text-lg" />
                        </button>
                    </div>
                )}
            </FadeUp>

            {/* ═══ 5. STAY CONNECTED ══════════════════════════════ */}
            <FadeUp>
                <div className="relative rounded-3xl overflow-hidden border border-primary2-200/50 bg-gradient-to-br from-primary2-50 to-white px-7 py-10 sm:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-30"
                        style={{ background: "radial-gradient(ellipse at 100% 50%, rgba(46,139,87,0.25), transparent 70%)" }} />
                    <div className="relative z-10">
                        <h3 className="text-xl font-extrabold text-primary2-900">
                            Never miss an update
                        </h3>
                        <p className="mt-1.5 text-sm text-muted-foreground max-w-md">
                            Important notices and time-sensitive alerts are posted here first.
                            Check back regularly or contact the alumni office for direct correspondence.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.push("/contact")}
                        className="relative z-10 shrink-0 inline-flex items-center gap-2 rounded-xl bg-primary2-800 hover:bg-primary2-900 text-white px-6 py-3 text-sm font-semibold transition-colors shadow-sm"
                    >
                        Contact Us <RiArrowRightLine />
                    </button>
                </div>
            </FadeUp>
        </div>
    );
};
export default AnnouncementsPage;