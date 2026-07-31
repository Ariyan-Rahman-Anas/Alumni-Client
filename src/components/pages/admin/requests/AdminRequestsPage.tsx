"use client";

import { useState } from "react";
import AdminPageHead from "@/components/shared/admin/AdminPageHead";
import AdminRequestsTable from "@/components/modules/admin/requests/AdminRequestsTable";
import { constantsData } from "@/constants";
import { TRequestCategory, TRequestStatus } from "@/types/request.types";
import SingleSelect from "@/components/shared/SingleSelect";
import InputField from "@/components/shared/InputField";

const STATUSES: { label: string; value: TRequestStatus | "" }[] = [
    { label: "All Statuses", value: "" },
    { label: "Pending", value: "PENDING" },
    { label: "In Review", value: "IN_REVIEW" },
    { label: "Resolved", value: "RESOLVED" },
    { label: "Rejected", value: "REJECTED" },
];

const CATEGORIES: { label: string; value: TRequestCategory | "" }[] = [
    { label: "All Categories", value: "" },
    { label: "General", value: "general" },
    { label: "Correction", value: "correction" },
    { label: "Complaint", value: "complaint" },
    { label: "Suggestion", value: "suggestion" },
    { label: "Other", value: "other" },
];

const AdminRequestsPage = () => {
    const [page, setPage] = useState(1);
    const limit = constantsData.TABLE_PAGE_SIZE;
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<TRequestStatus | "">("");
    const [category, setCategory] = useState<TRequestCategory | "">("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    return (
        <div>
            {/* Header */}
            <AdminPageHead
                title="Alumni Requests"
                description="Manage and respond to requests submitted by alumni."
            />
            <div className="admin-page-setup">
                <div className="flex items-center justify-between gap-4 mt-4">
                    <div className="w-full max-w-lg">
                        <InputField
                            label=""
                            placeholder="Search by subject or description…"
                            onChange={handleSearchChange}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <SingleSelect
                            value={status}
                            onValueChange={(v) => { setStatus(v as TRequestStatus | ""); setPage(1); }}
                            options={STATUSES.map(s => ({ value: s.value, label: s.label }))}
                            placeholder="Status"
                            searchable={false}
                        />

                        <SingleSelect
                            value={category}
                            onValueChange={(v) => { setCategory(v as TRequestCategory | ""); setPage(1); }}
                            options={CATEGORIES.map(c => ({ value: c.value, label: c.label }))}
                            placeholder="Category"
                            searchable={false}
                        />
                    </div>
                </div>

                <AdminRequestsTable
                    page={page}
                    limit={limit}
                    onPageChange={setPage}
                    search={search || undefined}
                    status={status || undefined}
                    category={category || undefined}
                />
            </div>
        </div>
    );
};
export default AdminRequestsPage;