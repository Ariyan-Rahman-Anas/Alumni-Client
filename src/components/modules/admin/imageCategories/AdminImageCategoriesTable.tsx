
import Image from "next/image";
import DataTable from "@/components/shared/dataTable/DataTable";
import { Button } from "@/components/ui/button";
import type { TableColumn } from "@/types";
import DateFormatter from "@/lib/DateFormatter";
// import { formatDate } from "@/lib/DateFormatter";

interface AdminImageCategoriesTableProps {
    categories: any[];
    isLoading: boolean;
    isError?: boolean;
    errorMessage?: string;
    paginationOptions?: any;
    pageSize?: number;
    onPageChange?: (page: number) => void;
}

const AdminImageCategoriesTable = ({
    categories,
    isLoading,
    isError = false,
    errorMessage = "Failed to load image categories",
    paginationOptions,
    pageSize,
    onPageChange,
}: AdminImageCategoriesTableProps) => {
    const columns: TableColumn<any>[] = [
        {
            key: "coverImageUrl",
            label: "Cover",
            render: (cat) => cat.coverImageUrl ? (
                <div className="bg-gray100 flex items-center justify-center rounded overflow-hidden">
                    <Image
                        src={cat.coverImageUrl}
                        height={500}
                        width={500}
                        alt={cat.name}
                        className="h-full w-20 object-cover rounded"
                    />
                </div>
            ) : (
                <span className="text-gray-400">No image</span>
            )
        },
        {
            key: "name",
            label: "Name",
        },
        { key: "description", label: "Description" },
        {
            key: "isPublished",
            label: "Published",
            render: (cat) => (
                <Button
                    size="sm"
                    className={`px-2 py-1 rounded ${cat.isPublished ? "bg-green-500 text-white" : "bg-gray-300"}`}
                    // onClick={() => onTogglePublish(cat._id)}
                >
                    {cat.isPublished ? "Yes" : "No"}
                </Button>
            )
        },
        {
            key: "isFeatured",
            label: "Featured",
            render: (cat) => (
                <Button
                    size="sm"
                    className={`px-2 py-1 rounded ${cat.isFeatured ? "bg-yellow-500 text-white" : "bg-gray-300"}`}
                    // onClick={() => onToggleFeature(cat._id)}
                >
                    {cat.isFeatured ? "Yes" : "No"}
                </Button>
            )
        },
        {
            key: "createdAt", label: "Created At",
            render: (i) => <DateFormatter date={i.createdAt} />
        },
        {
            key: "actions",
            label: "Actions",
            render: () => (
                <Button
                    size="sm"
                    className="bg-red-500 text-white px-2 py-1 rounded"
                    // onClick={() => onDelete(cat._id)}
                >
                    Delete
                </Button>
            )
        },
    ];

    return (
        <DataTable<any>
            data={categories}
            columns={columns}
            isLoading={isLoading}
            isError={isError}
            errorMessage={errorMessage}
            emptyMessage="No image categories found"
            isPaginate={!!paginationOptions}
            paginationOptions={paginationOptions}
            pageSize={pageSize}
            onPageChange={onPageChange}
        />
    );
};
export default AdminImageCategoriesTable;