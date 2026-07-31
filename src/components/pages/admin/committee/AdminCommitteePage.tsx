"use client";

import { useState } from "react";
import { RiAddLine } from "react-icons/ri";

import AdminPageHead from "@/components/shared/admin/AdminPageHead";
import PrimaryButton from "@/components/shared/PrimaryButton";
import AdminCommitteeTable from "@/components/modules/admin/committee/AdminCommitteeTable";

const AdminCommitteePage = () => {
    const [formOpen, setFormOpen] = useState(false);

    return (
        <div>
            {/* Header */}
            <AdminPageHead
                title="Committee"
                description="Manage alumni committee members and designations shown on the About page."
            />
            <div className="admin-page-setup">
                <PrimaryButton
                    type="button"
                    title="New Committee"
                    icon={<RiAddLine />}
                    iconSide="left"
                    onClick={() => setFormOpen(true)}
                />

                <AdminCommitteeTable
                    openNew={formOpen}
                    onNewClose={() => setFormOpen(false)}
                />
            </div>
        </div>
    );
};

export default AdminCommitteePage;
