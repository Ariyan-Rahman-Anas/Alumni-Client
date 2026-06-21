"use client";

import { useState } from "react";
import GalleryPageHead from "@/components/modules/user/gallery/GalleryPageHead";
import GalleryPageMasonryGrid from "@/components/modules/user/gallery/GalleryPageMasonryGrid";
import GalleryPageImagesContributors from "@/components/modules/user/gallery/GalleryPageImagesContributors";
import UserContributeGallerySheet from "@/components/modules/user/gallery/UserContributeGallerySheet";
import GalleryPageImagesContributingAds from "@/components/modules/user/gallery/GalleryPageImagesContributingAds";

/* ── Main Page  */
const GalleryPage = () => {
    const [contributeOpen, setContributeOpen] = useState(false);

    return (
        <>
            <div>
                {/* ═══ 1. CINEMATIC HERO  */}
                <GalleryPageHead />

                {/* ═══ 2. FILTER + MASONRY GRID  */}
                <GalleryPageMasonryGrid />


                <GalleryPageImagesContributors />

                {/* ═══ CONTRIBUTE  */}
                <GalleryPageImagesContributingAds setContributeOpen={setContributeOpen} />
            </div>

            <UserContributeGallerySheet open={contributeOpen} onClose={() => setContributeOpen(false)} />
        </>
    );
};
export default GalleryPage;