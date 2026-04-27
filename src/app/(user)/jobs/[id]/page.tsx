import JobDetailPage from "@/components/pages/user/Jobs/JobDetailPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Job Detail | BAMHS Alumni",
    description: "View job post details from the BAMHS alumni network.",
};

const JobDetail = ({ params }: { params: { id: string } }) => {
    return <JobDetailPage id={params.id} />;
};
export default JobDetail;
