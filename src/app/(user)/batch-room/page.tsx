import type { Metadata } from "next";
import BatchRoomPage from "@/components/pages/user/BatchRoom/BatchRoomPage";

export const metadata: Metadata = { title: "Batch Room" };

export default function BatchRoom() {
    return <BatchRoomPage />;
}
