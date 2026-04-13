"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
    RiBookmarkLine,
    RiCheckboxCircleLine,
    RiErrorWarningLine,
    RiInformationLine,
    RiMegaphoneLine,
    RiRadarLine,
    RiSearchLine,
    RiShieldCheckLine,
} from "react-icons/ri";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
const criticalNotices = [
    {
        title: "Reunion 2026 registration window is now open",
        time: "Today, 9:00 AM",
        priority: "High",
        icon: <RiErrorWarningLine />,
        colors: "bg-amber-50 border-amber-200 text-amber-800",
        badge: "bg-amber-100 text-amber-700",
    },
    {
        title: "Scholarship interview shortlist has been published",
        time: "Yesterday, 3:30 PM",
        priority: "Medium",
        icon: <RiCheckboxCircleLine />,
        colors: "bg-emerald-50 border-emerald-200 text-emerald-800",
        badge: "bg-emerald-100 text-emerald-700",
    },
    {
        title: "Updated volunteer onboarding guidelines",
        time: "2 days ago",
        priority: "Info",
        icon: <RiInformationLine />,
        colors: "bg-sky-50 border-sky-200 text-sky-800",
        badge: "bg-sky-100 text-sky-700",
    },
];

const policyUpdates = [
    { title: "Event Media Policy", desc: "Updated consent framework for all future event photography and livestreaming." },
    { title: "Directory Privacy Refresh", desc: "Alumni contact visibility settings have been refined for GDPR alignment." },
    { title: "Donation Transparency", desc: "Quarterly usage disclosure now available to all registered alumni members." },
    { title: "Portal Moderation Guide", desc: "Content standards and reporting workflow updated for community health." },
    { title: "Scholarship Terms", desc: "Eligibility criteria and disbursement schedule for 2026 cohort revised." },
];

const radarStats = [
    { key: "Live", value: "14" },
    { key: "Scheduled", value: "06" },
    { key: "Draft", value: "09" },
    { key: "Archived", value: "87" },
];

/* ── Page ─────────────────────────────────────────────────── */
const AnnouncementsPage = () => {
    return (
        <div className="three-xl-section-setup pb-20 space-y-16">

            {/* ═══ 1. HERO ════════════════════════════════════════ */}
            <section className="rounded-3xl border border-surface-300/60 bg-surface overflow-hidden relative">
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 90% 0%, rgba(46,139,87,0.15), transparent 55%)" }}
                />
                <div className="relative z-10 px-7 py-12 sm:px-12 sm:py-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                        <Badge className="mb-5 bg-primary2-100 text-primary2-700 border-primary2-200 hover:bg-primary2-100">
                            <RiMegaphoneLine className="mr-1.5" /> Announcements
                        </Badge>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-primary2-900 leading-tight max-w-2xl">
                            Signal Center for alumni updates
                        </h1>
                        <p className="mt-5 max-w-xl text-sm sm:text-lg text-muted-foreground leading-relaxed">
                            High-priority notices, verified updates, and policy communication in one clearly layered command board.
                        </p>
                        {/* search bar */}
                        <div className="mt-8 relative max-w-sm">
                            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Search announcements..." className="pl-9" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* ═══ 2. PRIORITY NOTICES ════════════════════════════ */}
            <FadeUp>
                <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary2-900">Priority Notices</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Time-sensitive, source-verified communications.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {criticalNotices.map((notice, idx) => (
                        <motion.div key={notice.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}>
                            <div className={`rounded-2xl border p-5 h-full ${notice.colors}`}>
                                <div className="flex items-start justify-between gap-2">
                                    <span className="text-xl mt-0.5">{notice.icon}</span>
                                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${notice.badge}`}>{notice.priority}</span>
                                </div>
                                <p className="mt-3 text-sm font-semibold leading-snug">{notice.title}</p>
                                <p className="mt-2 text-xs opacity-70">{notice.time}</p>
                                <button type="button" className="mt-3 flex items-center gap-1 text-xs font-medium opacity-80 hover:opacity-100">
                                    <RiBookmarkLine /> Read more
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </FadeUp>

            {/* ═══ 3. POLICY REFRESH CAROUSEL (shadcn) ════════════ */}
            <FadeUp>
                <div className="mb-5">
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary2-900">Policy Refresh Lane</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Governance and communication updates, curated and verified.</p>
                </div>
                <HorizontalSnapCarousel>
                    {policyUpdates.map((item) => (
                        <Card key={item.title} className="h-full border-surface-300/60 hover:-translate-y-1 transition-transform duration-200">
                            <CardContent className="p-6">
                                <div className="h-10 w-10 rounded-xl bg-primary2-100 flex items-center justify-center text-primary2-700 text-lg">
                                    <RiShieldCheckLine />
                                </div>
                                <h3 className="mt-4 text-base font-semibold text-primary2-900">{item.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </HorizontalSnapCarousel>
            </FadeUp>

            {/* ═══ 4. RADAR STATS + CREDIBILITY ══════════════════ */}
            <FadeUp>
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-5">
                    <Card className="border-surface-300/60">
                        <CardContent className="p-6 sm:p-8">
                            <h3 className="text-xl font-bold text-primary2-900">Release Radar</h3>
                            <p className="mt-2 text-sm text-muted-foreground">Published, scheduled, and in-draft notices across all categories and admin tiers.</p>
                            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {radarStats.map(({ key, value }) => (
                                    <div key={key} className="rounded-xl border border-surface-300/60 bg-primary2-50/50 p-4 text-center">
                                        <p className="text-2xl font-bold text-primary2-900">{value}</p>
                                        <p className="mt-1 text-xs text-muted-foreground">{key}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-surface-300/60">
                        <CardContent className="p-6 sm:p-8">
                            <h3 className="text-xl font-bold text-primary2-900">Credibility System</h3>
                            <p className="mt-2 text-sm text-muted-foreground">Every official notice can carry source verification and responsible admin signature for trust auditability.</p>
                            <Separator className="my-5" />
                            <div className="flex items-start gap-3 text-sm text-primary2-900">
                                <RiRadarLine className="text-lg mt-0.5 shrink-0 text-primary2-700" />
                                <p>Verification token and admin-signed publishing workflow can be connected here.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </FadeUp>

            {/* ═══ 5. UPGRADE BANNER ═══════════════════════════════ */}
            <FadeUp>
                <div className="rounded-3xl border border-primary2-200/60 px-6 py-5 flex flex-wrap items-center gap-3"
                    style={{ background: "linear-gradient(135deg, rgba(46,139,87,0.07) 0%, rgba(126,158,37,0.05) 100%)" }}>
                    <RiMegaphoneLine className="text-primary2-700 text-xl shrink-0" />
                    <p className="text-sm text-primary2-900 flex-1 min-w-0">
                        <strong>Next upgrade-ready:</strong> full-text search, category filters, read-status sync, per-member announcement bookmarks, and push notification hooks.
                    </p>
                </div>
            </FadeUp>
        </div>
    );
};

export default AnnouncementsPage;
