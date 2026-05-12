"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import {
    RiHeartLine, RiGroupLine,
    RiArrowRightLine, RiShieldLine, RiLightbulbLine,
    RiHandHeartLine, RiLeafLine, RiMedalLine,
} from "react-icons/ri";
import { HiArrowUpRight } from "react-icons/hi2";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AboutPageHead from "@/components/modules/user/about/AboutPageHead";

/* ── FadeUp ───────────────────────────────────────────────── */
const FadeUp = ({
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
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, delay, ease: [0.19, 1, 0.22, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

/* ── Data ─────────────────────────────────────────────────── */
const milestones = [
    { year: "1966", title: "Founded", desc: "BAMHS opened its doors in Battali Bazar, Nangalkot, Cumilla — a school born from community vision." },
    { year: "1975", title: "First SSC Batch", desc: "The inaugural SSC batch passed their exams, marking the school's first major academic milestone." },
    { year: "1990", title: "Science Branch Opens", desc: "BAMHS expanded to include a Science branch, enabling students to pursue medicine and engineering." },
    { year: "2005", title: "Alumni Association", desc: "The formal alumni association was established, uniting thousands of graduates for the first time." },
    { year: "2018", title: "Digital Records", desc: "Student and alumni records were digitized, making it easier to reconnect across generations." },
    { year: "2024", title: "This Portal Launches", desc: "BAMHSians.org goes live — the official online home for all alumni worldwide." },
];

const values = [
    { icon: <RiHeartLine />, title: "Nostalgia & Belonging", desc: "We preserve the shared memories that make every BAMHSian feel at home, wherever they are in the world." },
    { icon: <RiGroupLine />, title: "Community First", desc: "Alumni helping alumni — whether it's a job referral, blood donation, or simply a reunion hug." },
    { icon: <RiShieldLine />, title: "Trust & Respect", desc: "We honor the teachers, the institution, and the values that shaped us into who we are today." },
    { icon: <RiLightbulbLine />, title: "Giving Back", desc: "Scholarships, mentorship, and infrastructure support — successful alumni lighting the path for the next generation." },
    { icon: <RiLeafLine />, title: "Roots & Growth", desc: "Like the trees of Battali, we grow outward but remain rooted in the soil of our shared origin." },
    { icon: <RiMedalLine />, title: "Pride & Excellence", desc: "We celebrate every BAMHSian's achievement as a collective victory for the entire school family." },
];

const team = [
    { name: "Md. Abul Kalam", role: "President, Alumni Association", batch: "Batch 1988" },
    { name: "Nasrin Sultana", role: "General Secretary", batch: "Batch 1995" },
    { name: "Rafiqul Islam", role: "Treasurer", batch: "Batch 1992" },
    { name: "Sadia Akter", role: "Digital & Communications", batch: "Batch 2008" },
    { name: "Karim Hossain", role: "Events & Reunions", batch: "Batch 2001" },
    { name: "Tania Rahman", role: "Scholarship Committee Head", batch: "Batch 2004" },
];



/* ══════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════ */
export default function AboutPage() {
    return (
        <div className="three-xl-section-setup pb-20 space-y-16" >

            {/* ══ 1. HERO ══════════════════════════════════════════ */}
            <AboutPageHead />
           

            {/* ══ 2. WHAT IS THIS PORTAL ═══════════════════════════ */}
            <section className="py-24 section-warm">
                <div className="page-setup">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <FadeUp>
                            <span className="text-label block mb-4">Who We Are</span>
                            <h2 className="font-display font-bold mb-6"
                                style={{
                                    fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)",
                                    color: "var(--color-primary-900)",
                                    letterSpacing: "-0.02em",
                                    lineHeight: 1.15,
                                }}
                            >
                                Built by alumni,<br />for alumni
                            </h2>
                            <p className=" text-base leading-relaxed mb-4"
                                style={{ color: "var(--color-text-secondary)" }}>
                                This platform was created by former students of Battali Abdul Matin High School
                                who felt the need for a single, warm, digital home — a place to reconnect with
                                old friends, find classmates from across the world, and give back to the school
                                that gave us everything.
                            </p>
                            <p className=" text-base leading-relaxed mb-8"
                                style={{ color: "var(--color-text-secondary)" }}>
                                We are not a school management system. We are not affiliated with the school
                                administration. We are simply BAMHSians — proud, grateful, and nostalgic —
                                keeping the spirit of our alma mater alive.
                            </p>

                            <div className="flex flex-wrap gap-2 mb-8">
                                {["Alumni Portal", "Community Driven", "Non-Commercial", "Est. 2024"].map(tag => (
                                    <Badge key={tag} className="badge-student  text-xs">{tag}</Badge>
                                ))}
                            </div>

                            <Button asChild className="rounded-xl font-medium"
                                style={{ background: "var(--color-primary-500)", color: "#FDFAF2" }}>
                                <Link href="/request">
                                    Connect with Alumni <RiArrowRightLine className="ml-1" />
                                </Link>
                            </Button>
                        </FadeUp>

                        {/* Right — quote block */}
                        <FadeUp delay={0.15}>
                            <div className="relative">
                                <div className="absolute -left-4 top-8 bottom-8 w-1 rounded-full"
                                    style={{ background: "linear-gradient(to bottom, var(--color-primary-300), var(--color-primary-500))" }} />
                                <div className="pl-8 space-y-8">
                                    {[
                                        { text: "Find your batch-mates from any year since 1966.", icon: <RiGroupLine /> },
                                        { text: "Share memories through the alumni gallery.", icon: <RiHeartLine /> },
                                        { text: "Help current students through scholarships.", icon: <RiHandHeartLine /> },
                                        { text: "Register as a blood donor for the community.", icon: <RiShieldLine /> },
                                    ].map(({ text, icon }) => (
                                        <div key={text} className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                                                style={{ background: "var(--color-primary-50)" }}>
                                                <span style={{ color: "var(--color-primary-500)", fontSize: "18px" }}>{icon}</span>
                                            </div>
                                            <p className=" text-base pt-2 leading-snug"
                                                style={{ color: "var(--color-text-primary)" }}>{text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeUp>
                    </div>
                </div>
            </section>

            {/* ══ 3. TIMELINE ══════════════════════════════════════ */}
            <section className="py-24"
                style={{ background: "linear-gradient(160deg, #0A3D2B 0%, #051F15 100%)" }}>
                <div className="page-setup">
                    <FadeUp className="text-center mb-16">
                        <span className="text-label block mb-3" style={{ color: "var(--color-primary-400)" }}>
                            A Walk Through Time
                        </span>
                        <h2 className="section-heading" style={{ color: "var(--color-primary-50)" }}>
                            Our Journey Since 1966
                        </h2>
                    </FadeUp>

                    <div className="relative max-w-3xl mx-auto">
                        {/* vertical line */}
                        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px"
                            style={{ background: "rgba(46,139,87,0.25)" }} />

                        {milestones.map(({ year, title, desc }, i) => {
                            const isRight = i % 2 === 0;
                            return (
                                <FadeUp key={year} delay={i * 0.08}>
                                    <div className={`relative flex items-start gap-6 mb-12 ${isRight ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}>
                                        {/* dot */}
                                        <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 z-10"
                                            style={{
                                                background: "var(--color-primary-500)",
                                                borderColor: "var(--color-primary-300)",
                                                boxShadow: "0 0 12px rgba(46,139,87,0.5)",
                                            }} />

                                        {/* spacer for centering */}
                                        <div className="hidden md:block flex-1" />

                                        {/* card */}
                                        <div className={`ml-12 md:ml-0 flex-1 ${isRight ? "md:pr-8" : "md:pl-8"}`}>
                                            <div className="rounded-2xl p-5 border"
                                                style={{
                                                    background: "rgba(46,139,87,0.08)",
                                                    borderColor: "rgba(46,139,87,0.20)",
                                                }}>
                                                <span className=" text-xs tracking-widest uppercase mb-1 block"
                                                    style={{ color: "var(--color-primary-400)" }}>{year}</span>
                                                <h3 className="font-display font-semibold text-lg mb-2"
                                                    style={{ color: "var(--color-primary-100)" }}>{title}</h3>
                                                <p className=" text-sm leading-relaxed"
                                                    style={{ color: "rgba(195,232,206,0.65)" }}>{desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                </FadeUp>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ══ 4. VALUES ════════════════════════════════════════ */}
            <section className="py-24 section-warm">
                <div className="page-setup">
                    <FadeUp className="text-center mb-14">
                        <span className="text-label block mb-3">What We Stand For</span>
                        <h2 className="section-heading" style={{ color: "var(--color-primary-900)" }}>
                            Our Values
                        </h2>
                        <p className="section-subheading">
                            The principles that guide every BAMHSian, in school and in life.
                        </p>
                    </FadeUp>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {values.map(({ icon, title, desc }, i) => (
                            <FadeUp key={title} delay={i * 0.07}>
                                <Card className="h-full border hover:-translate-y-1 transition-all duration-200"
                                    style={{
                                        background: "var(--color-surface)",
                                        borderColor: "var(--color-border)",
                                        boxShadow: "var(--shadow-sm)",
                                    }}>
                                    <CardContent className="p-6">
                                        <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                                            style={{ background: "var(--color-primary-50)" }}>
                                            <span style={{ color: "var(--color-primary-500)", fontSize: "20px" }}>{icon}</span>
                                        </div>
                                        <h3 className="font-display font-semibold text-lg mb-2"
                                            style={{ color: "var(--color-primary-800)" }}>{title}</h3>
                                        <p className=" text-sm leading-relaxed"
                                            style={{ color: "var(--color-text-secondary)" }}>{desc}</p>
                                    </CardContent>
                                </Card>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ 5. TEAM ══════════════════════════════════════════ */}
            <section className="py-24"
                style={{ background: "var(--color-surface-200)" }}>
                <div className="page-setup">
                    <FadeUp className="text-center mb-14">
                        <span className="text-label block mb-3">The People Behind It</span>
                        <h2 className="section-heading" style={{ color: "var(--color-primary-900)" }}>
                            Alumni Committee
                        </h2>
                        <p className="section-subheading">
                            Volunteers from different batches keeping the BAMHSian spirit alive.
                        </p>
                    </FadeUp>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {team.map(({ name, role, batch }, i) => (
                            <FadeUp key={name} delay={i * 0.07}>
                                <div className="flex items-center gap-4 p-5 rounded-2xl border hover:-translate-y-1 transition-all duration-200"
                                    style={{
                                        background: "var(--color-surface)",
                                        borderColor: "var(--color-border)",
                                        boxShadow: "var(--shadow-sm)",
                                    }}>
                                    {/* Avatar */}
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center font-display font-bold text-lg shrink-0"
                                        style={{
                                            background: "linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200))",
                                            color: "var(--color-primary-700)",
                                        }}>
                                        {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                    </div>
                                    <div>
                                        <p className=" font-semibold text-sm"
                                            style={{ color: "var(--color-text-primary)" }}>{name}</p>
                                        <p className=" text-xs" style={{ color: "var(--color-text-secondary)" }}>{role}</p>
                                        <span className=" text-[10px] tracking-wider mt-1 block"
                                            style={{ color: "var(--color-primary-500)" }}>{batch}</span>
                                    </div>
                                </div>
                            </FadeUp>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ 6. CTA ═══════════════════════════════════════════ */}
            <section className="py-24 relative overflow-hidden"
                style={{ background: "linear-gradient(160deg, #0A3D2B 0%, #051F15 100%)" }}>
                <div className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: "linear-gradient(rgba(46,139,87,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.06) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }} />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full blur-3xl opacity-20"
                    style={{ background: "var(--color-primary-500)" }} />

                <div className="page-setup relative z-10 text-center max-w-2xl mx-auto">
                    <FadeUp>
                        <RiHeartLine className="text-4xl mx-auto mb-5"
                            style={{ color: "var(--color-primary-400)" }} />
                        <h2 className="font-display font-bold mb-4"
                            style={{
                                fontSize: "clamp(2rem, 4vw, 3.2rem)",
                                color: "var(--color-primary-50)",
                                letterSpacing: "-0.025em",
                            }}>
                            Your batch is waiting for you
                        </h2>
                        <p className=" text-base mb-8"
                            style={{ color: "rgba(195,232,206,0.70)" }}>
                            Do not let time create distance. Reconnect with your classmates,
                            share your story, and become part of the living history of BAMHS.
                        </p>
                        <Separator className="mb-8 opacity-20" style={{ background: "var(--color-primary-400)" }} />
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="rounded-xl font-medium px-8 py-6"
                                style={{
                                    background: "linear-gradient(135deg, #2E8B57 0%, #155A3E 100%)",
                                    color: "#FDFAF2",
                                    boxShadow: "0 0 28px rgba(46,139,87,0.40)",
                                }}>
                                <Link href="/login">
                                    Join Now — It is Free <HiArrowUpRight className="ml-1" />
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="rounded-xl font-medium px-8 py-6"
                                style={{ borderColor: "rgba(46,139,87,0.40)", color: "var(--color-primary-200)" }}>
                                <Link href="/batches">Browse Batches</Link>
                            </Button>
                        </div>
                    </FadeUp>
                </div>
            </section>

        </div>
    );
}