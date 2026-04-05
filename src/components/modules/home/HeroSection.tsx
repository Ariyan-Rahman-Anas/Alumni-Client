"use client"

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { RiArrowRightLine } from "react-icons/ri";
import { staticImages } from "@/assets";

const HeroSection = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

    return (
        <section
            ref={heroRef}
            className="relative h-[100dvh] w-full overflow-hidden"
        >
            {/* ── Background Image with parallax ── */}
            <motion.div style={{ y: heroY }} className="absolute inset-0">
                <Image
                    src={staticImages.bamhsBackground}
                    alt="BAMHS School Ground"
                    fill
                    priority
                    className="object-cover object-[center_30%]"
                />
            </motion.div>

            {/* ── Cinematic gradient overlay ── */}
            <div className="absolute inset-0 bg-gradient-to-b
        from-[#051F15]/75
        via-[#0A3D2B]/55
        to-[#051F15]/80"
            />

            {/* ── Subtle grid overlay ── */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(46,139,87,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(46,139,87,0.06) 1px, transparent 1px)`,
                    backgroundSize: "52px 52px",
                }}
            />

            {/* ── Ambient glows ── */}
            <div
                className="absolute -top-20 -left-20 w-[380px] h-[380px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(46,139,87,0.20) 0%, transparent 65%)" }}
            />
            <div
                className="absolute -bottom-16 -right-12 w-[300px] h-[300px] rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 65%)" }}
            />

            {/* ── Center content: school name + motto ── */}
            <motion.div
                style={{ opacity: heroOpacity }}
                className="relative z-10 h-full flex flex-col items-center justify-center gap-y-16 text-center px-6"
            >
                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.7 }}
                    style={{
                        lineHeight: 1.5,
                        color: "#FDFAF2",
                        marginBottom: "0.5rem",
                        textShadow: "0 2px 16px rgba(0,0,0,0.45)",
                    }}
                    className="font-splash hidden md:block md:text-7xl font-bold"
                >
                    {`Battali....Abdul....Matin....High....School`}
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15, duration: 0.7 }}
                    style={{
                        lineHeight: 1.5,
                        color: "#FDFAF2",
                        marginBottom: "0.5rem",
                        textShadow: "0 2px 16px rgba(0,0,0,0.45)",
                    }}
                    className="font-splash md:hidden text-xl font-bold"
                >
                    {`Battali....Abdul....Matin....High....School`}
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.9 }}
                    style={{
                        background: "linear-gradient(120deg, #72C48C 0%, #F59E0B 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        marginBottom: "1.5rem",
                        filter: "drop-shadow(0 1px 8px rgba(0,0,0,0.3))",
                    }}
                    className="font-extrabold text-4xl"
                >
                    Where We Learned to Dream.
                    <br />
                    Where We Come Back to Remember.
                </motion.h1>
            </motion.div>

            {/* ── Bottom content: paragraph + CTAs ── */}
            <motion.div
                style={{ opacity: heroOpacity }}
                className="absolute bottom-6 left-0 right-0 z-10
                           flex flex-col items-center text-center px-6 gap-6"
            >
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.45, duration: 0.8 }}
                    className="max-w-xl text-base md:text-lg leading-relaxed text-white/80"
                >
                    The official alumni network of Battali Abdul Matin High School —
                    reconnect with your batch, relive cherished memories, and keep the
                    bond alive across every generation.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55, duration: 0.7 }}
                    className="flex flex-col sm:flex-row gap-3"
                >
                    <Button
                        asChild
                        size="lg"
                        className="px-8 py-6 text-sm rounded-xl shadow-xl"
                    >
                        <Link href="/login">
                            Join the Community <RiArrowRightLine className="ml-1.5" />
                        </Link>
                    </Button>

                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="px-8 py-6 text-sm rounded-xl border-white/20
                       text-white bg-white/[0.06] backdrop-blur
                       hover:bg-white/[0.12]"
                    >
                        <Link href="/batches">Find Your Batch</Link>
                    </Button>
                </motion.div>
            </motion.div>

        </section>
    );
};

export default HeroSection;