"use client"

import { announcementTypeFilterStyle } from "@/components/pages/user/Announcements/AnnouncementsPage";
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import SectionLabel from "@/components/shared/SectionLabel";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetPublishedAnnouncementsQuery } from "@/redux/apis/announcementApi";
import { useState } from "react";
import {
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiCloseLine,
    RiMegaphoneLine,
    RiSearchLine,
    RiSparkling2Line,
} from "react-icons/ri";
import FeaturedAnnouncementCard from "./FeaturedAnnouncementCard";
import AnnouncementCardSkeleton from "./AnnouncementCardSkeleton";
import { AnimatePresence } from "framer-motion";
import AnnouncementCard from "./AnnouncementCard";
import { TAnnouncementType } from "@/constants";
import InputField from "@/components/shared/InputField";

type TypeFilter = TAnnouncementType | "ALL";

const ALL_FILTERS: { label: string; value: TypeFilter; icon?: React.ReactNode }[] = [
    { label: "All", value: "ALL" },
    ...announcementTypeFilterStyle.map((f) => ({ ...f, value: f.value as TypeFilter })),
];

function getPaginationRange(current: number, total: number): (number | "…")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
    if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "…", current - 1, current, current + 1, "…", total];
}

const AnnouncementsPageAnnouncements = () => {
    const [typeFilter, setTypeFilter] = useState<TypeFilter>("ALL");
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 400);

    // Always fetch featured — independent of any filter/search/page state
    const { data: spotlightData } = useGetPublishedAnnouncementsQuery({ page: 1, limit: 10 });
    const featuredItem = spotlightData?.data?.find((a) => a.isFeatured) ?? null;

    // Main filtered query for the grid
    const { data, isLoading } = useGetPublishedAnnouncementsQuery({
        page,
        limit: 12,
        type: typeFilter === "ALL" ? undefined : typeFilter,
        searchTerm: debouncedSearch || undefined,
    });

    const announcements = data?.data ?? [];
    const meta = data?.meta;

    // Exclude featured item from grid to avoid duplicates
    const gridItems = announcements.filter((a) => a._id !== featuredItem?._id);

    const isFiltered = !!debouncedSearch || typeFilter !== "ALL";
    const activeLabel = ALL_FILTERS.find((f) => f.value === typeFilter)?.label ?? "All";
    const paginationRange = meta ? getPaginationRange(page, meta.totalPage) : [];

    const clearFilters = () => { setSearch(""); setTypeFilter("ALL"); setPage(1); };

    return (
        <section className="three-xl-section-setup space-y-10">
            {/* ── Featured Spotlight (filter-independent) ─── */}
            {featuredItem && (
                <FadeUpWrapper delay={0.1} className="space-y-5">
                    <SectionLabel text="Featured" align="left" icon={<RiSparkling2Line />} />
                    <FeaturedAnnouncementCard item={featuredItem} />
                </FadeUpWrapper>
            )}

            {/* ── Search + Tab filters ──────────────────────── */}
            <FadeUpWrapper delay={0.15} className="space-y-0">
                {/* Search */}
                <div className="relative mb-4">
                    <RiSearchLine className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-base pointer-events-none" />
                    <InputField
                        type="text"
                        icon={<RiSearchLine
                            className="text-muted-foreground text-base" />}
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search announcements…" />
                    {search && (
                        <button
                            type="button"
                            onClick={() => { setSearch(""); setPage(1); }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary2-700 transition-colors"
                        >
                            <RiCloseLine className="text-base" />
                        </button>
                    )}
                </div>

                {/* Tab bar — horizontally scrollable on mobile */}
                <div className="flex overflow-x-auto overflow-y-hidden scrollbar-hide border-b border-surface-200">
                    {ALL_FILTERS.map(({ label, value, icon }) => {
                        const isActive = typeFilter === value;
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => { setTypeFilter(value); setPage(1); }}
                                className={`relative shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors ${isActive
                                    ? "text-primary2-700"
                                    : "text-muted-foreground hover:text-primary2-700"
                                    }`}
                            >
                                {icon && <span className="text-base">{icon}</span>}
                                {label}
                                {isActive && (
                                    <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary2-500 rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>
            </FadeUpWrapper>

            {/* ── Grid ─────────────────────────────────────── */}
            <FadeUpWrapper delay={0.2}>
                {/* Subtle meta row */}
                <div className="mb-5 flex items-center justify-between gap-3 min-h-[24px]">
                    {meta && !isLoading ? (
                        <p className="text-sm text-muted-foreground">
                            <span className="font-semibold text-primary2-800">{meta.total}</span>{" "}
                            {typeFilter !== "ALL" && <>{activeLabel.toLowerCase()} </>}
                            announcement{meta.total !== 1 ? "s" : ""}
                        </p>
                    ) : <span />}
                    {isFiltered && (
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-primary2-700 transition-colors"
                        >
                            <RiCloseLine /> Clear filters
                        </button>
                    )}
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                        {Array.from({ length: 6 }).map((_, i) => <AnnouncementCardSkeleton key={i} />)}
                    </div>
                ) : announcements.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center gap-5">
                        <div className="h-20 w-20 rounded-2xl bg-primary2-50 border border-primary2-100 flex items-center justify-center">
                            <RiMegaphoneLine className="text-3xl text-primary2-300" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-primary2-900">No announcements found</p>
                            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
                                {debouncedSearch
                                    ? "Try a different keyword or clear the filters."
                                    : "Nothing here yet — check back soon."}
                            </p>
                        </div>
                        {isFiltered && (
                            <button
                                type="button"
                                onClick={clearFilters}
                                className="inline-flex items-center gap-2 rounded-xl bg-primary2-800 text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary2-900 transition-colors"
                            >
                                <RiCloseLine /> Clear filters
                            </button>
                        )}
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <FadeUpWrapper>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
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

                        {paginationRange.map((p, i) =>
                            p === "…" ? (
                                <span key={`ellipsis-${i}`} className="w-9 text-center text-sm text-muted-foreground select-none">…</span>
                            ) : (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setPage(p as number)}
                                    className={`inline-flex items-center justify-center h-9 w-9 rounded-xl text-sm font-semibold transition-all border ${p === page
                                        ? "bg-primary2-800 text-white border-primary2-800 shadow-sm"
                                        : "border-surface-200 text-muted-foreground hover:bg-surface-50 hover:text-primary2-900"
                                        }`}
                                >
                                    {p}
                                </button>
                            )
                        )}

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
            </FadeUpWrapper>
        </section>
    );
};

export default AnnouncementsPageAnnouncements;