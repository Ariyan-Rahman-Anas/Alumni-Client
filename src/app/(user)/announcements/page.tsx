import AnnouncementsPage from "@/components/pages/user/Announcements/AnnouncementsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Announcements | BAMHS Alumni",
    description: "Stay updated with official BAMHS alumni announcements and notices.",
};

const Announcements = () => {
    return <AnnouncementsPage />;
};
export default Announcements;