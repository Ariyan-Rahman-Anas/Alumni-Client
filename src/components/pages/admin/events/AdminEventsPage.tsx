"use client";

import { useState } from "react";
import { toast } from "sonner";
import { RiAddLine } from "react-icons/ri";

import PrimaryButton from "@/components/shared/PrimaryButton";
import DeleteAlertModal from "@/components/shared/DeleteAlertModal";
import {
    useGetAllEventsAdminQuery,
    useDeleteEventMutation,
} from "@/redux/apis/eventApi";
import AdminEventFormModal from "@/components/modules/admin/events/AdminEventFormModal";
import AdminEventsTable from "@/components/modules/admin/events/AdminEventsTable";
import AdminPageHead from "@/components/shared/admin/AdminPageHead";
import AdminEventRegistrationsPanel from "@/components/modules/admin/events/AdminEventRegistrationsPanel";
import { IEvent } from "@/types/common/events.types";
import { constantsData } from "@/constants";

type StatusFilter = "ALL" | "UPCOMING" | "ONGOING" | "COMPLETED" | "CANCELLED";

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "ALL" },
    { label: "Upcoming", value: "UPCOMING" },
    { label: "Ongoing", value: "ONGOING" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Cancelled", value: "CANCELLED" },
];

const AdminEventsPage = () => {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
    const [formOpen, setFormOpen] = useState(false);
    const [editEvent, setEditEvent] = useState<IEvent | null>(null);
    const [deleteEventId, setDeleteEventId] = useState<string | null>(null);
    const [viewRegsEvent, setViewRegsEvent] = useState<IEvent | null>(null);

    const { data, isLoading, isError } = useGetAllEventsAdminQuery({
        page,
        limit: constantsData.TABLE_PAGE_SIZE,
        status: statusFilter === "ALL" ? undefined : statusFilter,
    });

    const [deleteEvent, { isLoading: isDeleting }] = useDeleteEventMutation();

    const handleDelete = async () => {
        if (!deleteEventId) return;
        try {
            await deleteEvent(deleteEventId).unwrap();
            toast.success("Event deleted");
            setDeleteEventId(null);
        } catch (err: unknown) {
            toast.error(
                (err as { data?: { message?: string } })?.data?.message ?? "Failed to delete event"
            );
        }
    };

    const handleStatusTab = (val: StatusFilter) => {
        setStatusFilter(val);
        setPage(1);
    };

    const meta = data?.meta;
    const paginationOptions = meta
        ? { count: meta.total, current_page: meta.page, num_pages: meta.totalPage }
        : undefined;

    return (
        <div>
            {/* Header */}
            <AdminPageHead
                title="Events"
                description="Create and manage alumni events, reunions, and programs."
            />

            <div className="admin-page-setup">
                <div className="flex flex-col md:flex-row items-end justify-between">
                    {/* Status Tabs */}
                    <div className="flex items-center flex-wrap gap-1 border-b border-surface-300">
                        {STATUS_TABS.map(({ label, value }) => (
                            <button
                                key={value}
                                onClick={() => handleStatusTab(value)}
                                className={`relative px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === value
                                    ? "text-primary2-700"
                                    : "text-muted-foreground hover:text-gray-700"
                                    }`}
                            >
                                {label}
                                {statusFilter === value && (
                                    <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary2-500 rounded-full" />
                                )}
                            </button>
                        ))}
                    </div>

                    <PrimaryButton
                        type="button"
                        title="Add Event"
                        icon={<RiAddLine />}
                        iconSide="left"
                        onClick={() => {
                            setEditEvent(null);
                            setFormOpen(true);
                        }}
                    />
                </div>

                {/* Table */}
                <AdminEventsTable
                    data={data?.data ?? []}
                    isLoading={isLoading}
                    isError={isError}
                    paginationOptions={paginationOptions}
                    pageSize={constantsData.TABLE_PAGE_SIZE}
                    onPageChange={setPage}
                    onEdit={(ev) => {
                        setEditEvent(ev);
                        setFormOpen(true);
                    }}
                    onDelete={setDeleteEventId}
                    onViewRegistrations={setViewRegsEvent}
                />

                {/* Form Sheet */}
                <AdminEventFormModal
                    open={formOpen}
                    onClose={() => {
                        setFormOpen(false);
                        setEditEvent(null);
                    }}
                    event={editEvent}
                />

                {/* Delete Confirmation */}
                <DeleteAlertModal
                    open={!!deleteEventId}
                    onClose={() => setDeleteEventId(null)}
                    onConfirm={handleDelete}
                    isDeleting={isDeleting}
                    title="Delete Event"
                    description="This will permanently delete the event and all associated data. This action cannot be undone."
                />

                {/* Registrations Panel */}
                {viewRegsEvent && (
                    <AdminEventRegistrationsPanel
                        eventId={viewRegsEvent._id}
                        eventTitle={viewRegsEvent.title}
                        onClose={() => setViewRegsEvent(null)}
                    />
                )}
            </div>
        </div>
    );
};
export default AdminEventsPage;