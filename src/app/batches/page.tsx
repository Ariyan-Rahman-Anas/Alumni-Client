import type { Metadata } from "next";
import BatchesPage from "@/components/Pages/Batches/BatchesPage";

export const metadata: Metadata = {
    title: "Batches | BAMHS Alumni",
    description: "Explore BAMHS alumni batches, decade tracks, and collaboration opportunities.",
};

const Batches = () => {
    return <BatchesPage />;
};

export default Batches;
