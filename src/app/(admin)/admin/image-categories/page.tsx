
// "use client";
// import { useState } from "react";
// import {
//     useGetAllImageCategoriesQuery,
//     useCreateImageCategoryMutation,
//     useDeleteImageCategoryMutation,
//     useTogglePublishMutation,
//     useToggleFeatureMutation,
// } from "@/redux/apis/imageCategoryApi";

import AdminImageCategoriesPage from "@/components/pages/admin/image-categories/AdminImageCategoriesPage"

// import AdminImageCategoriesTable from "@/components/modules/admin/imageCategories/AdminImageCategoriesTable";
// import AdminImageCategoryFormSheet from "@/components/modules/admin/imageCategories/AdminImageCategoryFormSheet";

// const AdminImageCategory = () => {
//     const { data, isLoading, refetch } = useGetAllImageCategoriesQuery();
//     const [createCategory] = useCreateImageCategoryMutation();
//     const [deleteCategory] = useDeleteImageCategoryMutation();
//     const [togglePublish] = useTogglePublishMutation();
//     const [toggleFeature] = useToggleFeatureMutation();
//     const [form, setForm] = useState({ name: "", description: "", coverImage: undefined });
//     const [submitting, setSubmitting] = useState(false);

//     const handleInput = (e: any) => {
//         const { name, value, files } = e.target;
//         setForm((prev) => ({
//             ...prev,
//             [name]: files ? files[0] : value,
//         }));
//     };

//     const handleSubmit = async (e: any) => {
//         e.preventDefault();
//         setSubmitting(true);
//         const fd = new FormData();
//         fd.append("name", form.name);
//         if (form.description) fd.append("description", form.description);
//         if (form.coverImage) fd.append("coverImage", form.coverImage);
//         await createCategory(fd);
//         setForm({ name: "", description: "", coverImage: undefined });
//         setSubmitting(false);
//         refetch();
//     };

//     return (
//         <div className="p-6 max-w-3xl mx-auto">
//             <h1 className="text-2xl font-bold mb-4">Image Categories</h1>

//             <AdminImageCategoryFormSheet
//                 form={form}
//                 onChange={handleInput}
//                 onSubmit={handleSubmit}
//                 submitting={submitting}
//             />

//             <AdminImageCategoriesTable
//                 categories={data?.data || []}
//                 isLoading={isLoading}
//                 onTogglePublish={async (id: string) => { await togglePublish(id); refetch(); }}
//                 onToggleFeature={async (id: string) => { await toggleFeature(id); refetch(); }}
//                 onDelete={async (id: string) => { await deleteCategory(id); refetch(); }}
//             />
//         </div>
//     );
// };
// export default AdminImageCategory;

const AdminImageCategories = () => {
  return <AdminImageCategoriesPage />
}
export default AdminImageCategories