import EventRegisterPage from "@/components/pages/user/Events/EventRegisterPage";
import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const wm = await getWebsiteData();
    const shortName = wm?.schoolName ? toShortName(wm.schoolName) : "BAMHS";
    return {
        title: "Event Registration",
        description: `Register for a ${shortName} alumni event.`,
    };
}

export default function EventRegister() {
    return <EventRegisterPage />;
}
