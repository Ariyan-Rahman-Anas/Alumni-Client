import AnnouncementsPage from "@/components/pages/user/Announcements/AnnouncementsPage";
import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const wm = await getWebsiteData();
    const shortName = wm?.schoolName ? toShortName(wm.schoolName) : "BAMHS";
    return {
        title: "Announcements",
        description: `Stay updated with official ${shortName} alumni announcements and notices.`,
    };
}

const Announcements = () => {
    return <AnnouncementsPage />;
};
export default Announcements;