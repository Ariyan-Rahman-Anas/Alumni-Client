"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
    RiCalendarEventLine,
    RiGlobalLine,
    RiMicLine,
    RiTeamLine,
    RiTimerLine,
    RiUserHeartLine,
} from "react-icons/ri";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HorizontalSnapCarousel from "@/components/shared/HorizontalSnapCarousel";
import EventPageEvents from "@/components/modules/user/events/EventPageEvents";

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

            {/* ═══ 2. UPCOMING EVENTS ═════════════════════════════ */}
            <EventPageEvents />

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