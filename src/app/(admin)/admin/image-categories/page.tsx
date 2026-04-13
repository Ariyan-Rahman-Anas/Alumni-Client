
"use client";
import { useState } from "react";
import {
    useGetAllImageCategoriesQuery,
    useCreateImageCategoryMutation,
    useDeleteImageCategoryMutation,
    useTogglePublishMutation,
    useToggleFeatureMutation,
} from "@/redux/apis/imageCategoryApi";
import Image from "next/image";

const AdminImageCategory = () => {
    const { data, isLoading, refetch } = useGetAllImageCategoriesQuery();
    const [createCategory] = useCreateImageCategoryMutation();
    const [deleteCategory] = useDeleteImageCategoryMutation();
    const [togglePublish] = useTogglePublishMutation();
    const [toggleFeature] = useToggleFeatureMutation();
    const [form, setForm] = useState({ name: "", description: "", coverImage: undefined });
    const [submitting, setSubmitting] = useState(false);

    const handleInput = (e: any) => {
        const { name, value, files } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);
        const fd = new FormData();
        fd.append("name", form.name);
        if (form.description) fd.append("description", form.description);
        if (form.coverImage) fd.append("coverImage", form.coverImage);
        await createCategory(fd);
        setForm({ name: "", description: "", coverImage: undefined });
        setSubmitting(false);
        refetch();
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Image Categories</h1>

            <form className="mb-8 space-y-2" onSubmit={handleSubmit}>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleInput}
                    placeholder="Category Name"
                    required
                    className="border px-2 py-1 rounded w-full"
                />
                <input
                    name="description"
                    value={form.description}
                    onChange={handleInput}
                    placeholder="Description"
                    className="border px-2 py-1 rounded w-full"
                />
                <input
                    name="coverImage"
                    type="file"
                    accept="image/*"
                    onChange={handleInput}
                    className="border px-2 py-1 rounded w-full"
                />
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-blue-600 text-white px-4 py-1 rounded mt-2"
                >
                    {submitting ? "Adding..." : "Add Category"}
                </button>
            </form>

            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">Cover</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Published</th>
                            <th className="p-2 border">Featured</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data?.map((cat) => (
                            <tr key={cat._id}>
                                <td className="border p-2">
                                    {cat.coverImageUrl ? (
                                        <Image src={cat.coverImageUrl}
                                            height={100}
                                                width={160}
                                            alt={cat.name} className="w-16 h-10 object-cover rounded" />
                                    ) : (
                                        <span className="text-gray-400">No image</span>
                                    )}
                                </td>
                                <td className="border p-2">{cat.name}</td>
                                <td className="border p-2">
                                    <button
                                        className={`px-2 py-1 rounded ${cat.isPublished ? "bg-green-500 text-white" : "bg-gray-300"}`}
                                        onClick={async () => { await togglePublish(cat._id); refetch(); }}
                                    >
                                        {cat.isPublished ? "Yes" : "No"}
                                    </button>
                                </td>
                                <td className="border p-2">
                                    <button
                                        className={`px-2 py-1 rounded ${cat.isFeatured ? "bg-yellow-500 text-white" : "bg-gray-300"}`}
                                        onClick={async () => { await toggleFeature(cat._id); refetch(); }}
                                    >
                                        {cat.isFeatured ? "Yes" : "No"}
                                    </button>
                                </td>
                                <td className="border p-2">
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded"
                                        onClick={async () => { await deleteCategory(cat._id); refetch(); }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminImageCategory;