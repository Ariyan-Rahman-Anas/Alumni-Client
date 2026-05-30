"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
    RiDeleteBin4Line,
    RiGalleryLine,
    RiLoader4Line,
    RiCheckboxCircleLine,
    RiTimeLine,
    RiInformationLine,
} from "react-icons/ri";
import { useGetMyGalleryImagesQuery, useDeleteMyGalleryImageMutation } from "@/redux/apis/galleryApi";
import type { GalleryImage } from "@/redux/apis/galleryApi";
import UserContributeGallerySheet from "@/components/modules/user/gallery/UserContributeGallerySheet";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { cn } from "@/lib/utils";
import DateFormatter from "@/lib/DateFormatter";

const MyContributionsPanel = () => {
    const [contributeOpen, setContributeOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const { data, isLoading } = useGetMyGalleryImagesQuery();
    const [deleteImage] = useDeleteMyGalleryImageMutation();

    const images: GalleryImage[] = data?.data ?? [];

    const handleDelete = async (img: GalleryImage) => {
        if (!confirm(`Delete "${img.innerTitle || img.title}"? This cannot be undone.`)) return;
        setDeletingId(img._id);
        try {
            const res = await deleteImage(img._id).unwrap();
            toast.success(res.message ?? "Image deleted");
        } catch {
            /* rtkQueryErrorLogger handles toast */
        } finally {
            setDeletingId(null);
        }
    };

    const getCategoryName = (img: GalleryImage) =>
        typeof img.category === "object" ? img.category.name : "";

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-3xl border border-surface-300/50 bg-surface p-6 sm:p-8"
        >
            {/* Header */}
            <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-primary2-600">Gallery</p>
                    <h2 className="mt-1 text-xl font-semibold text-primary2-900">My Contributions</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Photos you submitted to the BAMHS gallery archive.
                    </p>
                </div>
                <PrimaryButton title="Submit Photos" onClick={() => setContributeOpen(true)} />
            </div>

            {/* Info banner */}
            <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-3 text-xs text-amber-800">
                <RiInformationLine className="flex-shrink-0 mt-0.5 text-base" />
                Unpublished photos are under admin review and not visible to other users yet.
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                    <RiLoader4Line className="animate-spin text-3xl text-primary2-600" />
                </div>
            ) : images.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-surface-400/70 bg-white/30 p-10 text-center">
                    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary2-100 text-primary2-700 text-2xl">
                        <RiGalleryLine />
                    </span>
                    <h3 className="mt-3 text-base font-semibold text-primary2-900">No contributions yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Submit your BAMHS memories to enrich the alumni photo archive.
                    </p>
                    <PrimaryButton title="Submit Photos" className="mt-4" onClick={() => setContributeOpen(true)} />
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {images.map((img) => {
                        const isDeleting = deletingId === img._id;
                        return (
                            <div
                                key={img._id}
                                className={cn(
                                    "group relative rounded-2xl border overflow-hidden bg-white transition-shadow",
                                    img.isPublished
                                        ? "border-surface-200 hover:shadow-md"
                                        : "border-amber-200 bg-amber-50/30"
                                )}
                            >
                                {/* Image */}
                                <div className="relative w-full aspect-[4/3] overflow-hidden bg-surface-100">
                                    <Image
                                        src={img.imageUrl}
                                        alt={img.innerTitle || img.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 640px) 100vw, 50vw"
                                    />
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="min-w-0">
                                            <p className="font-medium text-sm text-primary2-900 truncate">
                                                {img.innerTitle || img.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {getCategoryName(img)}
                                            </p>
                                        </div>
                                        {/* Published badge */}
                                        <span
                                            className={cn(
                                                "flex-shrink-0 inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border",
                                                img.isPublished
                                                    ? "bg-primary2-50 text-primary2-700 border-primary2-200"
                                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                            )}
                                        >
                                            {img.isPublished ? (
                                                <><RiCheckboxCircleLine /> Published</>
                                            ) : (
                                                <><RiTimeLine /> Pending</>
                                            )}
                                        </span>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <p className="text-xs text-muted-foreground">
                                            <DateFormatter date={img.createdAt} />
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(img)}
                                            disabled={isDeleting}
                                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors"
                                        >
                                            {isDeleting ? (
                                                <RiLoader4Line className="animate-spin" />
                                            ) : (
                                                <RiDeleteBin4Line />
                                            )}
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <UserContributeGallerySheet open={contributeOpen} onClose={() => setContributeOpen(false)} />
        </motion.div>
    );
};

export default MyContributionsPanel;
