import JobDetailPage from "@/components/pages/user/Jobs/JobDetailPage";
import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const wm = await getWebsiteData();
    const shortName = wm?.schoolName ? toShortName(wm.schoolName) : "BAMHS";
    return {
        title: "Job Detail",
        description: `View job post details from the ${shortName} alumni network.`,
    };
}

const JobDetail = ({ params }: { params: { id: string } }) => {
    return <JobDetailPage id={params.id} />;
};
export default JobDetail;
