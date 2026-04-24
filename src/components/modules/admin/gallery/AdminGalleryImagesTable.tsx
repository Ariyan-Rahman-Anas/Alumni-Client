import Image from "next/image";
import { useState } from "react";
import DataTable from "@/components/shared/dataTable/DataTable";
import { Button } from "@/components/ui/button";
import type { TableColumn } from "@/types";
import DateFormatter from "@/lib/DateFormatter";
import {
    useDeleteGalleryMutation,
    useDeleteMultipleGalleriesMutation,
    useToggleGalleryPublishMutation,
    useToggleGalleryPublishMultipleMutation,
    type GalleryImage,
} from "@/redux/apis/galleryApi";
import { toast } from "sonner";
import AdminGalleryImageEditSheet from "./AdminGalleryImageEditSheet";
import { Trash2, ToggleLeft } from "lucide-react";

interface AdminGalleryImagesTableProps {
    galleries: GalleryImage[];
    isLoading: boolean;
    isError?: boolean;
    errorMessage?: string;
    paginationOptions?: any;
    pageSize?: number;
    onPageChange?: (page: number) => void;
}

const getCategoryName = (cat: GalleryImage["category"]): string => {
    if (typeof cat === "object" && cat !== null) return cat.name;
    return String(cat ?? "");
};

const AdminGalleryImagesTable = ({
    galleries,
    isLoading,
    isError = false,
    errorMessage = "Failed to load gallery images",
    paginationOptions,
    pageSize,
    onPageChange,
}: AdminGalleryImagesTableProps) => {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [editItem, setEditItem] = useState<GalleryImage | null>(null);

    const [deleteGallery] = useDeleteGalleryMutation();
    const [deleteMultiple] = useDeleteMultipleGalleriesMutation();
    const [togglePublish] = useToggleGalleryPublishMutation();
    const [togglePublishMultiple] = useToggleGalleryPublishMultipleMutation();

    const allIds = galleries.map((g) => g._id);
    const isAllSelected = allIds.length > 0 && selectedIds.length === allIds.length;

    const toggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        setSelectedIds(isAllSelected ? [] : allIds);
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteGallery(id).unwrap();
            toast.success("Image deleted");
            setSelectedIds((prev) => prev.filter((x) => x !== id));
        } catch (error) {
            toast.error(
                (error as { data?: { message?: string } })?.data?.message ?? "Failed to delete"
            );
        }
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        try {
            const res = await deleteMultiple(selectedIds).unwrap();
            toast.success(res.message ?? `${selectedIds.length} image(s) deleted`);
            setSelectedIds([]);
        } catch (error) {
            toast.error(
                (error as { data?: { message?: string } })?.data?.message ?? "Failed to delete"
            );
        }
    };

    const handleTogglePublish = async (id: string) => {
        try {
            await togglePublish(id).unwrap();
        } catch (error) {
            toast.error(
                (error as { data?: { message?: string } })?.data?.message ?? "Failed to update"
            );
        }
    };

    const handleBulkTogglePublish = async () => {
        if (selectedIds.length === 0) return;
        try {
            const res = await togglePublishMultiple(selectedIds).unwrap();
            toast.success(res.message ?? `${selectedIds.length} image(s) updated`);
            setSelectedIds([]);
        } catch (error) {
            toast.error(
                (error as { data?: { message?: string } })?.data?.message ?? "Failed to update"
            );
        }
    };

    const columns: TableColumn<GalleryImage>[] = [
        {
            key: "_id" as keyof GalleryImage,
            label: (
                <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 rounded border-gray-300"
                    aria-label="Select all"
                />
            ) as unknown as string,
            render: (item) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(item._id)}
                    onChange={() => toggleSelect(item._id)}
                    className="h-4 w-4 rounded border-gray-300"
                    aria-label={`Select ${item.title}`}
                />
            ),
        },
        {
            key: "imageUrl",
            label: "Image",
            render: (item) =>
                item.imageUrl ? (
                    <div className="overflow-hidden rounded bg-gray-100">
                        <Image
                            src={item.imageUrl}
                            height={500}
                            width={500}
                            alt={item.title}
                            className="h-14 w-14 object-cover rounded"
                        />
                    </div>
                ) : (
                    <span className="text-gray-400 text-xs">No image</span>
                ),
        },
        {
            key: "title",
            label: "Title",
            render: (item) => (
                <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    {item.innerTitle && (
                        <p className="text-xs text-gray-400">{item.innerTitle}</p>
                    )}
                </div>
            ),
        },
        {
            key: "category",
            label: "Category",
            render: (item) => (
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                    {getCategoryName(item.category)}
                </span>
            ),
        },
        {
            key: "isPublished",
            label: "Published",
            render: (item) => (
                <Button
                    size="sm"
                    className={`px-2 py-1 rounded text-xs ${item.isPublished
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                    onClick={() => handleTogglePublish(item._id)}
                >
                    {item.isPublished ? "Yes" : "No"}
                </Button>
            ),
        },
        {
            key: "createdAt",
            label: "Created",
            render: (i) => <DateFormatter date={i.createdAt} />,
        },
        {
            key: "actions",
            label: "Actions",
            render: (item) => (
                <div className="flex gap-1.5">
                    <Button
                        size="sm"
                        variant="outline"
                        className="px-2 py-1 text-xs"
                        onClick={() => setEditItem(item)}
                    >
                        Edit
                    </Button>
                    <Button
                        size="sm"
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        onClick={() => handleDelete(item._id)}
                    >
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            {/* Bulk actions bar */}
            {selectedIds.length > 0 && (
                <div className="mb-3 flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5">
                    <span className="text-sm font-medium text-gray-700">
                        {selectedIds.length} selected
                    </span>
                    <div className="ml-auto flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            className="text-xs gap-1.5"
                            onClick={handleBulkTogglePublish}
                        >
                            <ToggleLeft className="size-3.5" />
                            Toggle Publish
                        </Button>
                        <Button
                            size="sm"
                            className="bg-red-500 text-white text-xs hover:bg-red-600 gap-1.5"
                            onClick={handleBulkDelete}
                        >
                            <Trash2 className="size-3.5" />
                            Delete
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs text-gray-500"
                            onClick={() => setSelectedIds([])}
                        >
                            Clear
                        </Button>
                    </div>
                </div>
            )}

            <DataTable<GalleryImage>
                data={galleries}
                columns={columns}
                isLoading={isLoading}
                isError={isError}
                errorMessage={errorMessage}
                emptyMessage="No gallery images found"
                isPaginate={!!paginationOptions}
                paginationOptions={paginationOptions}
                pageSize={pageSize}
                onPageChange={onPageChange}
            />

            <AdminGalleryImageEditSheet
                item={editItem}
                open={!!editItem}
                onClose={() => setEditItem(null)}
            />
        </>
    );
};

export default AdminGalleryImagesTable;
