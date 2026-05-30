"use client";

import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";
import { Badge } from "@/components/ui/badge";
import { useGetBatchByIdQuery } from "@/redux/apis/batchApi";

export default function AdminBatchDetailPage({ id }: { id: string }) {
    const { data: batchData, isLoading: batchLoading } = useGetBatchByIdQuery(id);
    const batch = batchData?.data;

    if (batchLoading) return <div className="p-8 text-sm text-muted-foreground">Loading...</div>;
    if (!batch) return <div className="p-8 text-sm text-muted-foreground">Batch not found.</div>;

    return (
        <div className="three-xl-section-setup pb-20 space-y-8">
            <Link href="/admin/batches" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary2-700 transition-colors">
                <RiArrowLeftLine /> Back to Batches
            </Link>

            <div className="rounded-2xl border border-surface-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-primary2-900">Batch {batch.year}</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant={batch.isActive ? "default" : "secondary"}
                                className={batch.isActive ? "bg-primary2-100 text-primary2-700 border-primary2-200" : ""}>
                                {batch.isActive ? "Active" : "Inactive"}
                            </Badge>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                        {[
                            { label: "Total", value: batch.stats?.totalRegistrations ?? 0 },
                            { label: "Approved", value: batch.stats?.approved ?? 0 },
                            { label: "Last 30 days", value: batch.stats?.last30Days ?? 0 },
                            { label: "Science / Commerce / Arts", value: `${batch.stats?.scienceCount ?? 0} / ${batch.stats?.commerceCount ?? 0} / ${batch.stats?.artsCount ?? 0}` },
                        ].map((s) => (
                            <div key={s.label} className="rounded-xl border border-surface-200 bg-surface-50 px-4 py-3">
                                <p className="text-lg font-bold text-primary2-900">{s.value}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
