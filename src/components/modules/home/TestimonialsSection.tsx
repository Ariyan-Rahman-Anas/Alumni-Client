"use client";

import { useEffect, useRef, useState } from "react";
import { FadeUpWrapper } from "@/components/Pages/Home/HomePage";
import { motion } from "framer-motion";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import { RiDoubleQuotesL} from "react-icons/ri";
import { BsStarFill } from "react-icons/bs";
import SectionLabel from "@/components/shared/SectionLabel";

const testimonials = [
    {
        quote: "BAMHS shaped who I am. The values I learned in those classrooms still guide every decision I make as a doctor today.",
        name: "Dr. Rafiqul Islam",
        batch: "Batch of 1998",
        role: "Senior Physician, Dhaka Medical College",
    },
    {
        quote: "No matter where life took me, BAMHS always felt like home. The friendships forged here are for a lifetime.",
        name: "Nasrin Akter",
        batch: "Batch of 2005",
        role: "Software Engineer, Dubai",
    },
    {
        quote: "My teachers at BAMHS didn't just teach subjects — they taught us how to stand tall with dignity and purpose.",
        name: "Md. Karim Hossain",
        batch: "Batch of 1992",
        role: "Entrepreneur, Chittagong",
    },
    {
        quote: "The school's annual sports day and cultural programs made us who we are. I owe everything to BAMHS.",
        name: "Sadia Rahman",
        batch: "Batch of 2010",
        role: "Teacher, Cumilla Govt. College",
    },
];

/* Gradient colours per card for the avatar ring */
const avatarGradients = [
    "linear-gradient(135deg, #2E8B57, #4DB472)",
    "linear-gradient(135deg, #257048, #72C48C)",
    "linear-gradient(135deg, #1A5436, #2E8B57)",
    "linear-gradient(135deg, #4DB472, #9DD8AE)",
];

const TestimonialsSection = () => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    /* Track selected slide */
    useEffect(() => {
        if (!api) return;
        const onSelect = () => setCurrent(api.selectedScrollSnap());
        api.on("select", onSelect);
        return () => { api.off("select", onSelect); };
    }, [api]);

    /* Autoplay — pauses on hover/focus */
    useEffect(() => {
        if (!api) return;
        if (isPaused) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            return;
        }
        intervalRef.current = setInterval(() => api.scrollNext(), 5000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [api, isPaused]);

    return (
        <section
            className="relative overflow-hidden"
            style={{ background: "linear-gradient(160deg, #071F14 0%, #0A3D2B 45%, #0F3C24 100%)" }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* ── Decorative grid ───────────────────────────────── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(46,139,87,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.06) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                }}
            />

            {/* ── Ambient glowing orbs ──────────────────────────── */}
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

            {/* ── Decorative large background quote ─────────────── */}
            <RiDoubleQuotesL
                className="absolute top-6 right-6 sm:top-10 sm:right-10 pointer-events-none select-none"
                style={{
                    fontSize: "clamp(6rem, 12vw, 11rem)",
                    color: "rgba(46,139,87,0.07)",
                    lineHeight: 1,
                }}
            />

            {/* ── Main content ──────────────────────────────────── */}
            <div className="three-xl-section-setup relative z-10">

                {/* Header */}
                <FadeUpWrapper className="text-center mb-14">
                    <SectionLabel text="Alumni Voices" className="text-primary2-100" icon={<RiDoubleQuotesL />} />
                    <h2
                        className="section-heading mt-6"
                        style={{ color: "var(--color-primary-50)" }}
                    >
                        What BAMHSians Say
                    </h2>
                    <p
                        className="mt-4 text-sm sm:text-base max-w-xl mx-auto leading-relaxed"
                        style={{ color: "var(--color-primary-400)" }}
                    >
                        Voices from across decades — sharing the legacy that BAMHS instilled in every student.
                    </p>
                </FadeUpWrapper>

                {/* Carousel */}
                <FadeUpWrapper delay={0.15}>
                    <Carousel
                        setApi={setApi}
                        opts={{ loop: true, align: "center" }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-4 sm:-ml-6">
                            {testimonials.map((t, i) => (
                                <CarouselItem
                                    key={i}
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
                                                <RiDoubleQuotesL
                                                    className="text-lg sm:text-xl"
                                                    style={{ color: "var(--color-primary-400)" }}
                                                />
                                            </div>
                                            <div className="flex items-center gap-0.5 mt-1">
                                                {Array.from({ length: 5 }).map((_, s) => (
                                                    <BsStarFill
                                                        key={s}
                                                        className="text-xs"
                                                        style={{ color: "var(--color-gold-500)" }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Quote */}
                                        <p
                                            className="font-serif italic text-base sm:text-lg md:text-xl leading-relaxed flex-1"
                                            style={{ color: "var(--color-primary-100)" }}
                                        >
                                            &ldquo;{t.quote}&rdquo;
                                        </p>

                                        {/* Divider */}
                                        <div
                                            className="h-px w-full"
                                            style={{
                                                background: "linear-gradient(90deg, transparent, rgba(46,139,87,0.35), transparent)",
                                            }}
                                        />

                                        {/* Author */}
                                        <div className="flex items-center gap-4">
                                            <div
                                                className="w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0"
                                                style={{
                                                    background: avatarGradients[i % avatarGradients.length],
                                                    color: "#FDFAF2",
                                                    boxShadow: "0 0 0 3px rgba(46,139,87,0.25), 0 0 0 6px rgba(46,139,87,0.08)",
                                                    minWidth: "2.75rem",
                                                    minHeight: "2.75rem",
                                                }}
                                            >
                                                {t.name.charAt(0)}
                                            </div>
                                            <div className="min-w-0">
                                                <p
                                                    className="font-semibold text-sm sm:text-base leading-tight truncate"
                                                    style={{ color: "var(--color-primary-100)" }}
                                                >
                                                    {t.name}
                                                </p>
                                                <p
                                                    className="text-xs mt-0.5 truncate"
                                                    style={{ color: "var(--color-primary-400)" }}
                                                >
                                                    {t.batch}&nbsp;·&nbsp;{t.role}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>

                        <div className="flex items-center justify-center gap-5 mt-8 sm:mt-10">
                            <CarouselPrevious
                                className="static translate-y-0 h-10 w-10 rounded-full transition-colors duration-200 text-primary2-100 bg-primary2-500 hover:bg-primary2-600 hover:text-surface"
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
                                            background:
                                                i === current
                                                    ? "var(--color-primary-400)"
                                                    : "rgba(46,139,87,0.30)",
                                            boxShadow:
                                                i === current
                                                    ? "0 0 8px rgba(77,180,114,0.6)"
                                                    : "none",
                                        }}
                                    />
                                ))}
                            </div>

                            <CarouselNext
                                className="static translate-y-0 h-10 w-10 rounded-full transition-colors duration-200 text-primary2-100 bg-primary2-500 hover:bg-primary2-600 hover:text-surface"
                            />
                        </div>

                    </Carousel>
                </FadeUpWrapper>
            </div>
        </section>
    );
};
export default TestimonialsSection;