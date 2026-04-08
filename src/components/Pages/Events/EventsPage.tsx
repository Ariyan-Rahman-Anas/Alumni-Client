"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
    RiCalendarCheckLine,
    RiCalendarEventLine,
    RiGlobalLine,
    RiMapPin2Line,
    RiMicLine,
    RiTeamLine,
    RiTimerLine,
    RiUserHeartLine,
} from "react-icons/ri";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import HorizontalSnapCarousel from "@/components/shared/HorizontalSnapCarousel";

/* ── FadeUp ─────────────────────────────────────────────── */
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
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay, ease: [0.19, 1, 0.22, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

/* ── Data ─────────────────────────────────────────────────── */
const upcomingEvents = [
    {
        title: "Founders Reunion Night",
        date: "12 May 2026",
        venue: "Main Auditorium, BAMHS",
        tag: "Reunion",
        tagColor: "bg-violet-100 text-violet-700 border-violet-200",
    },
    {
        title: "Mentor Sprint Camp",
        date: "25 May 2026",
        venue: "ICT Lab, Main Building",
        tag: "Career",
        tagColor: "bg-sky-100 text-sky-700 border-sky-200",
    },
    {
        title: "Community Blood Drive",
        date: "08 Jun 2026",
        venue: "School Ground",
        tag: "Impact",
        tagColor: "bg-rose-100 text-rose-700 border-rose-200",
    },
];

const experienceMoments = [
    { icon: <RiMicLine />, title: "Stage Reveals", desc: "Award walks, batch introductions, and MC-led live storytelling format." },
    { icon: <RiTeamLine />, title: "Batch Roll-Call", desc: "Year-wise assembly in the auditorium floor for nostalgic connection." },
    { icon: <RiUserHeartLine />, title: "Teacher Tribute", desc: "Structured felicitation and gratitude sessions for mentors and educators." },
    { icon: <RiGlobalLine />, title: "Career Booth", desc: "Live job, startup, and scholarship showcase by senior alumni." },
    { icon: <RiTimerLine />, title: "Acoustic Closing", desc: "Nighttime musical close with a collaborative alumni performance." },
];

const operationLanes = [
    { lane: "Host", detail: "MC lineup + stage slot schedule" },
    { lane: "Guest", detail: "RSVP tracking + welcome kit flow" },
    { lane: "Volunteer", detail: "Role mapping + fallback coverage" },
    { lane: "Logistics", detail: "Venue, transport, catering plan" },
    { lane: "Media", detail: "Photography, livestream, archive" },
    { lane: "Emergency", detail: "Medical, security, rapid response" },
];

/* ── Page ─────────────────────────────────────────────────── */
const EventsPage = () => {
    return (
        <div className="three-xl-section-setup pb-20 space-y-16">

            {/* ═══ 1. HERO ════════════════════════════════════════ */}
            <section className="relative overflow-hidden rounded-3xl"
                style={{ background: "linear-gradient(145deg, #0c0f24 0%, #1a1244 55%, #07091a 100%)" }}>
                <div className="absolute inset-0 pointer-events-none opacity-25"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-30"
                    style={{ background: "#6d28d9" }} />
                <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full blur-3xl opacity-20"
                    style={{ background: "#a78bfa" }} />

                <div className="relative z-10 px-7 py-12 sm:px-12 sm:py-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                        <Badge className="mb-5 bg-white/10 text-violet-200 border-violet-400/30 hover:bg-white/10">
                            <RiCalendarEventLine className="mr-1.5" /> Events Hub
                        </Badge>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
                            Experiences,{" "}
                            <span className="text-violet-300">not just events</span>
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm sm:text-lg text-violet-100/75 leading-relaxed">
                            Discover high-impact alumni gatherings with clear tracks, timeline intelligence, and participation flow — built for scale.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ═══ 2. UPCOMING EVENTS ═════════════════════════════ */}
            <FadeUp>
                <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary2-900">Upcoming Events</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Mark your calendar — these are the gatherings worth planning for.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {upcomingEvents.map((event, i) => (
                        <motion.div key={event.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                            <Card className="h-full hover:-translate-y-1 transition-transform duration-200 border-surface-300/60">
                                <CardContent className="p-6">
                                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-xs font-medium ${event.tagColor}`}>{event.tag}</span>
                                    <h3 className="mt-3 text-lg font-semibold text-primary2-900 leading-snug">{event.title}</h3>
                                    <Separator className="my-4" />
                                    <div className="space-y-2 text-sm text-muted-foreground">
                                        <p className="flex items-center gap-2"><RiCalendarCheckLine className="text-primary2-700 shrink-0" />{event.date}</p>
                                        <p className="flex items-start gap-2"><RiMapPin2Line className="text-primary2-700 shrink-0 mt-0.5" />{event.venue}</p>
                                    </div>
                                    <Button size="sm" className="mt-5 w-full bg-primary2-700 hover:bg-primary2-800 text-white">RSVP Now</Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </FadeUp>

            {/* ═══ 3. EXPERIENCE CAROUSEL (shadcn) ════════════════ */}
            <FadeUp>
                <div className="mb-5">
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary2-900">Event Experience Arc</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Swipe through the segments that build a complete reunion memory.</p>
                </div>
                <HorizontalSnapCarousel>
                    {experienceMoments.map((item) => (
                        <Card key={item.title} className="h-full border-surface-300/60 hover:-translate-y-1 transition-transform duration-200">
                            <CardContent className="p-6">
                                <div className="h-12 w-12 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-700 text-2xl">
                                    {item.icon}
                                </div>
                                <h3 className="mt-5 text-base font-semibold text-primary2-900">{item.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </HorizontalSnapCarousel>
            </FadeUp>

            {/* ═══ 4. OPERATION BLUEPRINT ════════════════════════ */}
            <FadeUp>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <Card className="border-surface-300/60">
                        <CardContent className="p-6 sm:p-8">
                            <h3 className="text-xl font-bold text-primary2-900">Operations Blueprint</h3>
                            <p className="mt-2 text-sm text-muted-foreground">Run sheet across all lanes — stage, hospitality, media, and emergency — in one command view.</p>
                            <div className="mt-5 grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {operationLanes.map(({ lane, detail }) => (
                                    <div key={lane} className="rounded-xl border border-surface-300/60 bg-primary2-50/50 p-4">
                                        <p className="text-sm font-semibold text-primary2-900">{lane}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-surface-300/60">
                        <CardContent className="p-6 sm:p-8 flex flex-col">
                            <h3 className="text-xl font-bold text-primary2-900">Volunteer Matrix</h3>
                            <p className="mt-2 text-sm text-muted-foreground flex-1">
                                Rapid role assignment across registration desks, stage support, logistics, and emergency response.
                            </p>
                            <Button className="mt-8 w-full bg-primary2-700 hover:bg-primary2-800 text-white">
                                Open Volunteer Setup
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </FadeUp>

            {/* ═══ 5. UPGRADE BANNER ═══════════════════════════════ */}
            <FadeUp>
                <div className="rounded-3xl border border-primary2-200/60 px-6 py-5 flex flex-wrap items-center gap-3"
                    style={{ background: "linear-gradient(135deg, rgba(109,40,217,0.07) 0%, rgba(46,139,87,0.05) 100%)" }}>
                    <RiCalendarEventLine className="text-primary2-700 text-xl shrink-0" />
                    <p className="text-sm text-primary2-900 flex-1 min-w-0">
                        <strong>Next upgrade-ready:</strong> Ticketing integration, RSVP scoring, seating orchestration, and event analytics heatmap.
                    </p>
                </div>
            </FadeUp>
        </div>
    );
};

export default EventsPage;
