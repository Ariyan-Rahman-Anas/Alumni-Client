import AnnouncementDetailPage from "@/components/pages/user/Announcements/AnnouncementDetailPage";
import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const wm = await getWebsiteData();
    const shortName = wm?.schoolName ? toShortName(wm.schoolName) : "BAMHS";
    return {
        title: "Announcement",
        description: `Read the full announcement from ${shortName} Alumni Association.`,
    };
}

const AnnouncementSlugRoute = ({ params }: { params: { slug: string } }) => {
    return <AnnouncementDetailPage slug={params.slug} />;
};

export default AnnouncementSlugRoute;
