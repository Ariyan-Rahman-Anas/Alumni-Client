"use client";

import { useState } from "react";
import { RiAddLine } from "react-icons/ri";

import AdminPageHead from "@/components/shared/admin/AdminPageHead";
import PrimaryButton from "@/components/shared/PrimaryButton";
import AdminCommitteeTable from "@/components/modules/admin/committee/AdminCommitteeTable";

const AdminCommitteePage = () => {
    const [formOpen, setFormOpen] = useState(false);

    return (
        <div className="admin-page-setup">
            <div className="flex items-start justify-between mb-6">
                <AdminPageHead
                    title="Committee"
                    description="Manage alumni committee members and designations shown on the About page."
                />
                <PrimaryButton
                    type="button"
                    title="New Committee"
                    icon={<RiAddLine />}
                    iconSide="left"
                    onClick={() => setFormOpen(true)}
                />
            </div>

            <AdminCommitteeTable
                openNew={formOpen}
                onNewClose={() => setFormOpen(false)}
            />
        </div>
    );
};

export default AdminCommitteePage;
