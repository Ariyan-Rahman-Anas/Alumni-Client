"use client"

import AdminImageCategoriesTable from "@/components/modules/admin/imageCategories/AdminImageCategoriesTable";
// import AdminImageCategoriesTable from "@/components/modules/admin/imageCategories/AdminImageCategoriesTable";
import AdminImageCategoryFormSheet from "@/components/modules/admin/imageCategories/AdminImageCategoryFormSheet";
import AdminPageHead from "@/components/shared/admin/AdminPageHead"
import PrimaryButton from "@/components/shared/PrimaryButton";
import { useGetAllImageCategoriesQuery } from "@/redux/apis/imageCategoryApi";
import { useState } from "react";
import { RiAddLine } from "react-icons/ri";

const AdminImageCategoriesPage = () => {
  const [formOpen, setFormOpen] = useState(false);

  const { data, isLoading} = useGetAllImageCategoriesQuery();
  // const [form, setForm] = useState({ name: "", description: "", coverImage: undefined });

  return (
    <div className="admin-page-setup">
      <div className="flex items-center justify-between" >
        <AdminPageHead title="Image Categories" description="Manage image categories" />
        <PrimaryButton
          type="button"
          title="Add Image Category"
          icon={<RiAddLine />}
          iconSide="left"
          onClick={() => {
            setFormOpen(true);
          }}
        />
      </div>

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
  )
}
export default AdminImageCategoriesPage