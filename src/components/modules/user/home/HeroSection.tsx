// "use client"

// import Image from "next/image";
// import { motion, useScroll, useTransform } from "framer-motion";
// import { useRef } from "react";
// import { staticImages } from "@/assets";
// import PrimaryButton from "@/components/shared/PrimaryButton";
// import { BsArrowRight } from "react-icons/bs";

// const HeroSection = () => {
//     const heroRef = useRef<HTMLDivElement>(null);
//     const { scrollYProgress } = useScroll({
//         target: heroRef,
//         offset: ["start start", "end start"],
//     });

//     const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
//     const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

//     return (
//         <section
//             ref={heroRef}
//             className="relative h-[100dvh] w-full overflow-hidden"
//         >
//             {/* ── Background Image with parallax ── */}
//             <motion.div style={{ y: heroY }} className="absolute inset-0">
//                 <Image
//                     src={staticImages.bamhsBackground}
//                     alt="BAMHS School Ground"
//                     fill
//                     priority
//                     className="object-cover object-[center_30%] scale-105"
//                 />
//             </motion.div>

//             {/* ── Rich layered cinematic overlay ── */}
//             <div className="absolute inset-0 bg-gradient-to-b
//                 from-[#020f08]/60
//                 via-[#051F15]/40
//                 to-[#020f08]/80"
//             />

//             {/* ── Warm vignette from sides ── */}
//             <div className="absolute inset-0 pointer-events-none"
//                 style={{
//                     background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 50%, #010c0566 100%)"
//                 }}
//             />

//             {/* ── Subtle grain texture for depth ── */}
//             <div
//                 className="absolute inset-0 pointer-events-none opacity-[0.035]"
//                 style={{
//                     backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
//                     backgroundRepeat: "repeat",
//                     backgroundSize: "128px 128px",
//                 }}
//             />

//             {/* ── Subtle grid overlay ── */}
//             <div
//                 className="absolute inset-0 pointer-events-none"
//                 style={{
//                     backgroundImage: `
//                         linear-gradient(rgba(46,139,87,0.04) 1px, transparent 1px),
//                         linear-gradient(90deg, rgba(46,139,87,0.04) 1px, transparent 1px)`,
//                     backgroundSize: "52px 52px",
//                 }}
//             />

//             {/* ── Ambient glows — richer & more layered ── */}
//             <div
//                 className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full pointer-events-none"
//                 style={{ background: "radial-gradient(circle, rgba(46,139,87,0.18) 0%, transparent 60%)" }}
//             />
//             <div
//                 className="absolute top-1/3 -left-32 w-[350px] h-[350px] rounded-full pointer-events-none"
//                 style={{ background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, transparent 65%)" }}
//             />
//             <div
//                 className="absolute -bottom-16 -right-12 w-[420px] h-[420px] rounded-full pointer-events-none"
//                 style={{ background: "radial-gradient(circle, rgba(245,158,11,0.14) 0%, transparent 65%)" }}
//             />
//             <div
//                 className="absolute top-1/4 right-0 w-[280px] h-[280px] rounded-full pointer-events-none"
//                 style={{ background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 65%)" }}
//             />

//             {/* ── Center content: school name + motto ── */}
//             <motion.div
//                 style={{ opacity: heroOpacity }}
//                 className="relative z-10 h-full flex flex-col-reverse items-center justify-end pt-34 gap-y-4 text-center px-4 md:px-6"
//             >
//                 <motion.p
//                     initial={{ opacity: 0, y: 16 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.15, duration: 0.7 }}
//                     style={{
//                         lineHeight: 1.15,
//                         marginBottom: "1.1rem",
//                         background: "linear-gradient(160deg, #f0fdf4 10%, #86efac 55%, #d1fae5 90%)",
//                         WebkitBackgroundClip: "text",
//                         WebkitTextFillColor: "transparent",
//                         backgroundClip: "text",
//                         filter: "drop-shadow(0 2px 24px rgba(46,139,87,0.35))",
//                     }}
//                     className="font-sanchez text-4xl md:text-7xl font-extrabold pb-1"
//                 >
//                     Battali Abdul Matin High School
//                 </motion.p>

//                 <motion.h1
//                     initial={{ opacity: 0, y: 28 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.35, duration: 0.9 }}
//                     className="font-semibold text-base uppercase md: tracking-[0.1rem] "
//                     style={{
//                         color: "rgba(253, 230, 138, 0.85)",
//                         textShadow: "0 0 32px rgba(245,158,11,0.3)",
//                     }}
//                 >
//                     Where We Learned to Dream.
//                     <br />
//                     Where We Come Back to Remember.
//                 </motion.h1>
//             </motion.div>

//             {/* ── Bottom content: paragraph + CTAs ── */}
//             <motion.div
//                 style={{ opacity: heroOpacity }}
//                 className="absolute bottom-6 left-0 right-0 z-10
//                            flex flex-col items-center text-center px-6 gap-6"
//             >
//                 <motion.p
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.45, duration: 0.8 }}
//                     className="max-w-xl text-base md:text-lg leading-relaxed"
//                     style={{ color: "rgba(220, 252, 231, 0.88)" }}
//                 >
//                     The official alumni network of Battali Abdul Matin High School —
//                     reconnect with your batch, relive cherished memories, and keep the
//                     bond alive across every generation.
//                 </motion.p>

//                 <motion.div
//                     initial={{ opacity: 0, y: 16 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.55, duration: 0.7 }}
//                     className="flex flex-col sm:flex-row gap-3"
//                 >
//                     <PrimaryButton
//                         type="button"
//                         title=" Join the Community"
//                         href="/login"
//                         className="px-8 py-6 text-sm rounded-lg shadow-xl"
//                         style={{
//                             background: "linear-gradient(135deg, #16a34a 0%, #15803d 60%, #166534 100%)",
//                             boxShadow: "0 0 32px rgba(22,163,74,0.45), 0 4px 16px rgba(0,0,0,0.4)",
//                             border: "1px solid rgba(74,222,128,0.25)",
//                         }}
//                         icon2={<BsArrowRight className="ml-2 text-lg" />}
//                         iconSide2="right"
//                     />
//                     <PrimaryButton
//                         type="button"
//                         variant="outline"
//                         title=" Find Your Batch"
//                         href="/batches"
//                         className="px-8 py-6 text-sm rounded-xl border-white/20
//                        text-white bg-white/[0.06] backdrop-blur
//                        hover:bg-surface duration-500"
//                         style={{
//                             borderColor: "rgba(255,255,255,0.15)",
//                             boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.3)",
//                         }}

//                     />
//                 </motion.div>
//             </motion.div>

//         </section>
//     );
// };
// export default HeroSection;















"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { staticImages } from "@/assets";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { BsArrowRight } from "react-icons/bs";

const HeroSection = () => {
    const heroRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    });

    // ── Cinematic transforms ──
    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
    const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
    const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

    return (
        <section
            ref={heroRef}
            className="relative h-[100dvh] w-full overflow-hidden bg-black"
        >
            {/* ───────── BACKGROUND ───────── */}
            <motion.div
                style={{ y: bgY, scale: bgScale }}
                className="absolute inset-0"
            >
                <Image
                    src={staticImages.bamhsBackground}
                    alt="BAMHS School Ground"
                    fill
                    priority
                    className="object-cover object-[center_30%] scale-105"
                />
            </motion.div>

            {/* ───────── CINEMATIC OVERLAY ───────── */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#051F15]/40 to-black/80" />

            {/* vignette */}
            <div className="absolute inset-0 pointer-events-none bg-radial-gradient" />

            {/* grain */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence baseFrequency=\'0.8\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
                }}
            />

            {/* floating ambient orbs */}
            <motion.div
                className="absolute top-20 left-20 w-[400px] h-[400px] rounded-full blur-3xl"
                style={{
                    background: "radial-gradient(circle, rgba(34,197,94,0.15), transparent)",
                }}
                animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
            />

            <motion.div
                className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full blur-3xl"
                style={{
                    background: "radial-gradient(circle, rgba(245,158,11,0.12), transparent)",
                }}
                animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
            />

            {/* ───────── CONTENT ───────── */}
            <motion.div
                style={{ opacity: contentOpacity, y: contentY }}
                className="relative z-10 h-full flex flex-col items-center justify-end pb-20 text-center px-4"
            >
                {/* TITLE */}
                <motion.p
                    initial={{ opacity: 0, y: 40, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                    className="font-sanchez text-4xl md:text-7xl font-extrabold"
                    style={{
                        background:
                            "linear-gradient(160deg, #f0fdf4 10%, #86efac 55%, #d1fae5 90%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        textShadow: "0 0 40px rgba(34,197,94,0.25)",
                    }}
                >
                    Battali Abdul Matin High School
                </motion.p>

                {/* SUBTITLE */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.9 }}
                    className="mt-4 text-sm md:text-base uppercase tracking-[0.2em] text-yellow-200/80"
                >
                    Where We Learned to Dream • Where We Return to Remember
                </motion.h2>

                {/* DESCRIPTION */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.9 }}
                    className="mt-6 max-w-xl text-white/80 leading-relaxed"
                >
                    The official alumni network — reconnect, relive memories, and stay
                    bonded across generations.
                </motion.p>

                {/* BUTTONS */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-8 flex flex-col sm:flex-row gap-3"
                >
                    <PrimaryButton
                        title="Join the Community"
                        href="/login"
                        className="px-8 py-6"
                        icon2={<BsArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />}
                        iconSide2="right"
                    />

                    <PrimaryButton
                        variant="outline"
                        title="Find Your Batch"
                        href="/batches"
                        className="px-8 py-6 bg-white/5 text-white backdrop-blur border-white/50 duration-300"
                    />
                </motion.div>
            </motion.div>
        </section>
    );
};

export default HeroSection;