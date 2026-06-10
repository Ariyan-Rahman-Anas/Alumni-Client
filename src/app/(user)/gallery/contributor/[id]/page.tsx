import ContributorPage from "@/components/pages/user/Gallery/ContributorPage";
import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const wm = await getWebsiteData();
    const shortName = wm?.schoolName ? toShortName(wm.schoolName) : "BAMHS";
    return {
        title: "Gallery Contributor",
        description: `View a contributor's profile and their photos in the ${shortName} alumni gallery.`,
    };
}

const ContributorRoute = ({ params }: { params: { id: string } }) => {
    return <ContributorPage userId={params.id} />;
};
export default ContributorRoute;
