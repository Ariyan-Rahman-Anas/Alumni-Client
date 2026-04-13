import BatchesPage from "@/components/pages/user/Batches/BatchesPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Batches | BAMHS Alumni",
    description: "Explore BAMHS alumni batches, decade tracks, and collaboration opportunities.",
};

const Batches = () => {
    return <BatchesPage />;
};
export default Batches;