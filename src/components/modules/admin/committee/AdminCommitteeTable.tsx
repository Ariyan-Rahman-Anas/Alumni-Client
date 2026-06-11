"use client";

import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { RiDeleteBinLine, RiEditLine, RiCheckLine } from "react-icons/ri";
import type { ICommittee, ICommitteeMemberUser } from "@/types/common/committee.types";

interface AdminCommitteeTableProps {
    data: ICommittee[];
    isLoading: boolean;
    isError: boolean;
    onEdit: (item: ICommittee) => void;
    onDelete: (id: string) => void;
    onSetActive: (id: string) => void;
}

const Skeleton = () => (
    <tr>
        {Array.from({ length: 5 }).map((_, i) => (
            <td key={i} className="px-4 py-3">
                <div className="h-4 rounded bg-gray-100 animate-pulse w-full" />
            </td>
        ))}
    </tr>
);

const AdminCommitteeTable = ({
    data,
    isLoading,
    isError,
    onEdit,
    onDelete,
    onSetActive,
}: AdminCommitteeTableProps) => {
    return (
        <div className="w-full rounded-xl overflow-hidden border">
            <table className="w-full text-sm">
                <thead className="bg-surface-50 border-b">
                    <tr>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">#</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Name</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Period</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Members</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Status</th>
                        <th className="px-4 py-3 text-left font-medium text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} />)
                    ) : isError ? (
                        <tr>
                            <td colSpan={6} className="text-center py-12 text-destructive text-sm">
                                Failed to load committees
                            </td>
                        </tr>
                    ) : data.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                                No committees found
                            </td>
                        </tr>
                    ) : (
                        data.map((item, i) => {
                            const from = format(new Date(item.functionalFrom), "MMM yyyy");
                            const to = item.functionalTo
                                ? format(new Date(item.functionalTo), "MMM yyyy")
                                : "Present";
                            return (
                                <tr key={item._id} className="border-b last:border-0 hover:bg-surface-50/50 transition-colors">
                                    <td className="px-4 py-3 text-muted-foreground">{i + 1}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        {item.description && (
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{item.description}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                                        {from} — {to}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {item.members.slice(0, 3).map((m, mi) => {
                                                const user = typeof m.member === "object" ? (m.member as ICommitteeMemberUser) : null;
                                                return (
                                                    <span key={mi} className="text-xs bg-surface-100 text-gray-600 px-2 py-0.5 rounded-full border">
                                                        {user ? user.name : "—"}
                                                    </span>
                                                );
                                            })}
                                            {item.members.length > 3 && (
                                                <span className="text-xs text-muted-foreground px-1">
                                                    +{item.members.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            className={
                                                item.isActive
                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 border"
                                                    : "bg-gray-100 text-gray-500 border-gray-200 border"
                                            }
                                        >
                                            {item.isActive ? "Active" : "Inactive"}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            {!item.isActive && (
                                                <button
                                                    title="Set as Active"
                                                    onClick={() => onSetActive(item._id)}
                                                    className="p-1.5 rounded hover:bg-emerald-50 text-emerald-600 transition-colors"
                                                >
                                                    <RiCheckLine size={16} />
                                                </button>
                                            )}
                                            <button
                                                title="Edit"
                                                onClick={() => onEdit(item)}
                                                className="p-1.5 rounded hover:bg-blue-50 text-blue-600 transition-colors"
                                            >
                                                <RiEditLine size={16} />
                                            </button>
                                            <button
                                                title="Delete"
                                                onClick={() => onDelete(item._id)}
                                                className="p-1.5 rounded hover:bg-red-50 text-red-600 transition-colors"
                                            >
                                                <RiDeleteBinLine size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AdminCommitteeTable;
