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
    useToggleGalleryFeaturedMutation,
} from "@/redux/apis/galleryApi";
import { toast } from "sonner";
import AdminGalleryImageEditSheet from "./AdminGalleryImageEditSheet";
import { Trash2, ToggleLeft, Edit } from "lucide-react";
import CheckBox from "@/components/shared/CheckBox";
import { useForm } from "react-hook-form";

interface AdminGalleryImagesTableProps {
    galleries: GalleryImage[];
    isLoading: boolean;
    isError?: boolean;
    errorMessage?: string;
    paginationOptions?: any;
    pageSize?: number;
    onPageChange?: (page: number) => void;
}

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

    const { register } = useForm()

    const [deleteGallery, { isLoading: isDeleting }] = useDeleteGalleryMutation();
    const [deleteMultiple, { isLoading: isDeletingMultiple }] = useDeleteMultipleGalleriesMutation();
    const [togglePublish, { isLoading: isTogglingPublish }] = useToggleGalleryPublishMutation();
    const [toggleGalleryFeatured, { isLoading: isTogglingFeatured }] = useToggleGalleryFeaturedMutation();
    const [togglePublishMultiple, { isLoading: isTogglingPublishMultiple }] = useToggleGalleryPublishMultipleMutation();

    const isAnyLoading = isDeleting || isDeletingMultiple || isTogglingPublish || isTogglingFeatured || isTogglingPublishMultiple;

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
            const deleteRes = await deleteGallery(id).unwrap();
            toast.success(deleteRes.message ?? "Image deleted");
            setSelectedIds((prev) => prev.filter((x) => x !== id));
        } catch {}
    };

    const handleBulkDelete = async () => {
        if (selectedIds.length === 0) return;
        try {
            const res = await deleteMultiple(selectedIds).unwrap();
            toast.success(res.message ?? `${selectedIds.length} image(s) deleted`);
            setSelectedIds([]);
        } catch {}
    };

    const handleTogglePublish = async (id: string) => {
        try {
            const publishRes = await togglePublish(id).unwrap();
            toast.success(publishRes.message ?? "Image updated");
        } catch {}
    };
    
    const handleToggleFeatured = async (id: string) => {
        try {
            const featuredRes = await toggleGalleryFeatured(id).unwrap();
            toast.success(featuredRes.message ?? "Image updated");
        } catch {}
    };

    const handleBulkTogglePublish = async () => {
        if (selectedIds.length === 0) return;
        try {
            const res = await togglePublishMultiple(selectedIds).unwrap();
            toast.success(res.message ?? `${selectedIds.length} image(s) updated`);
            setSelectedIds([]);
        } catch {}
    };

    const columns: TableColumn<GalleryImage>[] = [
        { key: "index", label: "SN." },
        {
            key: "_id" as keyof GalleryImage,
            label: (
                <CheckBox
                    label=""
                    checked={isAllSelected}
                    checkedFunc={toggleSelectAll}
                    register={register}
                />
            ) as unknown as string,
            render: (item) => (
                <CheckBox
                    label=""
                    checked={selectedIds.includes(item._id)}
                    checkedFunc={() => toggleSelect(item._id)}
                    register={register}

                />
            ),
        },
        {
            key: "imageUrl",
            label: "Image",
            render: (item) =>
                item.imageUrl ? (
                    <div className="overflow-hidden rounded flex items-center justify-center ">
                        <Image
                            src={item.imageUrl}
                            height={500}
                            width={500}
                            alt={item.title}
                            className="h-14 w-14 object-cover rounded"
                        />
                    </div>
                ) : (
                    <span>No image</span>
                ),
        },
        {
            key: "title",
            label: "Title",
            render: (item) => (
                <div>
                    <p>{item.title}</p>
                    {item.innerTitle && (
                        <p>{item.innerTitle}</p>
                    )}
                </div>
            ),
        },
        {
            key: "category",
            label: "Category",
            render: (item) => (
                <span >
                    {item.category.name}
                </span>
            ),
        },
        {
            key: "uploadedBy",
            label: "Uploaded By",
            render: (item) => (
                <div>
                    <p>{item.uploadedBy.name}</p>
                    <p>{item.uploadedBy.email}</p>
                </div>
            ),
        },
        {
            key: "isPublished",
            label: "Published",
            render: (item) => (
                <Button
                    size="sm"
                    className={`px-2 py-1 rounded text-xs ${item.isPublished
                        ? "bg-primary2-500 text-white hover:bg-primary2-600"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                    onClick={() => handleTogglePublish(item._id)}
                    disabled={isAnyLoading}
                >
                    {item.isPublished ? "Yes" : "No"}
                </Button>
            ),
        },
        {
            key: "isFeatured",
            label: "Featured",
            render: (item) => (
                <Button
                    size="sm"
                    className={`px-2 py-1 rounded text-xs ${item.isFeatured
                        ? "bg-primary2-500 text-white hover:bg-primary2-600"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                    onClick={() => handleToggleFeatured(item._id)}
                    disabled={isAnyLoading}
                >
                    {item.isFeatured ? "Yes" : "No"}
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
                <div className="flex items-center justify-center gap-1.5">
                    <Button
                        size="sm"
                        variant="outline"
                        className="px-2 py-1 text-xs"
                        onClick={() => setEditItem(item)}
                        disabled={isAnyLoading}
                    >
                        <Edit />
                    </Button>
                    <Button
                        size="sm"
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                        onClick={() => handleDelete(item._id)}
                        disabled={isAnyLoading}
                    >
                        <Trash2 />
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
                            disabled={isAnyLoading}
                        >
                            <ToggleLeft className="size-3.5" />
                            Toggle Publish
                        </Button>
                        <Button
                            size="sm"
                            className="bg-red-500 text-white text-xs hover:bg-red-600 gap-1.5"
                            onClick={handleBulkDelete}
                            disabled={isAnyLoading}
                        >
                            <Trash2 className="size-3.5" />
                            Delete
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs text-gray-500"
                            onClick={() => setSelectedIds([])}
                            disabled={isAnyLoading}
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
