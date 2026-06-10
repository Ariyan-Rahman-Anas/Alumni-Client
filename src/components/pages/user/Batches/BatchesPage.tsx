"use client";

import {
    RiChat4Line as RiChatLine,
    RiArrowRightLine,
    RiGroupLine,
    RiCalendarLine,
    RiUserFollowLine,
    RiSparklingLine,
} from "react-icons/ri";
import Link from "next/link";
import { FadeUpWrapper } from "../Home/HomePage";
import BatchPageHead from "@/components/modules/user/batches/BatchPageHead";
import BatchPageUsersWithSearchFilter from "@/components/modules/user/batches/BatchPageUsersWithSearchFilter";
import { useGetActiveBatchesQuery } from "@/redux/apis/batchApi";
import type { Batch } from "@/redux/apis/batchApi";

/* ── Helpers ──────────────────────────────────────────────── */
const fmtNum = (n: number) =>
    n >= 1000 ? `${(n / 1000).toFixed(1)}k+` : n > 0 ? `${n}` : "—";

const derivedStats = (batches: Batch[]) => {
    if (!batches.length) return { totalAlumni: 0, activeBatches: 0, batchSpan: "—", newThisMonth: 0 };
    const years = batches.map((b) => b.year);
    return {
        totalAlumni: batches.reduce((s, b) => s + (b.stats?.approved || 0), 0),
        activeBatches: batches.length,
        batchSpan: `${Math.min(...years)} – ${Math.max(...years)}`,
        newThisMonth: batches.reduce((s, b) => s + (b.stats?.last30Days || 0), 0),
    };
};

/* ── Page ─────────────────────────────────────────────────── */
const BatchesPage = () => {
    const { data: batchData } = useGetActiveBatchesQuery();
    const batches = batchData?.data ?? [];
    const { totalAlumni, activeBatches, batchSpan, newThisMonth } = derivedStats(batches);

    const stats = [
        { icon: <RiGroupLine />, value: fmtNum(totalAlumni), label: "Verified alumni", color: "bg-primary2-50 dark:bg-primary2-900/30 text-primary2-600 dark:text-primary2-400" },
        { icon: <RiCalendarLine />, value: activeBatches > 0 ? `${activeBatches}` : "—", label: "Active batches", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
        { icon: <RiSparklingLine />, value: batchSpan, label: "Batch era", color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" },
        { icon: <RiUserFollowLine />, value: newThisMonth > 0 ? `+${newThisMonth}` : "—", label: "Joined this month", color: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" },
    ];

    return (
        <div className="three-xl-section-setup pb-20 space-y-12">

            {/* ═══ HERO ════════════════════════════════════════════ */}
            <BatchPageHead />

            {/* ═══ LIVE STATS STRIP ════════════════════════════════ */}
            <FadeUpWrapper>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map(({ icon, value, label, color }) => (
                        <div
                            key={label}
                            className="rounded-2xl border border-surface-300/60 dark:border-gunmetal-500/50 bg-white dark:bg-gunmetal-800 px-5 py-5 flex items-center gap-4"
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${color}`}>
                                {icon}
                            </div>
                            <div className="min-w-0">
                                <p className="text-xl font-bold text-primary2-900 dark:text-gunmetal-100 leading-none">{value}</p>
                                <p className="mt-1 text-xs text-muted-foreground truncate">{label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </FadeUpWrapper>

            {/* ═══ DIRECTORY ═══════════════════════════════════════ */}
            <BatchPageUsersWithSearchFilter />

            {/* ═══ BATCH ROOM CTA ══════════════════════════════════ */}
            <FadeUpWrapper>
                <div
                    className="relative overflow-hidden rounded-3xl"
                    style={{ background: "linear-gradient(135deg, #041a12 0%, #0c4a34 60%, #1a5436 100%)" }}
                >
                    {/* Grid texture */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
                            backgroundSize: "48px 48px",
                        }}
                    />
                    <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl opacity-15" style={{ background: "rgba(46,139,87,1)" }} />
                    <div className="absolute -bottom-10 left-1/4 h-40 w-40 rounded-full blur-3xl opacity-10" style={{ background: "rgba(245,158,11,1)" }} />

                    <div className="relative z-10 px-8 py-10 sm:px-12 sm:py-12">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">

                            {/* Left */}
                            <div className="flex-1">
                                <div className="inline-flex items-center gap-2 rounded-full border border-primary2-500/40 bg-primary2-900/50 px-3 py-1 text-xs font-medium text-primary2-300 mb-5">
                                    <RiChatLine className="text-sm" />
                                    Live Now
                                </div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug max-w-lg">
                                    Your batch has{" "}
                                    <span className="text-primary2-300">a dedicated room</span>{" "}
                                    waiting for you
                                </h2>
                                <p className="mt-3 text-sm text-gunmetal-300 leading-relaxed max-w-md">
                                    Chat, run polls, vote your batch coordinator, share media, and join voice or video calls — all scoped to your graduation year.
                                </p>
                                <div className="flex flex-wrap gap-2 mt-5">
                                    {["💬 Group chat", "🗳️ Polls & elections", "📷 Media sharing", "📞 Voice & video"].map((f) => (
                                        <span
                                            key={f}
                                            className="text-xs rounded-full px-3 py-1"
                                            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(196,232,206,0.9)", border: "1px solid rgba(255,255,255,0.12)" }}
                                        >
                                            {f}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Right CTA card */}
                            <div className="lg:w-60 xl:w-64 shrink-0">
                                <div
                                    className="rounded-2xl border p-6 flex flex-col items-center text-center gap-5"
                                    style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)" }}
                                >
                                    <div
                                        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-primary2-300"
                                        style={{ background: "rgba(46,139,87,0.25)", border: "1px solid rgba(46,139,87,0.35)" }}
                                    >
                                        <RiChatLine />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-white text-sm">Enter the Batch Room</p>
                                        <p className="mt-1 text-xs text-gunmetal-300">
                                            {activeBatches > 0 ? `${activeBatches} active batch rooms open` : "Rooms open for all batches"}
                                        </p>
                                    </div>
                                    <Link
                                        href="/batch-room"
                                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary2-500 hover:bg-primary2-400 text-white text-sm font-medium py-2.5 transition-colors"
                                    >
                                        Go to Batch Room
                                        <RiArrowRightLine />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </FadeUpWrapper>

        </div>
    );
};

export default BatchesPage;

