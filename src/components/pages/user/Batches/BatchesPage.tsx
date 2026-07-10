"use client";

import {
    RiGroupLine,
    RiCalendarLine,
    RiUserFollowLine,
    RiSparklingLine,
} from "react-icons/ri";
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
        <div>
            {/* ═══ HERO */}
            <BatchPageHead stats={stats} />

            {/* ═══ DIRECTORY  */}
            <BatchPageUsersWithSearchFilter />
        </div>
    );
};
export default BatchesPage;
