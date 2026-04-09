"use client";

import { useState } from "react";

import AdminUsersSearchFilter, { type UserFilterValues } from "@/components/modules/admin/users/AdminUsersSearchFilter";
import AdminUsersTable from "@/components/modules/admin/users/AdminUsersTable";

const AdminUsersPage = () => {
    const [page, setPage] = useState(1);
    const limit = 10;
    const [filters, setFilters] = useState<UserFilterValues>({
        approvalStatus: "PENDING",
        search: undefined,
        bloodGroup: undefined,
        dobYear: undefined,
        dobMonth: undefined,
        dobDay: undefined,
        isVerified: undefined,
    });

    const emptyMessage = filters.search
        ? `No users matching "${filters.search}"`
        : filters.approvalStatus === "PENDING"
            ? "No pending users — all clear!"
            : Object.values(filters).some(Boolean)
                ? "No users match the selected filters"
                : "No users found";

    return (
        <div className="p-4 sm:p-6 md:p-8">
            <div className="mb-5">
                <h1 className="text-xl font-semibold text-gray-900">Users</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Review registrations and manage user accounts.
                </p>
            </div>

            <AdminUsersSearchFilter
                onChange={setFilters}
                onPageReset={() => setPage(1)}
            />

            <AdminUsersTable
                page={page}
                limit={limit}
                onPageChange={setPage}
                approvalStatus={filters.approvalStatus}
                search={filters.search}
                bloodGroup={filters.bloodGroup}
                dobYear={filters.dobYear}
                dobMonth={filters.dobMonth}
                dobDay={filters.dobDay}
                isVerified={filters.isVerified}
                emptyMessage={emptyMessage}
            />
        </div>
    );
};

export default AdminUsersPage;
