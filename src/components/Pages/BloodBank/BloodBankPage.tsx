"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
    RiAlarmWarningFill,
    RiDropLine,
    RiHeartPulseLine,
    RiMapPin2Line,
    RiShieldCrossLine,
    RiTestTubeLine,
    RiTimeLine,
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
const emergencyNeeds = [
    { group: "O−", units: "3 units needed", location: "Cumilla Medical College", urgency: "Critical" },
    { group: "AB+", units: "2 units needed", location: "Nangalkot Upazila Clinic", urgency: "Urgent" },
    { group: "B−", units: "1 unit needed", location: "Dhaka Referral Hospital", urgency: "Moderate" },
];

const responseStories = [
    { headline: "28-minute midnight response", detail: "Donor reached the hospital within 28 minutes of the emergency call — all through the alumni network." },
    { headline: "Cross-batch donor chain", detail: "Three donors from different batches coordinated for a rare surgery — a first-of-its-kind alumni relay." },
    { headline: "Rare group resolved in 4 hours", detail: "AB− request fulfilled through alumni geo-map lookup across two districts in under 4 hours." },
    { headline: "Double-district procurement", detail: "Two simultaneous emergencies served from the same battalion in under six hours." },
    { headline: "Zero-cost emergency kit", detail: "Alumni covered hospital charges for a fellow BAMHSian's emergency surgery through crowd coordination." },
];

const bloodGroups = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];

const eligibilitySteps = [
    { step: "01", title: "Health Screening", desc: "Basic eligibility check — weight, iron levels, last donation interval." },
    { step: "02", title: "Donation History", desc: "Verify last donation date and frequency compliance." },
    { step: "03", title: "Hospital Coordination", desc: "Match donor with hospital unit, transport, and timing window." },
    { step: "04", title: "Dispatch Confirmation", desc: "Real-time confirmation that the unit was received and logged." },
];

/* ── Page ─────────────────────────────────────────────────── */
const BloodBankPage = () => {
    return (
        <div className="three-xl-section-setup pb-20 space-y-16">

            {/* ═══ 1. HERO ════════════════════════════════════════ */}
            <section className="relative overflow-hidden rounded-3xl"
                style={{ background: "linear-gradient(145deg, #2d0a0a 0%, #7f1d1d 50%, #1c0708 100%)" }}>
                <div className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-30"
                    style={{ background: "#dc2626" }} />
                <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full blur-3xl opacity-20"
                    style={{ background: "#f87171" }} />

                <div className="relative z-10 px-7 py-12 sm:px-12 sm:py-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                        <Badge className="mb-5 bg-white/10 text-rose-200 border-rose-400/30 hover:bg-white/10">
                            <RiHeartPulseLine className="mr-1.5" /> Blood Bank Network
                        </Badge>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
                            Emergency support,{" "}
                            <span className="text-rose-300">coordinated with precision</span>
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm sm:text-lg text-rose-100/75 leading-relaxed">
                            A rapid-response coordination hub for donor matching, urgent notices, and life-saving alumni action — all in one place.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ═══ 2. URGENT NEEDS ════════════════════════════════ */}
            <FadeUp>
                <div className="mb-6 flex items-center gap-3">
                    <RiAlarmWarningFill className="text-xl text-rose-600" />
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-rose-900">Active Emergency Needs</h2>
                        <p className="mt-0.5 text-sm text-muted-foreground">Call your nearest hospital unit if your blood type matches.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {emergencyNeeds.map((need, idx) => (
                        <motion.div key={need.group + need.location} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}>
                            <Card className="h-full border-rose-200 hover:-translate-y-1 transition-transform duration-200 bg-rose-50/50">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <p className="text-4xl font-black text-rose-900">{need.group}</p>
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${need.urgency === "Critical" ? "bg-red-100 text-red-700" :
                                                need.urgency === "Urgent" ? "bg-orange-100 text-orange-700" :
                                                    "bg-amber-100 text-amber-700"
                                            }`}>{need.urgency}</span>
                                    </div>
                                    <p className="mt-2 text-sm font-medium text-rose-800">{need.units}</p>
                                    <Separator className="my-3 bg-rose-200" />
                                    <p className="flex items-start gap-2 text-xs text-muted-foreground">
                                        <RiMapPin2Line className="mt-0.5 shrink-0 text-rose-600" />
                                        {need.location}
                                    </p>
                                    <Button size="sm" className="mt-4 w-full bg-rose-700 hover:bg-rose-800 text-white">I Can Help</Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </FadeUp>

            {/* ═══ 3. BLOOD GROUP BOARD ═══════════════════════════ */}
            <FadeUp>
                <Card className="border-rose-200/70">
                    <CardContent className="p-6 sm:p-8">
                        <h3 className="text-xl font-bold text-rose-900">Blood Group Intelligence Board</h3>
                        <p className="mt-2 text-sm text-muted-foreground">Active registered donors by blood group — ready for live API injection.</p>
                        <div className="mt-6 grid grid-cols-4 sm:grid-cols-8 gap-3">
                            {bloodGroups.map((group) => (
                                <div key={group} className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-center hover:bg-rose-100 transition cursor-default">
                                    <RiDropLine className="mx-auto text-rose-600 text-base mb-1" />
                                    <p className="text-sm font-bold text-rose-900">{group}</p>
                                    <p className="text-[10px] text-rose-600 mt-0.5">Ready</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </FadeUp>

            {/* ═══ 4. RESPONSE STORIES (shadcn Carousel) ══════════ */}
            <FadeUp>
                <div className="mb-5">
                    <h2 className="text-2xl sm:text-3xl font-bold text-rose-900">Response Stories</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Real cases where alumni coordination made a life-saving difference.</p>
                </div>
                <HorizontalSnapCarousel>
                    {responseStories.map((story) => (
                        <Card key={story.headline} className="h-full border-rose-200/70 hover:-translate-y-1 transition-transform duration-200">
                            <CardContent className="p-6">
                                <div className="h-10 w-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-700 text-lg">
                                    <RiHeartPulseLine />
                                </div>
                                <h3 className="mt-4 text-base font-semibold text-rose-900">{story.headline}</h3>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{story.detail}</p>
                            </CardContent>
                        </Card>
                    ))}
                </HorizontalSnapCarousel>
            </FadeUp>

            {/* ═══ 5. ELIGIBILITY STEPS ═══════════════════════════ */}
            <FadeUp>
                <Card className="border-rose-200/70">
                    <CardContent className="p-6 sm:p-8">
                        <h3 className="text-xl font-bold text-rose-900">Donor Eligibility Flow</h3>
                        <p className="mt-2 text-sm text-muted-foreground">A transparent, step-by-step pipeline from volunteer registration to confirmed dispatch.</p>
                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {eligibilitySteps.map(({ step, title, desc }) => (
                                <div key={step} className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
                                    <p className="text-3xl font-black text-rose-200">{step}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <RiTestTubeLine className="text-rose-700 text-base shrink-0" />
                                        <p className="text-sm font-semibold text-rose-900">{title}</p>
                                    </div>
                                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </FadeUp>

            {/* ═══ 6. EMERGENCY CTA ════════════════════════════════ */}
            <FadeUp>
                <div className="rounded-3xl border border-rose-200 px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.08) 0%, rgba(185,28,28,0.05) 100%)" }}>
                    <div className="flex items-start gap-3 min-w-0">
                        <RiTimeLine className="text-rose-700 text-xl shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-semibold text-rose-900">Next upgrade-ready</p>
                            <p className="text-xs text-muted-foreground mt-0.5">Geo-based donor broadcast, emergency escalation, and real-time availability sync can be connected next.</p>
                        </div>
                    </div>
                    <Button className="bg-rose-700 hover:bg-rose-800 text-white shrink-0">
                        <RiShieldCrossLine className="mr-2" /> Raise Emergency Request
                    </Button>
                </div>
            </FadeUp>
        </div>
    );
};

export default BloodBankPage;
