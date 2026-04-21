"use client"

import AdminGalleryImageFormSheet from "@/components/modules/admin/gallery/AdminGalleryImageFormSheet";
import AdminGalleryImagesTable from "@/components/modules/admin/gallery/AdminGalleryImagesTable";
import AdminPageHead from "@/components/shared/admin/AdminPageHead";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { useState } from "react";
import { RiAddLine } from "react-icons/ri";

const AdminGalleryPage = () => {
    const [formOpen, setFormOpen] = useState(false);

    return (
        <div className="admin-page-setup">
            <div className="flex items-center justify-between" >
                <AdminPageHead title="Gallery" description="Manage BAMHSian gallery images" />
                <PrimaryButton
                    type="button"
                    title="Add Image to Gallery"
                    icon={<RiAddLine />}
                    iconSide="left"
                    onClick={() => {
                        setFormOpen(true);
                    }}
                />
            </div>


            <AdminGalleryImageFormSheet
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                }}
            />

            <AdminGalleryImagesTable
                // categories={data?.data || []}
                categories={[]}
                // isLoading={isLoading}
                isLoading={false}
            />

        </div>
    )
}
export default AdminGalleryPage