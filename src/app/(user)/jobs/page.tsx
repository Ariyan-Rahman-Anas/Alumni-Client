import JobsPage from "@/components/pages/user/Jobs/JobsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Job Board | Alumni Association of BAMHS",
    description: "Find jobs, hire tutors, and connect with skilled alumni service providers.",
};

const Jobs = () => {
    return <JobsPage />;
};
export default Jobs;
