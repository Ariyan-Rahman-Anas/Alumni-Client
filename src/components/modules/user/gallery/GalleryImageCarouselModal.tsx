"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext,
    type CarouselApi,
} from "@/components/ui/carousel";
import type { GalleryImage } from "@/redux/apis/galleryApi";

interface GalleryImageCarouselModalProps {
    images: GalleryImage[];
    startIndex: number;
    open: boolean;
    onClose: () => void;
}

const GalleryImageCarouselModal = ({
    images,
    startIndex,
    open,
    onClose,
}: GalleryImageCarouselModalProps) => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(startIndex);

    // Track slide changes for the counter
    useEffect(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap());
        const onSelect = () => setCurrent(api.selectedScrollSnap());
        api.on("select", onSelect);
        return () => { api.off("select", onSelect); };
    }, [api]);

    const currentImage = images[current];

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent
                className="w-full min-w-[90vw] p-0 overflow-hidden bg-black/95 border-none"
                dialogCloseClassName="text-white/70 border border-white/20 hover:bg-white/10 hover:text-white hover:border-white/40"
            >
                <DialogTitle className="sr-only">
                    {currentImage?.innerTitle || currentImage?.title || "Image Preview"}
                </DialogTitle>

                <div className="relative">
                    {/* key forces embla to remount at the correct startIndex on each open */}
                    <Carousel
                        key={`${startIndex}-${open}`}
                        setApi={setApi}
                        opts={{ startIndex, loop: false }}
                        className="w-full"
                    >
                        <CarouselContent>
                            {images.map((img) => (
                                <CarouselItem key={img._id} className="relative select-none">
                                    <Image
                                        src={img.imageUrl}
                                        alt={img.innerTitle || img.title}
                                        width={1200}
                                        height={900}
                                        className="w-full h-auto max-h-[85vh] object-contain"
                                        draggable={false}
                                    />
                                    {(img.innerTitle || img.title) && (
                                        <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-black/80 to-transparent">
                                            <p className="text-white text-sm font-medium">
                                                {img.innerTitle || img.title}
                                            </p>
                                            {typeof img.category === "object" && (
                                                <p className="text-white/60 text-xs mt-0.5">
                                                    {img.category.name}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <CarouselPrevious className="left-4 text-white border-white/30 bg-black/50 hover:bg-black/70 hover:text-white hover:border-white/50 disabled:opacity-20" />
                        <CarouselNext className="right-4 text-white border-white/30 bg-black/50 hover:bg-black/70 hover:text-white hover:border-white/50 disabled:opacity-20" />
                    </Carousel>

                    {/* Slide counter */}
                    {images.length > 1 && (
                        <div className="absolute bottom-4 right-5 text-xs text-white/70 font-medium bg-black/50 px-2.5 py-1 rounded-full pointer-events-none">
                            {current + 1} / {images.length}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GalleryImageCarouselModal;
