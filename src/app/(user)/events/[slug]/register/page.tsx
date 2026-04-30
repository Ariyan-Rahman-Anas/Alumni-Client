import EventRegisterPage from "@/components/pages/user/Events/EventRegisterPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register | BAMHS Alumni Events",
    description: "Register for a BAMHS alumni event.",
};

export default function EventRegister() {
    return <EventRegisterPage />;
}
