import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import { motion } from "framer-motion";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import { RiDoubleQuotesL } from "react-icons/ri";
import { BsStarFill } from "react-icons/bs";
import SectionLabel from "@/components/shared/SectionLabel";
import { useGetApprovedTestimonialsQuery } from "@/redux/apis/testimonialApi";
import type { ITestimonial, ITestimonialUser } from "@/types/common/testimonial.types";
import { useGetWebsiteManagementQuery } from "@/redux/apis/websiteManagementApi";

function getUser(t: ITestimonial): ITestimonialUser | null {
    if (!t.userId || typeof t.userId === "string") return null;
    return t.userId as ITestimonialUser;
}

const TestimonialsSection = () => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const { data, isLoading } = useGetApprovedTestimonialsQuery();
    const testimonials = data?.data ?? [];

    /* Track selected slide */
    useEffect(() => {
        if (!api) return;
        const onSelect = () => setCurrent(api.selectedScrollSnap());
        api.on("select", onSelect);
        return () => { api.off("select", onSelect); };
    }, [api]);

    /* Autoplay ” pauses on hover/focus */
    useEffect(() => {
        if (!api) return;
        if (isPaused) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }
        intervalRef.current = setInterval(() => api.scrollNext(), 5000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [api, isPaused]);

    const { data: websiteManagement } = useGetWebsiteManagementQuery();
    const { schoolName } = websiteManagement?.data || {};

    const schoolShortName = schoolName?.split(" ")?.map((word: string) => word[0]).join("") || "BAMHS";
    const alumniName = `${schoolShortName}ian`;

    return (
        <section
            className="relative overflow-hidden"
            style={{ background: "linear-gradient(160deg, #071F14 0%, #0A3D2B 45%, #0F3C24 100%)" }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* ”” Decorative grid */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(46,139,87,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.06) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* ”” Ambient glowing orbs  */}
            <div
                className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
                style={{
                    background: "radial-gradient(circle, rgba(46,139,87,0.18) 0%, transparent 70%)",
                    filter: "blur(40px)",
                }}
            />
            <div
                className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
                style={{
                    background: "radial-gradient(circle, rgba(77,180,114,0.15) 0%, transparent 70%)",
                    filter: "blur(36px)",
                }}
            />
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{
                    background: "radial-gradient(circle, rgba(46,139,87,0.06) 0%, transparent 65%)",
                    filter: "blur(60px)",
                }}
            />

            {/* ”” Decorative large background quote  */}
            <RiDoubleQuotesL
                className="absolute top-6 right-6 sm:top-10 sm:right-10 pointer-events-none select-none"
                style={{
                    fontSize: "clamp(6rem, 12vw, 11rem)",
                    color: "rgba(46,139,87,0.07)",
                    lineHeight: 1,
                }}
            />

            {/* ”” Main content */}
            <div className="three-xl-section-setup relative z-10">

                {/* Header */}
                <FadeUpWrapper className="text-center mb-14">
                    <SectionLabel
                        text="Alumni Voices"
                        className="text-primary2-100 border-primary2-700 dark:text-gunmetal-300 dark:border-gunmetal-500 "
                        icon={<RiDoubleQuotesL />} />
                    <h2
                        className="section-heading-text-center text-white dark:text-gunmetal-200 mt-5">
                        What {alumniName}s Say
                    </h2>
                    <p
                        className="mt-4 text-sm sm:text-base max-w-xl mx-auto leading-relaxed text-primary2-400 dark:text-gunmetal-300 ">
                        Voices from across decades sharing the legacy that {schoolShortName} instilled in every student.
                    </p>
                </FadeUpWrapper>

                {/* Loading skeleton */}
                {isLoading && (
                    <div className="flex justify-center">
                        <div className="w-full max-w-2xl h-64 rounded-3xl animate-pulse" style={{ background: "rgba(46,139,87,0.10)", border: "1px solid rgba(46,139,87,0.22)" }} />
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && testimonials.length === 0 && (
                    <p className="text-center text-primary2-400 text-sm py-10">No testimonials yet.</p>
                )}

                {/* Carousel */}
                {!isLoading && testimonials.length > 0 && (
                    <FadeUpWrapper delay={0.15}>
                        <Carousel
                            setApi={setApi}
                            opts={{ loop: true, align: "center" }}
                            className="w-full"
                        >
                            <CarouselContent className="-ml-4 sm:-ml-6">
                                {testimonials.map((t, i) => {
                                    const user = getUser(t);
                                    const batchLabel = user?.batch ? `Batch of ${user.batch}` : "";
                                    const roleLabel = [user?.position, user?.workplace].filter(Boolean).join(" @ ") || user?.country || "";
                                    const displayName = user?.name ?? alumniName;
                                    return (
                                        <CarouselItem
                                            key={t._id}
                                            className="pl-4 sm:pl-6 basis-full sm:basis-[85%] md:basis-[75%] lg:basis-[60%]"
                                        >
                                            <motion.div
                                                animate={{
                                                    scale: i === current ? 1 : 0.95,
                                                    opacity: i === current ? 1 : 0.55,
                                                }}
                                                transition={{ duration: 0.4, ease: "easeOut" }}
                                                className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 h-full flex flex-col gap-6 cursor-grab active:cursor-grabbing"
                                                style={{
                                                    background: "linear-gradient(145deg, rgba(46,139,87,0.10) 0%, rgba(46,139,87,0.04) 100%)",
                                                    border: "1px solid rgba(46,139,87,0.22)",
                                                    boxShadow:
                                                        i === current
                                                            ? "0 8px 32px rgba(0,0,0,0.35), 0 0 48px rgba(46,139,87,0.12), inset 0 1px 0 rgba(255,255,255,0.06)"
                                                            : "0 4px 16px rgba(0,0,0,0.2)",
                                                    backdropFilter: "blur(12px)",
                                                }}
                                            >
                                                {/* Top row: quote icon + stars */}
                                                <div className="flex items-start justify-between gap-4">
                                                    <div
                                                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                                        style={{
                                                            background: "rgba(46,139,87,0.20)",
                                                            border: "1px solid rgba(46,139,87,0.30)",
                                                        }}
                                                    >
                                                        <RiDoubleQuotesL className="text-lg sm:text-xl text-primary2-500" />
                                                    </div>
                                                    <div className="flex items-center gap-0.5 mt-1">
                                                        {Array.from({ length: 5 }).map((_, s) => (
                                                            <BsStarFill
                                                                key={s}
                                                                className="text-xs"
                                                                style={{ color: s < t.rating ? "var(--color-gold-500)" : "rgba(255,255,255,0.15)" }}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Quote */}
                                                <p className="font-serif italic text-base sm:text-lg md:text-xl leading-relaxed text-center flex-1 text-primary2-100 dark:text-gunmetal-300">
                                                    &ldquo;{t.quote}&rdquo;
                                                </p>

                                                {/* Divider */}
                                                <div
                                                    className="h-px w-full"
                                                    style={{ background: "linear-gradient(90deg, transparent, rgba(46,139,87,0.35), transparent)" }}
                                                />

                                                {/* Author */}
                                                <div className="flex items-center gap-4">
                                                    {user?.imageUrl ? (
                                                        <Image
                                                            src={user.imageUrl}
                                                            alt={displayName}
                                                            width={44}
                                                            height={44}
                                                            className="rounded-full object-cover shrink-0 w-11 h-11"
                                                        />
                                                    ) : (
                                                        <div className="w-11 min-w-[2.75rem] h-11 min-h-[2.75rem] rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 bg-primary2-500 text-white shadow">
                                                            {displayName.charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-sm sm:text-base leading-tight truncate text-primary2-100 dark:text-gunmetal-300">
                                                            {displayName}
                                                        </p>
                                                        <p className="text-xs mt-0.5 truncate text-primary2-400 dark:text-gunmetal-300">
                                                            {[batchLabel, roleLabel].filter(Boolean).join(" · ")}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        </CarouselItem>
                                    );
                                })}
                            </CarouselContent>

                            <div className="flex items-center justify-center gap-5 mt-8 sm:mt-10">
                                <CarouselPrevious
                                    className="static translate-y-0 h-10 w-10 rounded-full transition-colors duration-200 text-primary2-100 bg-primary2-500 hover:bg-primary2-600 dark:bg-gunmetal-300 dark:hover:bg-primary hover:text-surface"
                                />

                                {/* Dots */}
                                <div className="flex items-center gap-2">
                                    {testimonials.map((_, i) => (
                                        <button
                                            key={i}
                                            aria-label={`Go to testimonial ${i + 1}`}
                                            onClick={() => api?.scrollTo(i)}
                                            className="rounded-full transition-all duration-300 focus-visible:outline-none"
                                            style={{
                                                width: i === current ? "28px" : "8px",
                                                height: "8px",
                                                background: i === current ? "rgba(77,180,114,1)" : "rgba(77,180,114,0.35)",
                                                boxShadow: i === current ? "0 0 8px rgba(77,180,114,0.6)" : "none",
                                            }}
                                        />
                                    ))}
                                </div>

                                <CarouselNext
                                    className="static translate-y-0 h-10 w-10 rounded-full transition-colors duration-200 text-primary2-100 bg-primary2-500 hover:bg-primary2-600 dark:bg-gunmetal-300 dark:hover:bg-primary hover:text-surface"
                                />
                            </div>
                        </Carousel>
                    </FadeUpWrapper>
                )}
            </div>
        </section>
    );
};
export default TestimonialsSection;
