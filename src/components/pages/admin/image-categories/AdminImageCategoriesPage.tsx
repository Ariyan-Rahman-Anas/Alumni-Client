"use client"

import AdminImageCategoriesTable from "@/components/modules/admin/imageCategories/AdminImageCategoriesTable";
import AdminImageCategoryFormSheet from "@/components/modules/admin/imageCategories/AdminImageCategoryFormSheet";
import AdminPageHead from "@/components/shared/admin/AdminPageHead"
import PrimaryButton from "@/components/shared/PrimaryButton";
import { useGetAllImageCategoriesQuery } from "@/redux/apis/imageCategoryApi";
import { useState } from "react";
import { RiAddLine } from "react-icons/ri";

const AdminImageCategoriesPage = () => {
  const [formOpen, setFormOpen] = useState(false);

  const { data, isLoading } = useGetAllImageCategoriesQuery();

  return (
    <div>
      {/* Header */}
      <AdminPageHead
        title="Image Categories"
        description="Manage image categories."
      />
      <div className="admin-page-setup">
        <PrimaryButton
          type="button"
          title="Add Image Category"
          icon={<RiAddLine />}
          iconSide="left"
          onClick={() => {
            setFormOpen(true);
          }}
        />

        <AdminImageCategoryFormSheet
          open={formOpen}
          onClose={() => {
            setFormOpen(false);
          }}
        />

        <AdminImageCategoriesTable
          categories={data?.data || []}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
export default AdminImageCategoriesPage