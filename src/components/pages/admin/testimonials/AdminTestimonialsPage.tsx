"use client";

import { useState } from "react";
import AdminPageHead from "@/components/shared/admin/AdminPageHead";
import type { TTestimonialStatus } from "@/types/common/testimonial.types";
import AdminTestimonialsTable from "@/components/modules/admin/testimonials/AdminTestimonialsTable";

const TABS: { label: string; value: TTestimonialStatus; color: string }[] = [
    { label: "Pending", value: "PENDING", color: "text-amber-600" },
    { label: "Approved", value: "APPROVED", color: "text-green-600" },
    { label: "Rejected", value: "REJECTED", color: "text-red-500" },
];

const AdminTestimonialsPage = () => {
    const [activeTab, setActiveTab] = useState<TTestimonialStatus>("PENDING");

    return (
        <div className="admin-page-setup">
            <div className="mb-6">
                <AdminPageHead
                    title="Testimonials"
                    description="Review alumni testimonials. Approve to publish on the home page, or reject with feedback."
                />
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 mb-5 border-b border-surface-300">
                {TABS.map(({ label, value, color }) => {
                    const isActive = activeTab === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setActiveTab(value)}
                            className={`px-4 py-2.5 text-sm font-medium transition-all relative ${isActive
                                    ? `${color} border-b-2 border-current`
                                    : "text-muted-foreground hover:text-gray-700"
                                }`}
                        >
                            {label}
                        </button>
                    );
                })}
            </div>

            <AdminTestimonialsTable status={activeTab} />
        </div>
    );
};

export default AdminTestimonialsPage;

