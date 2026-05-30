import EventsPage from "@/components/pages/user/Events/EventsPage";
import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const wm = await getWebsiteData();
    const shortName = wm?.schoolName ? toShortName(wm.schoolName) : "BAMHS";
    return {
        title: "Events",
        description: `Discover upcoming ${shortName} alumni events, timelines, and participation tracks.`,
    };
}

const Events = () => {
    return <EventsPage />;
};
export default Events;