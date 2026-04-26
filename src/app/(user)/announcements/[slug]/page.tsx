import AnnouncementDetailPage from "@/components/pages/user/Announcements/AnnouncementDetailPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Announcement | BAMHS Alumni",
    description: "Read the full announcement from BAMHS Alumni Association.",
};

const AnnouncementSlugRoute = ({ params }: { params: { slug: string } }) => {
    return <AnnouncementDetailPage slug={params.slug} />;
};

export default AnnouncementSlugRoute;
