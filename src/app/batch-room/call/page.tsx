import type { Metadata } from "next";
import BatchCallPage from "@/components/pages/user/BatchRoom/BatchCallPage";

export const metadata: Metadata = { title: "Batch Room Call" };

export default function BatchCallRoute() {
    return <BatchCallPage />;
}
