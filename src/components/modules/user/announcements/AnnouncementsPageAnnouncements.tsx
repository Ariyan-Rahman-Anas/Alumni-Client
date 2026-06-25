import { announcementTypeFilterStyle, announcementTypeStyle } from "@/components/pages/user/Announcements/AnnouncementsPage";
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import SectionLabel from "@/components/shared/SectionLabel";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetPublishedAnnouncementsQuery } from "@/redux/apis/announcementApi";
import { useState } from "react";
import { RiArrowLeftSLine, RiArrowRightSLine, RiCloseLine, RiMegaphoneLine, RiSearchLine, RiSparkling2Line } from "react-icons/ri";
import FeaturedAnnouncementCard from "./FeaturedAnnouncementCard";
import AnnouncementCardSkeleton from "./AnnouncementCardSkeleton";
import { AnimatePresence } from "framer-motion";
import AnnouncementCard from "./AnnouncementCard";

const AnnouncementsPageAnnouncements = () => {
    const [typeFilter, setTypeFilter] = useState<keyof typeof announcementTypeStyle | "all">("all");
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

    const handleFilterChange = (val: keyof typeof announcementTypeStyle | "all") => {
        setTypeFilter(val);
        setPage(1);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <section className="three-xl-section-setup">
            {/* ═══ 2. FEATURED SPOTLIGHT  */}
            {!isLoading && featuredItem && (
                <FadeUpWrapper delay={0.1} className="space-y-6">
                    <SectionLabel text="Featured Announcements" align="left" icon={<RiSparkling2Line />} className="capitalize" />
                    <FeaturedAnnouncementCard item={featuredItem} />
                </FadeUpWrapper>
            )}

            {/* ═══ 3. SEARCH + FILTERS ════════════════════════════ */}
            <FadeUpWrapper delay={0.1} className="mt-10">
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
                        {announcementTypeFilterStyle.map(({ label, value, icon }) => (
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
            </FadeUpWrapper>

            {/* ═══ 4. GRID ════════════════════════════════════════ */}
            <FadeUpWrapper delay={0.2} className="mt-10">
                {/* Section header */}
                <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-primary2-900">
                            {debouncedSearch
                                ? `Results for "${debouncedSearch}"`
                                : typeFilter === "all"
                                    ? "All Announcements"
                                    : `${announcementTypeFilterStyle.find((f) => f.value === typeFilter)?.label} Announcements`}
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
                        {Array.from({ length: 6 }).map((_, i) => <AnnouncementCardSkeleton key={i} />)}
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
                        <FadeUpWrapper>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {gridItems.map((item, idx) => (
                                    <AnnouncementCard key={item._id} item={item} idx={idx} />
                                ))}
                            </div>
                        </FadeUpWrapper>
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
            </FadeUpWrapper></section>
    )
}

export default AnnouncementsPageAnnouncements