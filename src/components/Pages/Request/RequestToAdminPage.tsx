"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
    RiArrowRightLine,
    RiCheckboxCircleLine,
    RiFileList3Line,
    RiFolderOpenLine,
    RiMailSendLine,
    RiQuestionLine,
    RiShieldUserLine,
    RiTimeLine,
} from "react-icons/ri";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
const requestCategories = [
    { id: "profile", label: "Profile Correction", icon: <RiShieldUserLine />, desc: "Fix name, batch, or contact details." },
    { id: "certificate", label: "Certificate Support", icon: <RiFileList3Line />, desc: "Request alumni certificates or documents." },
    { id: "batch", label: "Batch Verification", icon: <RiCheckboxCircleLine />, desc: "Verify or update your batch assignment." },
    { id: "event", label: "Event Approval", icon: <RiTimeLine />, desc: "Submit a proposal for alumni events." },
    { id: "emergency", label: "Emergency Assistance", icon: <RiArrowRightLine />, desc: "Urgent medical or crisis support request." },
];

const requestStages = [
    { stage: "Submitted", icon: <RiMailSendLine />, desc: "Your request lands in the admin queue with a unique ticket number." },
    { stage: "Under Review", icon: <RiTimeLine />, desc: "Admin team reviews, routes to the right department, and flags priority." },
    { stage: "Admin Response", icon: <RiShieldUserLine />, desc: "You receive a structured response with resolution or follow-up ask." },
    { stage: "Resolved", icon: <RiCheckboxCircleLine />, desc: "Case closed with closure confirmation and archived for audit trail." },
];

const faqItems = [
    { q: "How long does a request take?", a: "Initial acknowledgment arrives within 24 hours. Complex requests are resolved within 3–7 business days depending on category." },
    { q: "Can I track my request status?", a: "Yes — status tracking with ticket number and in-app thread response can be connected to this panel." },
    { q: "Is there a limit on submissions?", a: "No limit, but duplicate or spam requests may be de-prioritized during high-volume periods." },
];

/* ── Page ─────────────────────────────────────────────────── */
const RequestToAdminPage = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [requestTitle, setRequestTitle] = useState("");
    const [details, setDetails] = useState("");

    return (
        <div className="three-xl-section-setup pb-20 space-y-16">

            {/* ═══ 1. HERO ════════════════════════════════════════ */}
            <section className="rounded-3xl border border-surface-300/60 bg-surface overflow-hidden relative">
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: "radial-gradient(ellipse at 85% 20%, rgba(46,139,87,0.18), transparent 50%)" }}
                />
                <div className="relative z-10 px-7 py-12 sm:px-12 sm:py-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                        <Badge className="mb-5 bg-primary2-100 text-primary2-700 border-primary2-200 hover:bg-primary2-100">
                            <RiFolderOpenLine className="mr-1.5" /> Request To Admin
                        </Badge>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-primary2-900 leading-tight max-w-2xl">
                            Structured support for every alumni need
                        </h1>
                        <p className="mt-5 max-w-xl text-sm sm:text-lg text-muted-foreground leading-relaxed">
                            Submit, track, and resolve requests with full clarity, auditability, and guaranteed admin response time.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ═══ 2. CATEGORY SELECTOR ═══════════════════════════ */}
            <FadeUp>
                <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary2-900">Select Request Type</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Choose the most relevant category for faster routing and resolution.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                    {requestCategories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`rounded-2xl border p-4 text-left transition-all duration-200 hover:-translate-y-0.5 ${selectedCategory === cat.id
                                    ? "border-primary2-500 bg-primary2-50 ring-1 ring-primary2-300"
                                    : "border-surface-300/60 bg-surface hover:border-primary2-300"
                                }`}
                        >
                            <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl text-lg ${selectedCategory === cat.id ? "bg-primary2-700 text-white" : "bg-primary2-100 text-primary2-700"
                                }`}>{cat.icon}</span>
                            <p className="mt-3 text-sm font-semibold text-primary2-900">{cat.label}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{cat.desc}</p>
                        </button>
                    ))}
                </div>
            </FadeUp>

            {/* ═══ 3. REQUEST LIFECYCLE (shadcn Carousel) ══════════ */}
            <FadeUp>
                <div className="mb-5">
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary2-900">Request Lifecycle</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Transparent 4-stage workflow from submission to closure.</p>
                </div>
                <HorizontalSnapCarousel itemBasis="basis-[85%] sm:basis-[48%] lg:basis-1/4">
                    {requestStages.map((item, idx) => (
                        <Card key={item.stage} className="h-full border-surface-300/60 hover:-translate-y-1 transition-transform duration-200">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-primary2-100 flex items-center justify-center text-primary2-700 text-lg shrink-0">
                                        {item.icon}
                                    </div>
                                    <span className="text-3xl font-black text-primary2-100">{String(idx + 1).padStart(2, "0")}</span>
                                </div>
                                <h3 className="mt-4 text-base font-semibold text-primary2-900">{item.stage}</h3>
                                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                            </CardContent>
                        </Card>
                    ))}
                </HorizontalSnapCarousel>
            </FadeUp>

            {/* ═══ 4. COMPOSE + PROMISE ════════════════════════════ */}
            <FadeUp>
                <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-5">
                    <Card className="border-surface-300/60">
                        <CardContent className="p-6 sm:p-8">
                            <h3 className="text-xl font-bold text-primary2-900">Request Composer</h3>
                            <p className="mt-2 text-sm text-muted-foreground">Complete the form below — detailed context speeds up resolution significantly.</p>
                            <Separator className="my-5" />
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-medium text-primary2-700 mb-1.5 block">Request Subject <span className="text-red-500">*</span></label>
                                    <Input
                                        value={requestTitle}
                                        onChange={(e) => setRequestTitle(e.target.value)}
                                        placeholder="Briefly describe the issue or need"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-primary2-700 mb-1.5 block">Detailed Description <span className="text-red-500">*</span></label>
                                    <Textarea
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        placeholder="Provide relevant context, dates, and what resolution you expect..."
                                        rows={5}
                                    />
                                </div>
                                {selectedCategory && (
                                    <div className="rounded-xl border border-primary2-200 bg-primary2-50 px-4 py-2.5 text-xs text-primary2-800">
                                        Category: <strong>{requestCategories.find(c => c.id === selectedCategory)?.label}</strong>
                                    </div>
                                )}
                                <Button
                                    className="w-full bg-primary2-700 hover:bg-primary2-800 text-white"
                                    disabled={!requestTitle || !details}
                                >
                                    <RiMailSendLine className="mr-2 text-base" /> Submit Request
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-surface-300/60">
                        <CardContent className="p-6 sm:p-8">
                            <h3 className="text-xl font-bold text-primary2-900">Our Service Promise</h3>
                            <p className="mt-2 text-sm text-muted-foreground">What you can expect after every submission.</p>
                            <Separator className="my-5" />
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3 text-sm text-primary2-900">
                                    <RiShieldUserLine className="mt-0.5 text-primary2-700 text-base shrink-0" />
                                    Initial acknowledgment within 24 hours.
                                </li>
                                <li className="flex items-start gap-3 text-sm text-primary2-900">
                                    <RiShieldUserLine className="mt-0.5 text-primary2-700 text-base shrink-0" />
                                    Emergency requests routed and escalated within 2 hours.
                                </li>
                                <li className="flex items-start gap-3 text-sm text-primary2-900">
                                    <RiShieldUserLine className="mt-0.5 text-primary2-700 text-base shrink-0" />
                                    Traceable updates until closure confirmation.
                                </li>
                                <li className="flex items-start gap-3 text-sm text-primary2-900">
                                    <RiShieldUserLine className="mt-0.5 text-primary2-700 text-base shrink-0" />
                                    All resolutions archived in an audit-ready log.
                                </li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </FadeUp>

            {/* ═══ 5. FAQ ══════════════════════════════════════════ */}
            <FadeUp>
                <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary2-900">Common Questions</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Quick answers before you submit.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {faqItems.map((faq, idx) => (
                        <motion.div key={faq.q} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}>
                            <Card className="h-full border-surface-300/60">
                                <CardContent className="p-5">
                                    <div className="h-9 w-9 rounded-xl bg-primary2-100 flex items-center justify-center text-primary2-700">
                                        <RiQuestionLine className="text-lg" />
                                    </div>
                                    <p className="mt-3 text-sm font-semibold text-primary2-900">{faq.q}</p>
                                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </FadeUp>

            {/* ═══ 6. UPGRADE BANNER ═══════════════════════════════ */}
            <FadeUp>
                <div className="rounded-3xl border border-primary2-200/60 px-6 py-5 flex flex-wrap items-center gap-3"
                    style={{ background: "linear-gradient(135deg, rgba(46,139,87,0.07) 0%, rgba(126,158,37,0.05) 100%)" }}>
                    <RiFileList3Line className="text-primary2-700 text-xl shrink-0" />
                    <p className="text-sm text-primary2-900 flex-1 min-w-0">
                        <strong>Next upgrade-ready:</strong> file attachment support, auto-ticket number generation, in-app admin response thread, and SMS notifications.
                    </p>
                </div>
            </FadeUp>
        </div>
    );
};

export default RequestToAdminPage;
