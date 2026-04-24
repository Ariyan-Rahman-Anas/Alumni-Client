"use client"

import { useState } from "react";
import { RiAddLine } from "react-icons/ri";
import AdminGalleryImageFormSheet from "@/components/modules/admin/gallery/AdminGalleryImageFormSheet";
import AdminGalleryImagesTable from "@/components/modules/admin/gallery/AdminGalleryImagesTable";
import AdminPageHead from "@/components/shared/admin/AdminPageHead";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { useGetAllImagesQuery } from "@/redux/apis/galleryApi";

const PAGE_SIZE = 12;

const AdminGalleryPage = () => {
    const [formOpen, setFormOpen] = useState(false);
    const [page, setPage] = useState(1);

    const { data, isLoading, isError } = useGetAllImagesQuery({ page, limit: PAGE_SIZE });

    const paginationOptions = data?.meta
        ? {
              page: data.meta.page,
              totalPage: data.meta.totalPage,
              total: data.meta.total,
          }
        : undefined;

    return (
        <div className="admin-page-setup">
            <div className="flex items-center justify-between">
                <AdminPageHead title="Gallery" description="Manage BAMHSian gallery images" />
                <PrimaryButton
                    type="button"
                    title="Add Image to Gallery"
                    icon={<RiAddLine />}
                    iconSide="left"
                    onClick={() => setFormOpen(true)}
                />
            </div>

            <AdminGalleryImageFormSheet
                open={formOpen}
                onClose={() => setFormOpen(false)}
            />

            <AdminGalleryImagesTable
                galleries={data?.data ?? []}
                isLoading={isLoading}
                isError={isError}
                errorMessage="Failed to load gallery images"
                paginationOptions={paginationOptions}
                pageSize={PAGE_SIZE}
                onPageChange={setPage}
            />
        </div>
    );
};

export default AdminGalleryPage;
