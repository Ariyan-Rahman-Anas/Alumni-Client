"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Masonry from "react-masonry-css";
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { useGetUserProfileQuery } from "@/redux/apis/userApi";
import {
    GalleryImage,
    useGetImagesByContributorQuery,
} from "@/redux/apis/galleryApi";
import { constantsData } from "@/constants";
import {
    RiCalendarLine,
    RiDropLine,
    RiGlobalLine,
    RiGroupLine,
    RiMapPinLine,
    RiMedalLine,
    RiZoomInLine,
} from "react-icons/ri";
import GoBackward from "@/components/shared/GoBackward";

/* ── helpers ──────────────────────────────────────────────── */
const getInitials = (name: string) =>
    name
        .split(" ")
        .slice(0, 2)
        .map((n) => n[0])
        .join("")
        .toUpperCase();

const getCategoryName = (img: GalleryImage) =>
    typeof img.category === "object" && img.category !== null
        ? img.category.name
        : "";

/* ── Contributor masonry grid with cursor pagination ──────── */
const ContributorMasonryGrid = ({
    userId,
    onImageClick,
}: {
    userId: string;
    onImageClick: (img: GalleryImage) => void;
}) => {
    const masonryBreakpoints = { default: 3, 1024: 3, 768: 2, 640: 1 };
    const [cursor, setCursor] = useState<string | undefined>(undefined);
    const [allImages, setAllImages] = useState<GalleryImage[]>([]);

    const { data, isFetching } = useGetImagesByContributorQuery(
        { userId, cursor, limit: constantsData.GALLERY_PAGE_SIZE },
        {
            refetchOnMountOrArgChange: false,
            skip: !userId,
        }
    );

    const hasMore = data?.meta?.hasMore ?? false;
    const nextCursor = data?.meta?.nextCursor ?? null;

    // append on load
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
        <div>
            {isFetching && allImages.length === 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div
                            key={i}
                            className="aspect-[4/5] animate-pulse rounded-2xl bg-gray-100"
                        />
                    ))}
                </div>
            ) : allImages.length === 0 && !isFetching ? (
                <p className="py-12 text-center text-sm text-muted-foreground">
                    No published photos yet.
                </p>
            ) : (
                <Masonry
                    breakpointCols={masonryBreakpoints}
                    className="masonry-grid"
                    columnClassName="masonry-grid_column"
                >
                    {allImages.map((img) => (
                        <div
                            key={img._id}
                            className="group relative overflow-hidden rounded-2xl border border-surface-300/60 bg-surface mb-3 cursor-pointer"
                            onClick={() => onImageClick(img)}
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
                        </div>
                    ))}
                </Masonry>
            )}

            {hasMore && (
                <div className="mt-8 flex justify-center">
                    <PrimaryButton
                        title={isFetching ? "Showing…" : "Show More"}
                        isLoading={isFetching}
                        isDisabled={isFetching}
                        onClick={() => {
                            if (nextCursor) setCursor(nextCursor);
                        }}
                    />
                </div>
            )}

            {!hasMore && allImages.length > constantsData.GALLERY_PAGE_SIZE && (
                <div className="mt-8 flex flex-col items-center gap-3">
                    <p className="text-sm text-muted-foreground">
                        You have reached the end of this contributor&apos;s gallery.
                    </p>
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
        </div>
    );
};

/* ── Detail chip ──────────────────────────────────────────── */
const DetailChip = ({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string;
}) => (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-surface-300 bg-surface-50 px-3 py-1.5 text-xs font-medium text-primary2-700">
        <span className="text-primary2-500">{icon}</span>
        {label}
    </span>
);

/* ── Main component ───────────────────────────────────────── */
const ContributorPage = ({ userId }: { userId: string }) => {
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

    const { data: userRes, isLoading: userLoading } = useGetUserProfileQuery(userId);
    const user = userRes?.data;

    return (
        <div className="three-xl-section-setup pb-20 space-y-12">
            {/* ── Back */}
            <GoBackward text="Gallery" />

            {/* ── User Profile Card ─────────────────────────────────── */}
            <FadeUpWrapper delay={0.1}>
                {userLoading ? (
                    <div className="flex gap-5 items-start">
                        <div className="h-20 w-20 rounded-full animate-pulse bg-gray-200 shrink-0" />
                        <div className="space-y-2 flex-1">
                            <div className="h-6 w-48 rounded animate-pulse bg-gray-200" />
                            <div className="h-4 w-72 rounded animate-pulse bg-gray-100" />
                        </div>
                    </div>
                ) : user ? (
                    <div className="rounded-2xl border border-surface-300/60 bg-surface p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            {/* Avatar */}
                            <Avatar className="h-20 w-20 border-4 border-primary2-100 shrink-0">
                                <AvatarImage src={user.imageUrl} alt={user.name} />
                                <AvatarFallback className="bg-primary2-100 text-primary2-800 font-bold text-2xl">
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl sm:text-3xl font-bold text-primary2-900">
                                    {user.name}
                                </h1>
                                {(user.workplace || user.position) && (
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {[user.position, user.workplace]
                                            .filter(Boolean)
                                            .join(" · ")}
                                    </p>
                                )}

                                {/* Chips */}
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {user.batch && (
                                        <DetailChip
                                            icon={<RiMedalLine />}
                                            label={`Batch ${user.batch}`}
                                        />
                                    )}
                                    {user.section && (
                                        <DetailChip
                                            icon={<RiGroupLine />}
                                            label={user.section}
                                        />
                                    )}
                                    {user.bloodGroup && (
                                        <DetailChip
                                            icon={<RiDropLine />}
                                            label={user.bloodGroup}
                                        />
                                    )}
                                    {user.country && (
                                        <DetailChip
                                            icon={<RiGlobalLine />}
                                            label={user.country}
                                        />
                                    )}
                                    {user.currentAddress && (
                                        <DetailChip
                                            icon={<RiMapPinLine />}
                                            label={user.currentAddress}
                                        />
                                    )}
                                    {user.dob && (
                                        <DetailChip
                                            icon={<RiCalendarLine />}
                                            label={new Date(user.dob).toLocaleDateString("en-US", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">User not found.</p>
                )}
            </FadeUpWrapper>

            {/* ── Photos ───────────────────────────────────────────── */}
            <FadeUpWrapper delay={0.2}>
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-primary2-900">
                        {user ? `${user.name.split(" ")[0]}'s Photos` : "Photos"}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Published contributions to the BAMHS photo archive.
                    </p>
                </div>
                <ContributorMasonryGrid
                    userId={userId}
                    onImageClick={setSelectedImage}
                />
            </FadeUpWrapper>

            {/* ── Image Dialog ──────────────────────────────────────── */}
            <Dialog
                open={!!selectedImage}
                onOpenChange={(open) => {
                    if (!open) setSelectedImage(null);
                }}
            >
                <DialogContent
                    className="w-full min-w-[90vw] p-0 overflow-hidden bg-black/95 border-none"
                dialogCloseClassName="text-danger border-2 border-danger hover:bg-surface hover:text-danger hover:border-surface"
                >
                    <DialogTitle className="sr-only">
                        {selectedImage?.innerTitle || selectedImage?.title || "Image Preview"}
                    </DialogTitle>
                    {selectedImage && (
                        <div className="relative">
                            <Image
                                src={selectedImage.imageUrl}
                                alt={selectedImage.innerTitle || selectedImage.title}
                                width={1200}
                                height={900}
                                className="w-full h-auto max-h-[85vh] object-contain"
                            />
                            {(selectedImage.innerTitle || selectedImage.title) && (
                                <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-white text-sm font-medium">
                                        {selectedImage.innerTitle || selectedImage.title}
                                    </p>
                                    {typeof selectedImage.category === "object" && (
                                        <p className="text-white/60 text-xs mt-0.5">
                                            {selectedImage.category.name}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ContributorPage;
