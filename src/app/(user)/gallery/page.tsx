import GalleryPage from "@/components/pages/user/Gallery/GalleryPage";
import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const wm = await getWebsiteData();
    const shortName = wm?.schoolName ? toShortName(wm.schoolName) : "BAMHS";
    return {
        title: "Gallery",
        description: `Explore ${shortName} alumni gallery with curated memories and visual collections.`,
    };
}

const Gallery = () => {
    return <GalleryPage />;
};
export default Gallery;