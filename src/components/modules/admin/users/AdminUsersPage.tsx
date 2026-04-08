"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { RiCheckLine, RiDeleteBinLine, RiEyeLine, RiSearchLine, RiFilterLine } from "react-icons/ri";

import DataTable from "@/components/shared/dataTable/DataTable";
import InputField from "@/components/shared/InputField";
import SingleSelect from "@/components/shared/SingleSelect";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import type { TableColumn } from "@/types";
import { constantsData } from "@/constants";
import { useGetAllUsersQuery, useApproveUserMutation, useDeleteUserMutation, type UserProfile } from "@/redux/apis/userApi";
import PrimaryButton from "@/components/shared/PrimaryButton";

type FilterTab = "ALL" | "PENDING" | "APPROVED";

const TABS: { label: string; value: FilterTab }[] = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
];

const BLOOD_GROUP_OPTIONS = constantsData.BLOOD_GROUPS.map((bg) => ({ label: bg, value: bg }));

const MONTH_OPTIONS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
].map((m, i) => ({ label: m, value: String(i + 1) }));

const AdminUsersPage = () => {
    const [page, setPage] = useState(1);
    const [tab, setTab] = useState<FilterTab>("PENDING");
    const [viewUser, setViewUser] = useState<UserProfile | null>(null);
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
    const limit = 10;

    // Debounced text inputs: search, dobYear, dobDay
    const [inputFilters, setInputFilters] = useState({ search: "", dobYear: "", dobDay: "" });
    const [filters, setFilters] = useState({ search: "", dobYear: "", dobDay: "" });
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            setFilters(inputFilters);
            setPage(1);
        }, 400);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [inputFilters]);

    // Immediate select filters
    const [bloodGroup, setBloodGroup] = useState("");
    const [dobMonth, setDobMonth] = useState("");

    const resetFilters = () => {
        setInputFilters({ search: "", dobYear: "", dobDay: "" });
        setBloodGroup("");
        setDobMonth("");
        setPage(1);
    };

    const hasActiveFilter =
        !!inputFilters.search || !!inputFilters.dobYear || !!inputFilters.dobDay ||
        !!bloodGroup || !!dobMonth;

    const approvalStatus = tab === "ALL" ? undefined : tab;

    const { data, isLoading, isError } = useGetAllUsersQuery({
        page,
        limit,
        approvalStatus,
        search: filters.search || undefined,
        bloodGroup: bloodGroup || undefined,
        dobYear: filters.dobYear ? Number(filters.dobYear) : undefined,
        dobMonth: dobMonth ? Number(dobMonth) : undefined,
        dobDay: filters.dobDay ? Number(filters.dobDay) : undefined,
    });
    const [approveUser, { isLoading: isApproving }] = useApproveUserMutation();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

    const handleApprove = async (userId: string) => {
        try {
            await approveUser(userId).unwrap();
            toast.success("User approved successfully");
        } catch (err: unknown) {
            toast.error((err as { data?: { message?: string } })?.data?.message ?? "Failed to approve user");
        }
    };

    const handleDelete = async () => {
        if (!deleteUserId) return;
        try {
            await deleteUser(deleteUserId).unwrap();
            toast.success("User deleted");
            setDeleteUserId(null);
        } catch (err: unknown) {
            toast.error((err as { data?: { message?: string } })?.data?.message ?? "Failed to delete user");
        }
    };

    const columns: TableColumn<UserProfile>[] = [
        { key: "index", label: "#", width: "50px" },
        {
            key: "name",
            label: "Name",
            align: "left" as const,
            render: (u) => (
                <div className="flex items-center gap-2.5">
                    {u.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={u.imageUrl} alt={u.name} className="h-8 w-8 rounded-full object-cover shrink-0" />
                    ) : (
                        <span className="h-8 w-8 rounded-full bg-primary2-100 text-primary2-700 text-xs font-semibold flex items-center justify-center shrink-0">
                            {u.name.slice(0, 2).toUpperCase()}
                        </span>
                    )}
                    <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                </div>
            ),
        },
        {
            key: "email",
            label: "Email",
            align: "left" as const,
            render: (u) => <span className="text-sm text-gray-700 max-w-[180px] truncate block">{u.email}</span>,
        },
        {
            key: "phone",
            label: "Phone",
            width: "130px",
            render: (u) => <span className="text-sm text-gray-600">{u.phone ?? "—"}</span>,
        },
        { key: "batch", label: "Batch", width: "70px", render: (u) => <span className="text-sm">{u.batch ?? "—"}</span> },
        {
            key: "approvalStatus",
            label: "Status",
            width: "95px",
            render: (u) => (
                <Badge
                    className={u.approvalStatus === "APPROVED" ? "bg-emerald-100 text-emerald-700 border-emerald-200 text-xs" : "bg-amber-100 text-amber-700 border-amber-200 text-xs"}
                >
                    {u.approvalStatus}
                </Badge>
            ),
        },
        {
            key: "actions",
            label: "Actions",
            width: "130px",
            render: (u) => (
                <div className="flex items-center justify-center gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        title="View profile"
                        onClick={() => setViewUser(u)}
                        className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                    >
                        <RiEyeLine className="text-base" />
                    </Button>
                    {u.approvalStatus === "PENDING" && (
                        <Button
                            size="icon"
                            variant="ghost"
                            title="Approve"
                            disabled={isApproving}
                            onClick={() => handleApprove(u._id)}
                            className="h-8 w-8 text-emerald-600 hover:bg-emerald-50"
                        >
                            <RiCheckLine className="text-base" />
                        </Button>
                    )}
                    <Button
                        size="icon"
                        variant="ghost"
                        title="Delete"
                        onClick={() => setDeleteUserId(u._id)}
                        className="h-8 w-8 text-red-500 hover:bg-red-50"
                    >
                        <RiDeleteBinLine className="text-base" />
                    </Button>
                </div>
            ),
        },
    ];

    const meta = data?.meta;
    const paginationOptions = meta
        ? { count: meta.total, current_page: meta.page, num_pages: meta.totalPage }
        : undefined;

    return (
        <div className="p-4 sm:p-6 md:p-8">
            {/* Header */}
            <div className="mb-5">
                <h1 className="text-xl font-semibold text-gray-900">Users</h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                    Review registrations and manage user accounts.
                </p>
            </div>

            {/* Row 1 — Search + Status tabs */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-3">
                <InputField
                    icon={<RiSearchLine />}
                    placeholder="Search by name, email, phone..."
                    value={inputFilters.search}
                    onChange={(e) => setInputFilters((p) => ({ ...p, search: e.target.value }))}
                    containerClassName="flex-1 max-w-sm"
                    className="h9 text-sm"
                />

                {/* Status tabs */}
                <div className="flex items-center gap-0.5 border border-gray-200 rounded-lg p-0.5 bg-gray-50 shrink-0 h-10">
                    <RiFilterLine className="ml-2 text-gray-400 text-sm shrink-0" />
                    {TABS.map((t) => (
                        <button
                            key={t.value}
                            type="button"
                            onClick={() => { setTab(t.value); setPage(1); }}
                            className={`px-3 h-full text-xs font-medium rounded-md transition-all ${tab === t.value
                                    ? "bg-white text-primary2-700 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {t.label}
                            {t.value === "PENDING" && data?.meta?.total !== undefined && tab === "PENDING" && (
                                <span className="ml-1 rounded-full bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 font-semibold">
                                    {data.meta.total}
                                </span>
                            )}
                        </button>
                    ))}
                </div>


                {/* Row 2 — Extra filters */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 ">
                    <SingleSelect
                        options={BLOOD_GROUP_OPTIONS}
                        value={bloodGroup}
                        onValueChange={(v) => { setBloodGroup(v); setPage(1); }}
                        placeholder="Blood group"
                        searchable={false}
                        allowDeselect
                        width="w-28"
                        label=""
                    />
                    <InputField
                        label=""
                        type="number"
                        placeholder="B. Year"
                        min={1900}
                        max={2099}
                        value={inputFilters.dobYear}
                        onChange={(e) => setInputFilters((p) => ({ ...p, dobYear: e.target.value }))}
                        className="w-28"
                    />
                    <SingleSelect
                        options={MONTH_OPTIONS}
                        value={dobMonth}
                        onValueChange={(v) => { setDobMonth(v); setPage(1); }}
                        placeholder="Month"
                        searchable={false}
                        allowDeselect
                        width="w-28"
                        label=""
                    />
                    <InputField
                        label=""
                        type="number"
                        placeholder="B. Day"
                        min={1}
                        max={31}
                        value={inputFilters.dobDay}
                        onChange={(e) => setInputFilters((p) => ({ ...p, dobDay: e.target.value }))}
                        containerClassName="w28"
                        className="w-28"
                    />
                    {hasActiveFilter && (
                        <PrimaryButton
                            type="button"
                            onClick={resetFilters}
                            title="Clear" variant="destructive" className="py-[18px] "
                        />
                    )}
                </div>

            </div>

            

            <DataTable<UserProfile>
                data={data?.data ?? []}
                columns={columns}
                isLoading={isLoading}
                isError={isError}
                errorMessage="Failed to load users"
                emptyMessage={
                    filters.search
                        ? `No users matching "${filters.search}"`
                        : hasActiveFilter
                          ? "No users match the selected filters"
                          : tab === "PENDING"
                            ? "No pending users — all clear!"
                            : "No users found"
                }
                isPaginate={!!paginationOptions}
                paginationOptions={paginationOptions}
                pageSize={limit}
                onPageChange={setPage}
            />

            {/* View User Dialog */}
            <Dialog open={!!viewUser} onOpenChange={(o) => !o && setViewUser(null)}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>User Profile</DialogTitle>
                    </DialogHeader>
                    {viewUser && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                {viewUser.imageUrl ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img src={viewUser.imageUrl} alt={viewUser.name} className="h-16 w-16 rounded-2xl object-cover" />
                                ) : (
                                    <span className="h-16 w-16 rounded-2xl bg-primary2-100 text-primary2-700 text-xl font-bold flex items-center justify-center">
                                        {viewUser.name.slice(0, 2).toUpperCase()}
                                    </span>
                                )}
                                <div>
                                    <p className="font-semibold text-gray-900">{viewUser.name}</p>
                                    <p className="text-sm text-muted-foreground">{viewUser.email}</p>
                                    <p className="text-sm text-muted-foreground">{viewUser.phone}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-sm">
                                {[
                                    ["Batch", viewUser.batch],
                                    ["Blood Group", viewUser.bloodGroup],
                                    ["Workplace", viewUser.workplace || "—"],
                                    ["Position", viewUser.position || "—"],
                                    ["Approval", viewUser.approvalStatus],
                                    ["Email Verified", viewUser.isVerified ? "Yes" : "No"],
                                ].map(([label, value]) => (
                                    <div key={String(label)}>
                                        <p className="text-xs text-muted-foreground">{label}</p>
                                        <p className="font-medium text-gray-800">{String(value ?? "—")}</p>
                                    </div>
                                ))}
                            </div>

                            {viewUser.currentAddress && (
                                <div className="text-sm">
                                    <p className="text-xs text-muted-foreground">Current Address</p>
                                    <p className="text-gray-800">{viewUser.currentAddress}</p>
                                </div>
                            )}

                            {/* Alumni Proof */}
                            {viewUser.alumniProofUrl && (
                                <div>
                                    <p className="text-xs text-muted-foreground mb-1.5">Alumni Proof</p>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={viewUser.alumniProofUrl}
                                        alt="Alumni proof"
                                        className="w-full max-h-56 object-contain rounded-xl border border-gray-200"
                                    />
                                    <a
                                        href={viewUser.alumniProofUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-1.5 inline-flex items-center gap-1 text-xs text-primary2-600 hover:underline"
                                    >
                                        <RiSearchLine className="text-sm" /> Open full image
                                    </a>
                                </div>
                            )}

                            {viewUser.approvalStatus === "PENDING" && (
                                <div className="pt-2 flex justify-end">
                                    <Button
                                        onClick={() => { handleApprove(viewUser._id); setViewUser(null); }}
                                        disabled={isApproving}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    >
                                        <RiCheckLine className="mr-1.5" />
                                        {isApproving ? "Approving..." : "Approve User"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirm */}
            <AlertDialog open={!!deleteUserId} onOpenChange={(o) => !o && setDeleteUserId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete User</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the user account and all associated data. This cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AdminUsersPage;
