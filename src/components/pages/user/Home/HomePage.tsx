"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import StatsSection from "@/components/modules/user/home/StatsSection";
import AboutSection from "@/components/modules/user/home/AboutSection";
import BatchesSection from "@/components/modules/user/home/BatchesSection";
import EventsSection from "@/components/modules/user/home/EventsSection";
import TestimonialsSection from "@/components/modules/user/home/TestimonialsSection";
import GallerySection from "@/components/modules/user/home/GallerySection";
import BloodSection from "@/components/modules/user/home/BloodSection";
import HomePageCTA from "@/components/modules/user/home/HomePageCTA";
import HeroSection from "@/components/modules/user/home/HeroSection";

/* ── Fade-up wrapper ──────────────────────────────────────── */
export const FadeUpWrapper = ({
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
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? "visible" : "hidden"}
            variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0 },
            }}
            transition={{
                duration: 0.7,
                delay,
                ease: [0.19, 1, 0.22, 1],
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};


const HomePage = () => {
    return (
        <div className="overflow-x-hidden space-y-10 pb-10">
            {/* ══ 1. HERO ══════════════════════════════════════════ */}
            <HeroSection />

            {/* ══ 2. STATS ══════════════════════════════════════════ */}
            <StatsSection />


            {/* ══ 3. ABOUT / MISSION ════════════════════════════════ */}
            <AboutSection />

            {/* ══ 4. BATCHES ════════════════════════════════════════ */}
            <BatchesSection />


            {/* ══ 5. EVENTS ═════════════════════════════════════════ */}
            <EventsSection />


            {/* ══ 6. TESTIMONIAL SLIDER ════════════════════════════ */}
            <TestimonialsSection />


            {/* ══ 7. GALLERY PREVIEW ════════════════════════════════ */}
            <GallerySection />


            {/* ══ 8. BLOOD BANK CTA ═════════════════════════════════ */}
            <BloodSection />


            {/* ══ 9. FINAL CTA ══════════════════════════════════════ */}
            <HomePageCTA />
        </div>
    )
}
export default HomePage