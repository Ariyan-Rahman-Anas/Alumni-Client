"use client";

import { motion } from "framer-motion";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface HorizontalSnapCarouselProps {
    title?: string;
    subtitle?: string;
    children: React.ReactNode[];
    itemBasis?: string;
    className?: string;
}

const HorizontalSnapCarousel = ({
    title,
    subtitle,
    children,
    itemBasis = "basis-[85%] sm:basis-[48%] lg:basis-[33%]",
    className,
}: HorizontalSnapCarouselProps) => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className={cn("space-y-5", className)}
        >
            {(title || subtitle) && (
                <div>
                    {title && (
                        <h3 className="text-xl font-bold text-primary2-900">{title}</h3>
                    )}
                    {subtitle && (
                        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                    )}
                </div>
            )}

            <Carousel
                opts={{ align: "start", loop: true }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {children.map((child, index) => (
                        <CarouselItem key={index} className={cn("pl-4", itemBasis)}>
                            {child}
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden sm:flex -left-4 border-primary2-200 bg-surface hover:bg-primary2-50 text-primary2-700" />
                <CarouselNext className="hidden sm:flex -right-4 border-primary2-200 bg-surface hover:bg-primary2-50 text-primary2-700" />
            </Carousel>
        </motion.section>
    );
};

export default HorizontalSnapCarousel;

