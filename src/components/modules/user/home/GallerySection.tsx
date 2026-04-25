"use client";

import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import SectionLabel from "@/components/shared/SectionLabel";
import { GalleryImage, useGetPublishedImagesQuery } from "@/redux/apis/galleryApi";
import Image from "next/image";
import Link from "next/link";
import { HiArrowUpRight } from "react-icons/hi2";
import { RiImageLine, RiGalleryLine } from "react-icons/ri";

const GalleryCard = ({
    item,
    className = "",
    priority = false,
}: {
    item: GalleryImage | null | undefined;
    className?: string;
    priority?: boolean;
}) => (
    <Link
        href="/gallery"
        aria-label={item?.innerTitle || item?.title}
        className={`group relative block overflow-hidden rounded-2xl ${className}`}
    >
        <Image
            src={item?.imageUrl ?? "/bamhs.png"}
            alt={item?.innerTitle?.substring(0, 25) || item?.title?.substring(0, 25) || "Gallery Image"}
            fill
            priority={priority}
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 480px"
        />

        {/* Hover tint */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors duration-300" />

        {/* Bottom info strip — always visible */}
        <div
            className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between gap-2 px-3 pb-3 pt-12"
            style={{
                background:
                    "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.28) 55%, transparent 100%)",
            }}
        >
            <div className="min-w-0">
                <h1 className="text-white font-semibold text-xs sm:text-sm leading-snug truncate">
                    {item?.innerTitle ? item?.innerTitle : item?.title}
                </h1>
                <p className="text-white/80 text-xs sm:text-sm leading-snug truncate">
                    {item?.description}
                </p>
            </div>

            {/* Arrow — hover only */}
            <span
                className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                style={{
                    background: "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    backdropFilter: "blur(6px)",
                }}
            >
                <HiArrowUpRight className="text-white text-xs" />
            </span>
        </div>
    </Link>
);

const ViewAllCard = ({ item, className = "" }: { item: GalleryImage | null | undefined; className?: string }) => (
    <div className={`group relative overflow-hidden rounded-2xl ${className}`}>
        <Link href="/gallery" aria-label="View all photos" className="absolute inset-0 z-20" />

        {/* Background photo */}
        <Image
            src={item?.imageUrl ?? "/deep-light.jpeg"}
            alt={item?.innerTitle ?? item?.title ?? "Gallery Image"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="300px"
        />

        {/* Always-visible dark base + green tint overlay */}
        <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ background: "linear-gradient(145deg, rgba(10,61,43,0.72) 0%, rgba(0,0,0,0.55) 100%)" }}
        />
        {/* Hover: deepen to near-black */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />

        {/* Content — always visible */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 text-center px-4">
            <span
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-1 transition-transform duration-300 group-hover:scale-110"
                style={{
                    background: "rgba(46,139,87,0.55)",
                    border: "1px solid rgba(77,180,114,0.5)",
                    boxShadow: "0 0 16px rgba(46,139,87,0.35)",
                }}
            >
                <RiImageLine className="text-white text-xl" />
            </span>
            <p className="text-white font-bold text-sm leading-tight tracking-wide">View All Photos</p>
            <p
                className="text-[11px] mt-0.5 transition-colors duration-300"
                style={{ color: "rgba(195,232,206,0.75)" }}
            >
                Explore the full gallery →
            </p>
        </div>
    </div>
);

const GallerySkeleton = () => (
    <div className="animate-pulse">
        {/* Mobile skeleton */}
        <div className="flex flex-col gap-3 sm:hidden">
            <div className="w-full aspect-video rounded-2xl bg-primary-100/60" />
            <div className="grid grid-cols-2 gap-3">
                <div className="aspect-[4/3] rounded-2xl bg-primary-100/60" />
                <div className="aspect-[4/3] rounded-2xl bg-primary-100/60" />
                <div className="aspect-[4/3] rounded-2xl bg-primary-100/60" />
                <div className="aspect-[4/3] rounded-2xl bg-primary-100/60" />
            </div>
        </div>

        {/* Desktop skeleton */}
        <div
            className="hidden sm:grid sm:grid-cols-3 gap-3"
            style={{ gridTemplateRows: "280px 280px 200px" }}
        >
            <div className="col-span-2 row-span-2 rounded-2xl bg-primary-100/60" />
            <div className="rounded-2xl bg-primary-100/60" />
            <div className="rounded-2xl bg-primary-100/60" />
            <div className="rounded-2xl bg-primary-100/60" />
            <div className="rounded-2xl bg-primary-100/60" />
            <div className="rounded-2xl bg-primary-100/60" />
        </div>
    </div>
);

const GallerySection = () => {
    const { data: publishedImagesData, isLoading: isPublishedImagesLoading } = useGetPublishedImagesQuery({})
    const featuredImages = publishedImagesData?.data?.filter((image: GalleryImage) => image?.isFeatured) || []

    const item1 = featuredImages[0]
    const item2 = featuredImages[1]
    const item3 = featuredImages[2]
    const item4 = featuredImages[3]
    const item5 = featuredImages[4]
    const item6 = featuredImages[5]



    return (
        <section className="three-xl-section-setup">

            {/* ── Header ───────────────────────────────────────────── */}
            <FadeUpWrapper delay={0.14} className="text-center mb-12">
                {/* Pill badge */}
                <SectionLabel text="Captured Memories" icon={<RiGalleryLine className="text-sm" />} />

                <h2 className="section-heading text-primary2-900 ">
                    Our Gallery
                </h2>

                {/* Decorative line + subtext */}
                <div className="flex items-center justify-center gap-4 mt-4">
                    <span className="block h-px w-12 rounded-full" style={{ background: "var(--color-primary-300)" }} />
                    <p className="text-sm md:text-base" style={{ color: "var(--color-text-secondary)" }}>
                        Moments frozen in time — from dusty playgrounds to proud graduations.
                    </p>
                    <span className="block h-px w-12 rounded-full" style={{ background: "var(--color-primary-300)" }} />
                </div>
            </FadeUpWrapper>

            <FadeUpWrapper delay={0.2}>
                {isPublishedImagesLoading ? <GallerySkeleton /> : (
                    <>
                        {/*
            ═══════════════════════════════════════════════════════
              MOBILE  (<sm / <640px)
              Completely separate layout — no conflict with desktop
              ┌────────────────────┐
              │   Hero  16:9       │  full width
              ├─────────┬──────────┤
              │ img2 4:3│ img3 4:3 │
              ├─────────┼──────────┤
              │ img4 4:3│ img5 4:3 │
              └─────────┴──────────┘
              CTA button below handles "View All"
            ═══════════════════════════════════════════════════════
            */}
                        <div className="flex flex-col gap-3 sm:hidden">
                            {/* Hero — full width */}
                            <GalleryCard
                                // item={galleryItems[0]}
                                item={item1}
                                priority
                                className="w-full aspect-video"
                            />
                            {/* 2 × 2 grid + ViewAll */}
                            <div className="grid grid-cols-2 gap-3">
                                <GalleryCard item={item2} className="aspect-[4/3]" />
                                <GalleryCard item={item2} className="aspect-[4/3]" />
                                <GalleryCard item={item3} className="aspect-[4/3]" />
                                <ViewAllCard className="aspect-[4/3]" item={item4} />
                            </div>
                        </div>

                        {/*
            ═══════════════════════════════════════════════════════
              DESKTOP  (≥sm / ≥640px)
              3-column bento — explicit inline gridTemplateRows
              ┌──────────────────┬───────────┐  row 1: 280px
              │                  │   img2    │
              │   Hero  (2×2)    ├───────────┤  row 2: 280px
              │                  │   img3    │
              ├──────────┬───────┴────┬──────┤  row 3: 200px
              │   img4   │   img5     │ view │
              └──────────┴────────────┴──────┘
            ═══════════════════════════════════════════════════════
            */}
                        <div
                            className="hidden sm:grid sm:grid-cols-3 gap-3"
                            style={{ gridTemplateRows: "280px 280px 200px" }}
                        >
                            <GalleryCard
                                item={item1}
                                priority
                                className="col-span-2 row-span-2"
                            />
                            <GalleryCard item={item2} />
                            <GalleryCard item={item3} />
                            <GalleryCard item={item4} />
                            <GalleryCard item={item5} />
                            <ViewAllCard item={item6} />
                        </div>
                    </>
                )}
            </FadeUpWrapper>
        </section>
    );
};
export default GallerySection;