import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import PrimaryButton from "@/components/shared/PrimaryButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { constantsData } from "@/constants";
import { GalleryImage, useGetPublishedImagesQuery } from "@/redux/apis/galleryApi";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { RiZoomInLine } from "react-icons/ri";
import Masonry from "react-masonry-css";

const GalleryPageMasonryGrid = () => {
    const router = useRouter();
    const masonryBreakpoints = { default: 3, 1024: 3, 768: 2, 640: 1 };

    /* ── Types ────────────────────────────────────────────────── */
    const getCategoryName = (img: GalleryImage): string => {
        if (typeof img.category === "object" && img.category !== null) return img.category.name;
        return "";
    };

    const getContributorInitials = (img: GalleryImage): string => {
        if (!img.uploadedBy?.name) return "?";
        return img.uploadedBy.name
            .split(" ")
            .slice(0, 2)
            .map((n: string) => n[0])
            .join("")
            .toUpperCase();
    };

    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [allImages, setAllImages] = useState<GalleryImage[]>([]);
    const [activeFilter, setActiveFilter] = useState<string>("All");

    const { data, isFetching } = useGetPublishedImagesQuery(
        { cursor, limit: constantsData.GALLERY_PAGE_SIZE },
        { refetchOnMountOrArgChange: false }
    );

    // Dynamic category filters from loaded images
    const uniqueCategories = [
        "All",
        ...Array.from(new Set(allImages.map(getCategoryName).filter(Boolean))),
    ];

    const nextCursor = data?.meta?.nextCursor ?? null;
    const hasMore = data?.meta?.hasMore ?? false;
    const handleLoadMore = () => {
        if (nextCursor) setCursor(nextCursor);
    };

    const handleFilterChange = (f: string) => {
        setActiveFilter(f);
    };

    const filtered =
        activeFilter === "All"
            ? allImages
            : allImages.filter((img) => getCategoryName(img) === activeFilter);

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

    return (
        <FadeUpWrapper delay={0.1}>
            <section>
                <FadeUpWrapper delay={0.15}>
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
                </FadeUpWrapper>

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
                            <FadeUpWrapper
                                key={img._id}
                                delay={idx % 6 * 0.05}
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
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="inline-flex items-center w-fit gap-1 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-1 text-xs text-white font-medium">
                                            <RiZoomInLine /> {getCategoryName(img)}
                                        </span>
                                        {img.uploadedBy && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            router.push(`/gallery/contributor/${img.uploadedBy._id}`);
                                                        }}
                                                        className="shrink-0 focus:outline-none"
                                                    >
                                                        <Avatar className="h-7 w-7 border-2 border-white/60 hover:border-white transition-all duration-200 hover:scale-110">
                                                            <AvatarImage
                                                                src={img.uploadedBy.imageUrl}
                                                                alt={img.uploadedBy.name}
                                                            />
                                                            <AvatarFallback className="bg-primary2-200 text-primary2-800 text-[10px] font-semibold">
                                                                {getContributorInitials(img)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                    </button>
                                                </TooltipTrigger>
                                                <TooltipContent side="top">
                                                    <p>{img.uploadedBy.name}</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </div>
                                </div>
                            </FadeUpWrapper>
                        ))}
                    </Masonry>
                )}

                {/* Load more */}
                {hasMore && (
                    <div className="mt-8 flex justify-center">
                        <PrimaryButton
                            title={isFetching ? "Showing…" : "Show More"}
                            isLoading={isFetching}
                            isDisabled={isFetching}
                            onClick={handleLoadMore}
                        />
                    </div>
                )}

                {/* show less */}
                {!hasMore && filtered.length > constantsData.GALLERY_PAGE_SIZE && (
                    <div className="mt-8 flex flex-col items-center justify-center gap-3">
                        <p>You have reached the end of the gallery.</p>
                        <PrimaryButton
                            variant="outline"
                            title={isFetching ? "Showing…" : "Show Less (Reset)"}
                            isLoading={isFetching}
                            isDisabled={isFetching}
                            onClick={() => {
                                setCursor(undefined);
                                setAllImages([]);
                            }}
                        />
                    </div>
                )}
            </section>
        </FadeUpWrapper>
    )
}
export default GalleryPageMasonryGrid