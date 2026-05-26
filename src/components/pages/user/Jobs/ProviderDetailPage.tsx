"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    RiArrowLeftLine,
    RiMapPinLine,
    RiCalendarLine,
    RiShieldCheckLine,
    RiCheckboxCircleLine,
    RiMailLine,
    RiFileListLine,
    RiBookOpenLine,
    RiTimeLine,
    RiMoneyDollarCircleLine,
    RiUserLine,
    RiSendPlaneLine,
    RiExternalLinkLine,
} from "react-icons/ri";
import {
    useGetProviderByIdQuery,
    useContactProviderMutation,
} from "@/redux/apis/jobApi";
import { useAppSelector } from "@/redux/hooks";
import GoBackward from "@/components/shared/GoBackward";

/* ── Avatar ─────────────────────────────────────────── */
function Avatar({ name, imageUrl, size = 80 }: { name: string; imageUrl?: string; size?: number }) {
    if (imageUrl) {
        return (
            <Image
                src={imageUrl}
                alt={name}
                width={size}
                height={size}
                className="rounded-2xl object-cover flex-shrink-0"
                style={{ width: size, height: size }}
            />
        );
    }
    return (
        <div
            className="rounded-2xl bg-primary2-100 flex items-center justify-center font-bold text-primary2-700 flex-shrink-0"
            style={{ width: size, height: size, fontSize: size * 0.38 }}
        >
            {name[0]}
        </div>
    );
}

/* ── Section wrapper ─────────────────────────────────── */
function Section({ title, children, delay = 0 }: { title?: string; children: React.ReactNode; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className="bg-white rounded-2xl border border-surface-200 p-6 mb-5"
        >
            {title && (
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-4">{title}</p>
            )}
            {children}
        </motion.div>
    );
}

/* ── Tag pill ─────────────────────────────────────────── */
function Tag({ children, color = "primary" }: { children: React.ReactNode; color?: "primary" | "emerald" | "blue" | "surface" }) {
    const cls = {
        primary: "bg-primary2-50 text-primary2-700 border border-primary2-200",
        emerald: "bg-emerald-50 text-emerald-700 border border-emerald-100",
        blue: "bg-blue-50 text-blue-700 border border-blue-100",
        surface: "bg-surface-100 text-neutral-700 border border-surface-200",
    }[color];
    return <span className={`text-xs px-2.5 py-1 rounded-full ${cls}`}>{children}</span>;
}

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function ProviderDetailPage({ id }: { id: string }) {
    const router = useRouter();
    const { data, isLoading, isError } = useGetProviderByIdQuery(id);
    const [contactProvider, { isLoading: contacting }] = useContactProviderMutation();
    const auth = useAppSelector((s) => s.auth);

    const [message, setMessage] = useState("");
    const [showContact, setShowContact] = useState(false);

    const p = data?.data;

    const handleContact = async () => {
        if (!auth.user) { toast.error("Please log in to contact this provider."); return; }
        try {
            await contactProvider({ id, message: message.trim() || undefined }).unwrap();
            toast.success("Contact request sent!");
            setMessage("");
            setShowContact(false);
        } catch {
            toast.error("Failed to send contact request.");
        }
    };

    /* ── Loading ──────────────────────────────────────── */
    if (isLoading) {
        return (
            <div className="three-xl-section-setup py-10 max-w-3xl animate-pulse">
                <div className="h-6 w-32 bg-surface-200 rounded mb-8" />
                <div className="flex gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-surface-200 flex-shrink-0" />
                    <div className="flex-1 space-y-3">
                        <div className="h-6 w-48 bg-surface-200 rounded" />
                        <div className="h-4 w-32 bg-surface-200 rounded" />
                        <div className="h-4 w-24 bg-surface-200 rounded" />
                    </div>
                </div>
                {[1, 2, 3].map((i) => <div key={i} className="h-32 bg-surface-200 rounded-2xl mb-4" />)}
            </div>
        );
    }

    /* ── Error / Not found ─────────────────────────────── */
    if (isError || !p) {
        return (
            <div className="three-xl-section-setup py-20 max-w-3xl text-center">
                <p className="text-lg font-semibold text-primary2-900 mb-2">Provider not found</p>
                <p className="text-sm text-muted-foreground mb-6">This provider profile may no longer exist.</p>
                <button
                    onClick={() => router.push("/jobs?tab=providers")}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary2-700 text-white rounded-xl text-sm font-semibold hover:bg-primary2-800 transition-colors"
                >
                    <RiArrowLeftLine /> Browse Providers
                </button>
            </div>
        );
    }

    const isTutor = p.providerType === "TUTOR";

    return (
        <div className="three-xl-section-setup py-10pb-24 max-w-3xl">
            {/* Back */}
            <GoBackward text="Jobs"  />

            {/* ── Header ────────────────────────────────────── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-surface-200 p-6 mb-5"
            >
                <div className="flex gap-5 items-start">
                    <Avatar name={p.user.name} imageUrl={p.user.imageUrl} size={80} />
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h1 className="text-2xl font-extrabold text-primary2-900 leading-tight">{p.user.name}</h1>
                            {p.status === "APPROVED" && (
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                                    <RiShieldCheckLine /> Verified
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap gap-2 mb-3">
                            <Tag color="primary">{p.providerType}</Tag>
                            {p.isAvailable && <Tag color="blue">Available</Tag>}
                            {p.gender && <Tag color="surface">{p.gender}</Tag>}
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1"><RiMapPinLine /> {p.location}</span>
                            {p.createdAt && (
                                <span className="flex items-center gap-1">
                                    <RiCalendarLine /> Member since {format(new Date(p.createdAt), "MMM yyyy")}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Contact CTA */}
                {p.status === "APPROVED" && (
                    <div className="mt-5 pt-5 border-t border-surface-100">
                        {showContact ? (
                            <div className="space-y-3">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Write a message (optional)..."
                                    rows={3}
                                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-sm focus:outline-none focus:ring-2 focus:ring-primary2-300 resize-none"
                                />
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowContact(false)}
                                        className="flex-1 py-2.5 border border-surface-200 rounded-xl text-sm text-neutral-700 hover:border-surface-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleContact}
                                        disabled={contacting}
                                        className="flex-1 py-2.5 bg-primary2-700 text-white font-semibold rounded-xl hover:bg-primary2-800 disabled:opacity-50 transition-colors text-sm flex items-center justify-center gap-2"
                                    >
                                        <RiSendPlaneLine /> {contacting ? "Sending…" : "Send Request"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowContact(true)}
                                className="w-full py-2.5 bg-primary2-700 text-white font-semibold rounded-xl hover:bg-primary2-800 transition-colors text-sm flex items-center justify-center gap-2"
                            >
                                <RiMailLine /> Contact Provider
                            </button>
                        )}
                    </div>
                )}
            </motion.div>

            {/* ── About ─────────────────────────────────────── */}
            <Section title="About" delay={0.06}>
                <p className="text-sm text-neutral-700 leading-relaxed">{p.bio}</p>
            </Section>

            {/* ── Details ───────────────────────────────────── */}
            <Section title="Details" delay={0.08}>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    <div className="flex justify-between sm:flex-col sm:gap-0.5">
                        <dt className="text-muted-foreground text-xs">Experience</dt>
                        <dd className="font-medium text-primary2-900">{p.experience}</dd>
                    </div>
                    {p.hourlyRate && (
                        <div className="flex justify-between sm:flex-col sm:gap-0.5">
                            <dt className="text-muted-foreground text-xs flex items-center gap-1"><RiMoneyDollarCircleLine /> Hourly Rate</dt>
                            <dd className="font-medium text-primary2-900">{p.hourlyRate} BDT/hr</dd>
                        </div>
                    )}
                    {p.monthlyRate && (
                        <div className="flex justify-between sm:flex-col sm:gap-0.5">
                            <dt className="text-muted-foreground text-xs flex items-center gap-1"><RiMoneyDollarCircleLine /> Monthly Rate</dt>
                            <dd className="font-medium text-primary2-900">{p.monthlyRate} BDT/mo</dd>
                        </div>
                    )}
                    {p.availableGenderStudents && (
                        <div className="flex justify-between sm:flex-col sm:gap-0.5">
                            <dt className="text-muted-foreground text-xs flex items-center gap-1"><RiUserLine /> Teaches</dt>
                            <dd className="font-medium text-primary2-900 capitalize">{p.availableGenderStudents} students</dd>
                        </div>
                    )}
                </dl>
            </Section>

            {/* ── Tutor-specific ─────────────────────────────── */}
            {isTutor && !!(p.subjects?.length || p.classRange?.length) && (
                <Section title="Teaching" delay={0.1}>
                    {p.subjects?.length ? (
                        <div className="mb-4">
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-1">
                                <RiBookOpenLine /> Subjects
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {p.subjects.map((s) => <Tag key={s} color="emerald">{s}</Tag>)}
                            </div>
                        </div>
                    ) : null}
                    {p.classRange?.length ? (
                        <div>
                            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Class Range</p>
                            <div className="flex flex-wrap gap-2">
                                {p.classRange.map((c) => <Tag key={c} color="blue">{c}</Tag>)}
                            </div>
                        </div>
                    ) : null}
                </Section>
            )}

            {/* ── Qualifications ─────────────────────────────── */}
            {p.qualifications?.length ? (
                <Section title="Qualifications" delay={0.12}>
                    <ul className="space-y-2">
                        {p.qualifications.map((q) => (
                            <li key={q} className="flex items-start gap-2 text-sm text-neutral-700">
                                <RiCheckboxCircleLine className="text-primary2-600 mt-0.5 flex-shrink-0" /> {q}
                            </li>
                        ))}
                    </ul>
                </Section>
            ) : null}

            {/* ── Availability ───────────────────────────────── */}
            {p.availability?.length ? (
                <Section title="Availability" delay={0.14}>
                    <div className="flex flex-wrap gap-2">
                        {p.availability.map((a) => (
                            <span key={a} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-surface-100 text-neutral-700 border border-surface-200">
                                <RiTimeLine /> {a}
                            </span>
                        ))}
                    </div>
                </Section>
            ) : null}

            {/* ── Certificates ───────────────────────────────── */}
            {p.certificates?.length ? (
                <Section title="Certificates & Documents" delay={0.16}>
                    <div className="space-y-2">
                        {p.certificates.map((cert, i) => (
                            <a
                                key={i}
                                href={cert.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-xl border border-surface-200 hover:border-primary2-300 hover:bg-primary2-50 transition-colors group"
                            >
                                <RiFileListLine className="text-primary2-600 text-lg flex-shrink-0" />
                                <span className="text-sm text-neutral-700 font-medium group-hover:text-primary2-700 flex-1 truncate">{cert.name}</span>
                                <RiExternalLinkLine className="text-muted-foreground text-sm flex-shrink-0" />
                            </a>
                        ))}
                    </div>
                </Section>
            ) : null}

            {/* ── User info ─────────────────────────────────── */}
            <Section delay={0.18}>
                <div className="flex items-center gap-3">
                    <Avatar name={p.user.name} imageUrl={p.user.imageUrl} size={44} />
                    <div>
                        <p className="font-semibold text-primary2-900 text-sm">{p.user.name}</p>
                        <p className="text-xs text-muted-foreground">{p.user.email}</p>
                        {p.user.batch && <p className="text-xs text-muted-foreground">Batch {p.user.batch}</p>}
                    </div>
                </div>
            </Section>
        </div>
    );
}