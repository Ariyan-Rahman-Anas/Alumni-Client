import ProviderDetailPage from "@/components/pages/user/Jobs/ProviderDetailPage";
import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const wm = await getWebsiteData();
    const shortName = wm?.schoolName ? toShortName(wm.schoolName) : "BAMHS";
    return {
        title: "Provider Profile",
        description: `View service provider or tutor profile from the ${shortName} alumni network.`,
    };
}

const ProviderDetail = ({ params }: { params: { id: string } }) => {
    return <ProviderDetailPage id={params.id} />;
};
export default ProviderDetail;
