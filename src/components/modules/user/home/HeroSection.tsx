// "use client";

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

//     // ── Cinematic transforms ──
//     const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
//     const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
//     const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
//     const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

//     return (
//         <section
//             ref={heroRef}
//             className="relative h-[100dvh] w-full overflow-hidden bg-black"
//         >
//             {/* ───────── BACKGROUND ───────── */}
//             <motion.div
//                 style={{ y: bgY, scale: bgScale }}
//                 className="absolute inset-0"
//             >
//                 <Image
//                     src={staticImages.bamhsBackground}
//                     alt="BAMHS School Ground"
//                     fill
//                     priority
//                     className="object-cover object-[center_30%] scale-105"
//                 />
//             </motion.div>

//             {/* ───────── CINEMATIC OVERLAY ───────── */}
//             <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-[#051F15]/40 to-black/80" />

//             {/* vignette */}
//             <div className="absolute inset-0 pointer-events-none bg-radial-gradient" />

//             {/* grain */}
//             <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
//                 style={{
//                     backgroundImage:
//                         'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence baseFrequency=\'0.8\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
//                 }}
//             />

//             {/* floating ambient orbs */}
//             <motion.div
//                 className="absolute top-20 left-20 w-[400px] h-[400px] rounded-full blur-3xl"
//                 style={{
//                     background: "radial-gradient(circle, rgba(34,197,94,0.15), transparent)",
//                 }}
//                 animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
//                 transition={{ duration: 8, repeat: Infinity }}
//             />

//             <motion.div
//                 className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full blur-3xl"
//                 style={{
//                     background: "radial-gradient(circle, rgba(245,158,11,0.12), transparent)",
//                 }}
//                 animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
//                 transition={{ duration: 10, repeat: Infinity }}
//             />

//             {/* ───────── CONTENT ───────── */}
//             <motion.div
//                 style={{ opacity: contentOpacity, y: contentY }}
//                 className="relative z-10 h-full flex flex-col items-center justify-end pb-20 text-center px-4"
//             >
//                 {/* TITLE */}
//                 <motion.p
//                     initial={{ opacity: 0, y: 40, scale: 0.98 }}
//                     animate={{ opacity: 1, y: 0, scale: 1 }}
//                     transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
//                     className="font-sanchez text-4xl md:text-7xl font-extrabold"
//                     style={{
//                         background:
//                             "linear-gradient(160deg, #f0fdf4 10%, #86efac 55%, #d1fae5 90%)",
//                         WebkitBackgroundClip: "text",
//                         WebkitTextFillColor: "transparent",
//                         textShadow: "0 0 40px rgba(34,197,94,0.25)",
//                     }}
//                 >
//                     Battali Abdul Matin High School
//                 </motion.p>

//                 {/* SUBTITLE */}
//                 <motion.h2
//                     initial={{ opacity: 0, y: 30 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.2, duration: 0.9 }}
//                     className="mt-4 text-sm md:text-base uppercase tracking-[0.2em] text-yellow-200/80"
//                 >
//                     Where We Learned to Dream • Where We Return to Remember
//                 </motion.h2>

//                 {/* DESCRIPTION */}
//                 <motion.p
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.35, duration: 0.9 }}
//                     className="mt-6 max-w-xl text-white/80 leading-relaxed"
//                 >
//                     The official alumni network — reconnect, relive memories, and stay
//                     bonded across generations.
//                 </motion.p>

//                 {/* BUTTONS */}
//                 <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ delay: 0.5 }}
//                     className="mt-8 flex flex-col sm:flex-row gap-3"
//                 >
//                     <PrimaryButton
//                         title="Join the Community"
//                         href="/login"
//                         className="px-8 py-6"
//                         icon2={<BsArrowRight className="ml-2 transition-transform group-hover:translate-x-1" />}
//                         iconSide2="right"
//                     />

//                     <PrimaryButton
//                         variant="outline"
//                         title="Find Your Batch"
//                         href="/batches"
//                         className="px-8 py-6 bg-white/5 text-white backdrop-blur border-white/50 duration-300"
//                     />
//                 </motion.div>
//             </motion.div>
//         </section>
//     );
// };

// export default HeroSection;














"use client"

import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { staticImages } from "@/assets"
import PrimaryButton from "@/components/shared/PrimaryButton"
import { BsArrowRight } from "react-icons/bs"

const HeroSection = () => {
    const heroRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"],
    })

    const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"])
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
    const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
    const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])

    return (
        <section
            ref={heroRef}
            className="relative h-[100dvh] w-full overflow-hidden bg-black"
        >
            {/* ── BACKGROUND ── */}
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

            {/* ── OVERLAY — darker, more cinematic ── */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary2-950 dark:from-gunmetal-950 via-primary2-950/60 dark:via-gunmetal-950/60 to-primary2-950/40 dark:to-gunmetal-950/40 "/>

            {/* vignette */}
            <div className="absolute inset-0 pointer-events-none bg-radial-gradient" />

            {/* grain */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
                style={{
                    backgroundImage:
                        'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence baseFrequency=\'0.8\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
                }}
            />

            {/* ambient orbs */}
            <motion.div
                className="absolute top-20 left-20 w-[400px] h-[400px] rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(34,197,94,0.12), transparent)" }}
                animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
            />
            <motion.div
                className="absolute bottom-10 right-10 w-[500px] h-[500px] rounded-full blur-3xl"
                style={{ background: "radial-gradient(circle, rgba(245,158,11,0.09), transparent)" }}
                animate={{ y: [0, 25, 0], x: [0, -15, 0] }}
                transition={{ duration: 10, repeat: Infinity }}
            />

            {/* ── CONTENT ── */}
            <motion.div
                style={{ opacity: contentOpacity, y: contentY }}
                className="relative z-10 h-full flex flex-col items-center justify-end pb-20 text-center px-4"
            >
                {/* TITLE */}
                <motion.h1
                    initial={{ opacity: 0, y: 40, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 1, ease: [0.19, 1, 0.22, 1] }}
                    className="font-sanchez text-4xl md:text-7xl font-extrabold pb-1"
                    style={{
                        background: "linear-gradient(160deg, #f0fdf4 10%, #3df07f 55%, #d1fae5 90%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        textShadow: "0 0 40px rgba(34,197,94,0.25)",
                    }}
                >
                    Battali Abdul Matin High School
                </motion.h1>

                {/* SUBTITLE */}
                <motion.h2
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.9 }}
                    className="mt-4 text-sm md:text-base uppercase tracking-widest text-yellow-100"
                >
                    Where We Learned to Dream
                    <span className="inline-block w-1 h-1 rounded-full bg-yellow-200/60 mx-2 mb-0.5 align-middle" />
                    Where We Return to Remember
                </motion.h2>

                {/* DESCRIPTION */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.9 }}
                    className="mt-6 max-w-xl text-white leading-relaxed tracking-wide"
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
    )
}
export default HeroSection