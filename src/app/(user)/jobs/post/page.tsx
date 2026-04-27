import PostJobPage from "@/components/pages/user/Jobs/PostJobPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Post a Job | BAMHS Alumni",
    description: "Post a job, tuition need, or service request to the BAMHS alumni network.",
};

const PostJob = () => {
    return <PostJobPage />;
};
export default PostJob;
