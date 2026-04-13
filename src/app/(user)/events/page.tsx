import EventsPage from "@/components/Pages/USER/Events/EventsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Events | BAMHS Alumni",
    description: "Discover upcoming BAMHS alumni events, timelines, and participation tracks.",
};

const Events = () => {
    return <EventsPage />;
};
export default Events;