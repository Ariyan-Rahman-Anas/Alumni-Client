"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
    RiSendPlaneLine,
    RiFileListLine,
    RiTimeLine,
    RiCheckLine,
    RiCloseLine,
    RiSearchLine,
    RiAddLine,
    RiMessage2Line,
} from "react-icons/ri";
import { useCreateRequestMutation, useGetMyRequestsQuery } from "@/redux/apis/requestApi";
import type { TRequestCategory, TRequestStatus } from "@/types/request.types";
import DateFormatter from "@/lib/DateFormatter";
import SingleSelect from "@/components/shared/SingleSelect";
import { useFormWithToast } from "@/hooks/useFormWithToast";

/* ”€”€ Schema ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€ */
const schema = z.object({
    category: z.enum(["general", "correction", "complaint", "suggestion", "other"]),
    subject: z.string().trim().min(5, "Subject must be at least 5 characters").max(150),
    description: z.string().trim().min(10, "Description must be at least 10 characters").max(1000),
});
type TFormValues = z.infer<typeof schema>;

/* ”€”€ Constants ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€ */
const STATUS_STYLES: Record<TRequestStatus, string> = {
    PENDING: "bg-amber-50 text-amber-700 border border-amber-200",
    IN_REVIEW: "bg-blue-50 text-blue-700 border border-blue-200",
    RESOLVED: "bg-primary2-50 text-primary2-700 border border-primary2-200",
    REJECTED: "bg-red-50 text-red-700 border border-red-200",
};

const STATUS_ICONS: Record<TRequestStatus, React.ReactNode> = {
    PENDING: <RiTimeLine className="text-sm" />,
    IN_REVIEW: <RiSearchLine className="text-sm" />,
    RESOLVED: <RiCheckLine className="text-sm" />,
    REJECTED: <RiCloseLine className="text-sm" />,
};

const STATUS_LABELS: Record<TRequestStatus, string> = {
    PENDING: "Pending",
    IN_REVIEW: "In Review",
    RESOLVED: "Resolved",
    REJECTED: "Rejected",
};

const CATEGORY_LABELS: Record<TRequestCategory, string> = {
    general: "General",
    correction: "Correction",
    complaint: "Complaint",
    suggestion: "Suggestion",
    other: "Other",
};

/* ”€”€ Component ”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€”€ */
export default function MyRequestsPanel() {
    const [showForm, setShowForm] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const { data, isLoading } = useGetMyRequestsQuery({ limit: 20 });
    const [createRequest, { isLoading: isSubmitting }] = useCreateRequestMutation();
    const requests = data?.data ?? [];

    const methods = useFormWithToast<TFormValues>(
        {
            resolver: zodResolver(schema),
        },
        { fieldOrder: ["category", "subject", "description"] }
    );

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = methods;

    const onSubmit = async (values: TFormValues) => {
        try {
            const res = await createRequest(values).unwrap();
            toast.success(res.message || "Request submitted successfully");
            reset();
            setSelectedCategory("");
            setShowForm(false);
        } catch { }
    };

    return (
        <div>
            {/* Header */}
            <div className="flex items-center gap-2 mb-5">
                <RiFileListLine className="text-xl text-primary2-700" />
                <h2 className="text-lg font-bold text-primary2-900">My Requests</h2>
                <span className="ml-auto text-xs text-muted-foreground">{requests.length} total</span>
                <button
                    type="button"
                    onClick={() => setShowForm((v) => !v)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-primary2-700 text-white hover:bg-primary2-800 transition-colors"
                >
                    <RiAddLine className="text-sm" />
                    New Request
                </button>
            </div>

            {/* New request form */}
            {showForm && (
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="mb-6 bg-white rounded-2xl border border-surface-200 p-5 space-y-4"
                >
                    <h3 className="font-semibold text-gray-900">Submit a Request</h3>

                    <SingleSelect
                        id="category"
                        value={selectedCategory}
                        onValueChange={(val) => {
                            setSelectedCategory(val);
                            setValue("category", val as TFormValues["category"], { shouldValidate: true });
                        }}
                        options={Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                            { value: val, label }
                        ))}
                        placeholder="Select category"
                        searchable={false}
                        error={errors.category ? true : undefined}
                    />

                    <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-medium">Subject</label>
                        <input
                            {...register("subject")}
                            maxLength={150}
                            placeholder="Brief subject of your request¦"
                            className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary2-400"
                        />
                        {errors.subject && <p className="text-xs text-red-500">{errors.subject.message}</p>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs text-muted-foreground font-medium">Description</label>
                        <textarea
                            {...register("description")}
                            maxLength={1000}
                            rows={4}
                            placeholder="Describe your request in detail¦"
                            className="w-full rounded-lg border border-surface-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary2-400 resize-none"
                        />
                        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                            type="button"
                            onClick={() => { reset(); setShowForm(false); }}
                            className="text-sm px-4 py-2 rounded-lg border border-surface-200 hover:bg-surface-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-primary2-700 text-white hover:bg-primary2-800 transition-colors disabled:opacity-50"
                        >
                            <RiSendPlaneLine />
                            {isSubmitting ? "Submitting¦" : "Submit"}
                        </button>
                    </div>
                </form>
            )}

            {/* Request list */}
            {isLoading ? (
                <div className="space-y-4 animate-pulse">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl border border-surface-200 p-5">
                            <div className="h-4 w-48 bg-surface-200 rounded mb-2" />
                            <div className="h-3 w-32 bg-surface-200 rounded" />
                        </div>
                    ))}
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-white rounded-2xl border border-surface-200 p-12 text-center">
                    <RiFileListLine className="text-4xl text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium text-primary2-900">No requests yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Submit a request to get in touch with the admin.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((req) => (
                        <div key={req._id} className="bg-white rounded-2xl border border-surface-200 p-5">
                            <div className="flex items-start gap-3 justify-between flex-wrap">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-surface-100 border text-muted-foreground">
                                            {CATEGORY_LABELS[req.category]}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            <DateFormatter date={req.createdAt} />
                                        </span>
                                    </div>
                                    <h4 className="font-semibold text-gray-900 truncate">{req.subject}</h4>
                                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{req.description}</p>
                                </div>
                                <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${STATUS_STYLES[req.status]}`}>
                                    {STATUS_ICONS[req.status]}
                                    {STATUS_LABELS[req.status]}
                                </span>
                            </div>

                            {/* Admin message */}
                            {req.adminMessage && (
                                <div className="mt-4 flex items-start gap-2 p-3 rounded-xl bg-primary2-50 border border-primary2-100">
                                    <RiMessage2Line className="text-primary2-600 text-base mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-xs font-semibold text-primary2-700 mb-0.5">Admin Response</p>
                                        <p className="text-sm text-primary2-800 leading-relaxed">{req.adminMessage}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
