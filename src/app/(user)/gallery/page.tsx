import GalleryPage from "@/components/pages/user/Gallery/GalleryPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gallery | BAMHS Alumni",
    description: "Explore BAMHS alumni gallery with curated memories and visual collections.",
};

const Gallery = () => {
    return <GalleryPage />;
};
export default Gallery;