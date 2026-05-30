import JobsPage from "@/components/pages/user/Jobs/JobsPage";
import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const wm = await getWebsiteData();
    const shortName = wm?.schoolName ? toShortName(wm.schoolName) : "BAMHS";
    return {
        title: "Job Board",
        description: `Find jobs, hire tutors, and connect with skilled ${shortName} alumni service providers.`,
    };
}

const Jobs = () => {
    return <JobsPage />;
};
export default Jobs;
