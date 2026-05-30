"use client";

import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
    RiDeleteBinLine,
    RiEditLine,
    RiPushpin2Line,
    RiPushpinLine,
    RiEyeLine,
} from "react-icons/ri";
import { IAnnouncement, TAnnouncementStatus } from "../../user/announcements/announcement.types";

/* â”€â”€ Badge helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
const STATUS_COLORS: Record<TAnnouncementStatus, string> = {
    draft: "bg-gray-100 text-gray-600 border-gray-200",
    published: "bg-primary2-50 text-primary2-700 border-primary2-200",
    scheduled: "bg-blue-50 text-blue-700 border-blue-200",
    archived: "bg-orange-50 text-orange-700 border-orange-200",
};

const PRIORITY_COLORS = {
    urgent: "bg-red-50 text-red-700 border-red-200",
    high: "bg-amber-50 text-amber-700 border-amber-200",
    normal: "bg-surface-100 text-gray-600 border-surface-200",
};

interface AdminAnnouncementsTableProps {
    data: IAnnouncement[];
    isLoading: boolean;
    isError: boolean;
    paginationOptions?: { count: number; current_page: number; num_pages: number };
    pageSize: number;
    onPageChange: (page: number) => void;
    onEdit: (item: IAnnouncement) => void;
    onDelete: (id: string) => void;
    onTogglePin: (id: string) => void;
    isTogglingPin?: boolean;
}

const Skeleton = () => (
    <tr>
        {Array.from({ length: 6 }).map((_, i) => (
            <td key={i} className="px-4 py-3">
                <div className="h-4 rounded bg-gray-100 animate-pulse w-full" />
            </td>
        ))}
    </tr>
);

const AdminAnnouncementsTable = ({
    data,
    isLoading,
    isError,
    paginationOptions,
    pageSize,
    onPageChange,
    onEdit,
    onDelete,
    onTogglePin,
    isTogglingPin,
}: AdminAnnouncementsTableProps) => {
    return (
        <div className="rounded-2xl border border-surface-200 bg-white overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-surface-200 bg-surface-50">
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Title</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Type</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Priority</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Published</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Views</th>
                            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-100">
                        {isLoading ? (
                            Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} />)
                        ) : isError ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-10 text-center text-sm text-red-500">
                                    Failed to load announcements.
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">
                                    No announcements found.
                                </td>
                            </tr>
                        ) : (
                            data.map((item) => (
                                <tr key={item._id} className="hover:bg-surface-50 transition-colors">
                                    <td className="px-4 py-3 max-w-[260px]">
                                        <div className="flex items-center gap-2">
                                            {item.isPinned && (
                                                <RiPushpin2Line className="text-primary2-600 shrink-0" title="Pinned" />
                                            )}
                                            <span className="font-medium text-gray-900 truncate">{item.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge variant="outline" className="capitalize text-xs">
                                            {item.type}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant="outline"
                                            className={`capitalize text-xs ${PRIORITY_COLORS[item.priority]}`}
                                        >
                                            {item.priority}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3">
                                        <Badge
                                            variant="outline"
                                            className={`capitalize text-xs ${STATUS_COLORS[item.status]}`}
                                        >
                                            {item.status}
                                        </Badge>
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                                        {item.publishedAt
                                            ? format(new Date(item.publishedAt), "dd MMM yyyy")
                                            : "â€”"}
                                    </td>
                                    <td className="px-4 py-3 text-muted-foreground text-xs">
                                        <span className="inline-flex items-center gap-1">
                                            <RiEyeLine /> {item.viewCount}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-end gap-1">
                                            <button
                                                type="button"
                                                title={item.isPinned ? "Unpin" : "Pin"}
                                                disabled={isTogglingPin}
                                                onClick={() => onTogglePin(item._id)}
                                                className={`h-8 w-8 flex items-center justify-center rounded-lg transition-colors ${item.isPinned
                                                        ? "text-primary2-600 bg-primary2-50 hover:bg-primary2-100"
                                                        : "text-muted-foreground hover:bg-surface-100"
                                                    }`}
                                            >
                                                {item.isPinned ? <RiPushpin2Line /> : <RiPushpinLine />}
                                            </button>
                                            <button
                                                type="button"
                                                title="Edit"
                                                onClick={() => onEdit(item)}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-surface-100 hover:text-gray-700 transition-colors"
                                            >
                                                <RiEditLine />
                                            </button>
                                            <button
                                                type="button"
                                                title="Delete"
                                                onClick={() => onDelete(item._id)}
                                                className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                                            >
                                                <RiDeleteBinLine />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {paginationOptions && paginationOptions.num_pages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-surface-200">
                    <p className="text-xs text-muted-foreground">
                        Showing{" "}
                        {Math.min(
                            (paginationOptions.current_page - 1) * pageSize + 1,
                            paginationOptions.count,
                        )}
                        â€“{Math.min(paginationOptions.current_page * pageSize, paginationOptions.count)} of{" "}
                        {paginationOptions.count}
                    </p>
                    <div className="flex gap-1">
                        {Array.from({ length: paginationOptions.num_pages }, (_, i) => i + 1).map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => onPageChange(p)}
                                className={`h-7 w-7 text-xs rounded-lg transition-colors ${p === paginationOptions.current_page
                                        ? "bg-primary2-700 text-white"
                                        : "hover:bg-surface-100 text-muted-foreground"
                                    }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAnnouncementsTable;
