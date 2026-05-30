import PostJobPage from "@/components/pages/user/Jobs/PostJobPage";
import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const wm = await getWebsiteData();
    const shortName = wm?.schoolName ? toShortName(wm.schoolName) : "BAMHS";
    return {
        title: "Post a Job",
        description: `Post a job, tuition need, or service request to the ${shortName} alumni network.`,
    };
}

const PostJob = () => {
    return <PostJobPage />;
};
export default PostJob;
