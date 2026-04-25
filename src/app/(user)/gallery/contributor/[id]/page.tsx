import ContributorPage from "@/components/pages/user/Gallery/ContributorPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contributor | BAMHS Gallery",
    description: "View a contributor's profile and their photos in the BAMHS alumni gallery.",
};

const ContributorRoute = ({ params }: { params: { id: string } }) => {
    return <ContributorPage userId={params.id} />;
};
export default ContributorRoute;
