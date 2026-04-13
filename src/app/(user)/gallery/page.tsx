import type { Metadata } from "next";
import GalleryPage from "@/components/Pages/Gallery/GalleryPage";

export const metadata: Metadata = {
    title: "Gallery | BAMHS Alumni",
    description: "Explore BAMHS alumni gallery with curated memories and visual collections.",
};

const Gallery = () => {
    return <GalleryPage />;
};

export default Gallery;
