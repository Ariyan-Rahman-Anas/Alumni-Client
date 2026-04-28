import ProviderDetailPage from "@/components/pages/user/Jobs/ProviderDetailPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Provider Profile | BAMHS Alumni",
    description: "View service provider or tutor profile from the BAMHS alumni network.",
};

const ProviderDetail = ({ params }: { params: { id: string } }) => {
    return <ProviderDetailPage id={params.id} />;
};
export default ProviderDetail;
