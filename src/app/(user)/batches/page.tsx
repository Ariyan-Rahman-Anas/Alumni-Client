import BatchesPage from "@/components/pages/user/Batches/BatchesPage";
import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const wm = await getWebsiteData();
    const shortName = wm?.schoolName ? toShortName(wm.schoolName) : "BAMHS";
    return {
        title: "Batches",
        description: `Explore ${shortName} alumni batches, decade tracks, and collaboration opportunities.`,
    };
}

const Batches = () => {
    return <BatchesPage />;
};
export default Batches;