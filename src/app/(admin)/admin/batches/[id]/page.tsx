import AdminBatchDetailPage from "@/components/pages/admin/batches/AdminBatchDetailPage";

export default function Page({ params }: { params: { id: string } }) {
    return <AdminBatchDetailPage id={params.id} />;
}
