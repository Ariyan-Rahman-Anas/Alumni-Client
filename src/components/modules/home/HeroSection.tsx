import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { RiArrowRightLine, RiSparkling2Line } from "react-icons/ri";

const HeroSection = () => {

    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
    const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section
            ref={heroRef}
            className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden"
            style={{
                background: "linear-gradient(160deg, #051F15 0%, #0A3D2B 50%, #0F3C24 100%)",
            }}
        >
            {/* Grid overlay */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(46,139,87,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.07) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                }}
            />
            {/* Radial glows */}
            <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-25"
                style={{ background: "var(--color-primary-500)" }} />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-3xl opacity-15"
                style={{ background: "var(--color-accent-500)" }} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full blur-3xl opacity-8"
                style={{ background: "rgba(46,139,87,0.12)" }} />

            <motion.div style={{ y: heroY, opacity: heroOpacity }}
                className="relative z-10 text-center px-6 max-w-5xl mx-auto">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border mb-8"
                    style={{
                        background: "rgba(46,139,87,0.12)",
                        borderColor: "rgba(46,139,87,0.35)",
                    }}
                >
                    <RiSparkling2Line style={{ color: "var(--color-primary-300)" }} />
                    <span className="font-mono text-xs tracking-widest uppercase"
                        style={{ color: "var(--color-primary-300)" }}>
                        BAMHSians Forever
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    initial={{ opacity: 0, y: 32 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                    className="font-display font-bold leading-[1.0] mb-6"
                    style={{
                        fontSize: "clamp(3rem, 8vw, 6.5rem)",
                        color: "var(--color-primary-50)",
                        letterSpacing: "-0.03em",
                    }}
                >
                    Once a{" "}
                    <span style={{
                        background: "linear-gradient(135deg, #72C48C 0%, #F59E0B 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}>
                        BAMHSian
                    </span>
                    ,<br />Always a{" "}
                    <span className="font-serif italic" style={{ color: "var(--color-primary-200)" }}>
                        BAMHSian
                    </span>
                </motion.h1>

                {/* Sub */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.38 }}
                    className="font-sans text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
                    style={{ color: "rgba(195,232,206,0.80)" }}
                >
                    The official alumni community of Battali Abdul Matin High School —
                    reconnect with classmates, relive memories, and stay connected across generations.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.52 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <Button
                        asChild
                        size="lg"
                        className="font-sans font-medium px-8 py-6 text-base rounded-xl shadow-xl transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                            background: "linear-gradient(135deg, #2E8B57 0%, #155A3E 100%)",
                            color: "#FDFAF2",
                            boxShadow: "0 0 28px rgba(46,139,87,0.40)",
                        }}
                    >
                        <Link href="/login">
                            Join the Community <RiArrowRightLine className="ml-1" />
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="font-sans font-medium px-8 py-6 text-base rounded-xl transition-all duration-200 hover:-translate-y-0.5"
                        style={{
                            borderColor: "rgba(46,139,87,0.40)",
                            color: "var(--color-primary-200)",
                            background: "rgba(46,139,87,0.06)",
                        }}
                    >
                        <Link href="/batches">Find Your Batch</Link>
                    </Button>
                </motion.div>

                {/* Scroll hint */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
                >
                    <span className="font-mono text-[10px] tracking-widest uppercase"
                        style={{ color: "rgba(195,232,206,0.40)" }}>Scroll</span>
                    <motion.div
                        animate={{ y: [0, 8, 0] }}
                        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                        className="w-px h-8 rounded-full"
                        style={{ background: "linear-gradient(to bottom, rgba(46,139,87,0.5), transparent)" }}
                    />
                </motion.div>
            </motion.div>
        </section>

    )
}
export default HeroSection