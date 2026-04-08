import type { Metadata } from "next";
import AnnouncementsPage from "@/components/Pages/Announcements/AnnouncementsPage";

export const metadata: Metadata = {
    title: "Announcements | BAMHS Alumni",
    description: "Stay updated with official BAMHS alumni announcements and notices.",
};

const Announcements = () => {
    return <AnnouncementsPage />;
};

export default Announcements;
