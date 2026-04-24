"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Masonry from "react-masonry-css";
import {
    RiCameraLensLine,
    RiFlashlightLine,
    RiGalleryLine,
    RiUploadCloud2Line,
    RiZoomInLine,
} from "react-icons/ri";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import HorizontalSnapCarousel from "@/components/shared/HorizontalSnapCarousel";
import { useGetPublishedGalleriesQuery, type GalleryImage } from "@/redux/apis/galleryApi";

/* ── Types ────────────────────────────────────────────────── */
const getCategoryName = (img: GalleryImage): string => {
    if (typeof img.category === "object" && img.category !== null) return img.category.name;
    return "";
};

/* ── Static data ──────────────────────────────────────────── */
const featuredCollections = [
    {
        title: "Reunion Stage Frames",
        note: "Lighting, applause, and full-house snapshots from reunion night.",
        count: "42 Photos",
    },
    {
        title: "Classroom Throwbacks",
        note: "Benches, blackboards, and the corridors that shaped generations.",
        count: "28 Photos",
    },
    {
        title: "Campus Golden Hour",
        note: "Architectural captures of the school campus in evening light.",
        count: "35 Photos",
    },
    {
        title: "Teacher Tribute Set",
        note: "Portrait-driven moments honoring mentors and educators.",
        count: "19 Photos",
    },
    {
        title: "Volunteer in Action",
        note: "Blood drives, scholarship handoffs, and community support moments.",
        count: "53 Photos",
    },
];

const galleryStats = [
    { value: "500+", label: "Curated photos" },
    { value: "12", label: "Featured albums" },
    { value: "1966", label: "Earliest capture" },
    { value: "Open", label: "Submissions" },
];

const masonryBreakpoints = { default: 3, 1024: 3, 768: 2, 640: 1 };

const LOAD_SIZE = 5;

/* ── FadeUp helper ────────────────────────────────────────── */
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

/* ── Main Page ────────────────────────────────────────────── */
const GalleryPage = () => {
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [allImages, setAllImages] = useState<GalleryImage[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>("All");

    const { data, isFetching } = useGetPublishedGalleriesQuery(
        { cursor, limit: LOAD_SIZE },
        { refetchOnMountOrArgChange: false }
    );

    // Append new batch to allImages; reset on initial load (cursor undefined)
    useEffect(() => {
        if (!data?.data) return;
        if (!cursor) {
            setAllImages(data.data);
        } else {
            setAllImages((prev) => [...prev, ...data.data]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const nextCursor = data?.meta?.nextCursor ?? null;
    const hasMore = data?.meta?.hasMore ?? false;

    const handleLoadMore = () => {
        if (nextCursor) setCursor(nextCursor);
    };

    // Dynamic category filters from loaded images
    const uniqueCategories = [
        "All",
        ...Array.from(new Set(allImages.map(getCategoryName).filter(Boolean))),
    ];

    const filtered =
        activeFilter === "All"
            ? allImages
            : allImages.filter((img) => getCategoryName(img) === activeFilter);

    const handleFilterChange = (f: string) => {
        setActiveFilter(f);
    };

    return (
        <div className="three-xl-section-setup pb-20 space-y-16">

            {/* ═══ 1. CINEMATIC HERO ═══════════════════════════════ */}
            <section
                className="relative overflow-hidden rounded-3xl"
                style={{ background: "linear-gradient(145deg, #041a12 0%, #0c4a34 55%, #062319 100%)" }}
            >
                <div
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
                <div
                    className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-25"
                    style={{ background: "rgba(46,139,87,1)" }}
                />
                <div
                    className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full blur-3xl opacity-20"
                    style={{ background: "rgba(245,158,11,1)" }}
                />

                <div className="relative z-10 px-7 py-12 sm:px-12 sm:py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.55 }}
                    >
                        <Badge className="bg-white/10 text-primary2-100 border-primary2-300/35 hover:bg-white/10 mb-5">
                            <RiGalleryLine className="mr-1.5" /> Gallery Hub
                        </Badge>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
                            Memory Wall,{" "}
                            <span className="text-primary2-300">built as a living mosaic</span>
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm sm:text-lg text-primary2-100/75 leading-relaxed">
                            Curated alumni moments through an editorial masonry grid, featured
                            collections, and visual narratives crafted for future archive expansion.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl"
                    >
                        {galleryStats.map(({ value, label }) => (
                            <div
                                key={label}
                                className="rounded-2xl border px-4 py-4 text-center"
                                style={{
                                    background: "rgba(255,255,255,0.07)",
                                    borderColor: "rgba(255,255,255,0.12)",
                                }}
                            >
                                <p className="text-2xl font-bold text-white">{value}</p>
                                <p className="mt-0.5 text-xs text-primary2-200/80">{label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ═══ 2. FILTER + MASONRY GRID ════════════════════════ */}
            <section>
                <FadeUp>
                    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-primary2-900">
                                Photo Archive
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Adaptive masonry collage — hover any frame for details.
                            </p>
                        </div>
                        {/* Dynamic filter pills */}
                        {uniqueCategories.length > 1 && (
                            <div className="flex flex-wrap gap-2">
                                {uniqueCategories.map((f) => (
                                    <button
                                        key={f}
                                        type="button"
                                        onClick={() => handleFilterChange(f)}
                                        className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200 border ${activeFilter === f
                                            ? "bg-primary2-800 text-white border-primary2-800"
                                            : "border-surface-300 text-primary2-700 hover:border-primary2-400 hover:bg-primary2-50"
                                            }`}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </FadeUp>

                {isFetching && allImages.length === 0 ? (
                    /* Initial loading skeleton */
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div
                                key={i}
                                className="aspect-[4/5] animate-pulse rounded-2xl bg-gray-100"
                            />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <p className="py-12 text-center text-sm text-muted-foreground">
                        No images found.
                    </p>
                ) : (
                    <Masonry
                        breakpointCols={masonryBreakpoints}
                        className="masonry-grid"
                        columnClassName="masonry-grid_column"
                    >
                        {filtered.map((img, idx) => (
                            <motion.div
                                key={img._id}
                                layout
                                initial={{ opacity: 0, scale: 0.96 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.96 }}
                                transition={{ duration: 0.35, delay: (idx % 6) * 0.05 }}
                                className="group relative overflow-hidden rounded-2xl border border-surface-300/60 bg-surface mb-3"
                            >
                                <Image
                                    src={img.imageUrl}
                                    alt={img.innerTitle || img.title}
                                    width={800}
                                    height={1000}
                                    className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div
                                    className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                    style={{
                                        background:
                                            "linear-gradient(to top, rgba(4,26,18,0.85) 0%, transparent 60%)",
                                    }}
                                >
                                    {(img.innerTitle || img.title) && (
                                        <p className="text-xs font-medium text-white mb-1 truncate">
                                            {img.innerTitle || img.title}
                                        </p>
                                    )}
                                    <span className="inline-flex items-center w-fit gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-xs text-white font-medium">
                                        <RiZoomInLine /> {getCategoryName(img)}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </Masonry>
                )}

                {/* Load more */}
                {hasMore && (
                    <div className="mt-8 flex justify-center">
                        <Button
                            variant="outline"
                            onClick={handleLoadMore}
                            disabled={isFetching}
                            className="min-w-32"
                        >
                            {isFetching ? "Loading…" : "Load More"}
                        </Button>
                    </div>
                )}
            </section>

            {/* ═══ 3. FEATURED COLLECTIONS ═════════════════════════ */}
            <FadeUp>
                <div className="mb-5">
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary2-900">
                        Featured Collections
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Curated albums by moment, era, and community contribution.
                    </p>
                </div>
                <HorizontalSnapCarousel>
                    {featuredCollections.map((item) => (
                        <Card
                            key={item.title}
                            className="h-full border-primary2-200/60 hover:-translate-y-1 transition-transform duration-200"
                        >
                            <CardContent className="p-6">
                                <div className="h-12 w-12 rounded-2xl flex items-center justify-center bg-primary2-100">
                                    <RiCameraLensLine className="text-2xl text-primary2-700" />
                                </div>
                                <h3 className="mt-5 text-lg font-semibold text-primary2-900 leading-snug">
                                    {item.title}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                                    {item.note}
                                </p>
                                <p className="mt-4 text-xs font-medium text-primary2-600">
                                    {item.count}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </HorizontalSnapCarousel>
            </FadeUp>

            {/* ═══ 4. VISUAL STORY STRIPS + CONTRIBUTE ════════════ */}
            <FadeUp>
                <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-5">
                    <Card className="border-primary2-200/60">
                        <CardContent className="p-6 sm:p-8">
                            <h3 className="text-xl font-bold text-primary2-900">
                                Visual Story Strips
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Sequence memories as mini-documentaries — assembly, classroom,
                                reunion, service.
                            </p>
                            <Separator className="my-6" />
                            <div className="grid sm:grid-cols-3 gap-3">
                                {[
                                    { phase: "Then", desc: "1966–1999 archival collection" },
                                    { phase: "Now", desc: "2000–present digital archive" },
                                    { phase: "Next", desc: "Upcoming event captures" },
                                ].map(({ phase, desc }) => (
                                    <div
                                        key={phase}
                                        className="rounded-xl border border-surface-300/60 bg-primary2-50/50 p-4"
                                    >
                                        <p className="text-xs uppercase tracking-[0.14em] text-primary2-600 font-medium">
                                            {phase}
                                        </p>
                                        <p className="mt-2 text-sm text-primary2-900 font-medium">
                                            {desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary2-200/60">
                        <CardContent className="p-6 sm:p-8 flex flex-col">
                            <h3 className="text-xl font-bold text-primary2-900">Contribute</h3>
                            <p className="mt-2 text-sm text-muted-foreground flex-1">
                                Submit your best BAMHS moments with context to enrich the alumni
                                archive permanently.
                            </p>
                            <Button className="mt-8 w-full bg-primary2-700 hover:bg-primary2-800 text-white">
                                <RiUploadCloud2Line className="mr-2 text-base" /> Submit Photos
                            </Button>
                            <p className="mt-3 text-xs text-muted-foreground text-center">
                                Quality review &amp; curation pipeline ready to connect.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </FadeUp>

            {/* ═══ 5. UPGRADE BANNER ═══════════════════════════════ */}
            <FadeUp>
                <div
                    className="rounded-3xl border border-primary2-200/60 px-6 py-5 flex flex-wrap items-center gap-3"
                    style={{
                        background:
                            "linear-gradient(135deg, rgba(46,139,87,0.07) 0%, rgba(126,158,37,0.05) 100%)",
                    }}
                >
                    <RiFlashlightLine className="text-primary2-700 text-xl shrink-0" />
                    <p className="text-sm text-primary2-900 flex-1 min-w-0">
                        <strong>Next upgrade-ready:</strong> AI-assisted photo tagging, year-wise
                        smart filters, lightbox viewer, and event-based dynamic albums.
                    </p>
                </div>
            </FadeUp>
        </div>
    );
};

export default GalleryPage;
