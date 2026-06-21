"use client";

import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import SectionLabel from "@/components/shared/SectionLabel";
import { useGetTopContributorsQuery } from "@/redux/apis/galleryApi";
import { useGetAllPublishedImageCategoriesQuery } from "@/redux/apis/imageCategoryApi";
import { RiGalleryLine } from "react-icons/ri"

const GalleryPageHead = () => {
    const { data: contributorsData } = useGetTopContributorsQuery();
    const { data: categoriesData } = useGetAllPublishedImageCategoriesQuery();

    const contributors = contributorsData?.data ?? [];
    const totalPhotos = contributors.reduce((sum, c) => sum + c.imageCount, 0);
    const totalCategories = categoriesData?.data.length ?? 0;
    const totalContributors = contributors.length;

    const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k+` : n > 0 ? `${n}+` : "—");

    const galleryStats = [
        { value: fmt(totalPhotos), label: "Curated photos" },
        { value: totalCategories > 0 ? `${totalCategories}` : "—", label: "Photo albums" },
        { value: totalContributors > 0 ? `${totalContributors}` : "—", label: "Contributors" },
        { value: "100%", label: "Reviewed & curated" },
    ];

    return (
        <section className="three-xl-section-setup">
            <FadeUpWrapper delay={0.1}
                className="relative overflow-hidden rounded-3xl"
                style={{ background: "linear-gradient(145deg, #041a12 0%, #0c4a34 55%, #062319 100%)" }}
            >
                <div
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
                <div
                    className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-25"
                    style={{ background: "rgba(46,139,87,1)" }}
                />
                <div
                    className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full blur-3xl opacity-20"
                    style={{ background: "rgba(245,158,11,1)" }}
                />

                <div className="relative z-10 three-xl-section-padding ">
                    <FadeUpWrapper
                        delay={0.15}
                    >
                        <SectionLabel text="Gallery Hub" align="left" icon={<RiGalleryLine />}
                            className="text-primary2-300 dark:text-gunmetal-300 border-primary2-600 dark:border-gunmetal-400 " />
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mt-5 text-white dark:text-gunmetal-200 leading-tight max-w-3xl">
                            Memory Wall,{" "}
                            <span className="text-primary2-300 dark:text-primary">built as a Living Mosaic</span>
                        </h1>
                        <p className="text-base sm:text-lg leading-relaxed max-w-4xl text-gunmetal-300 mb-12 mt-5">
                            Curated alumni moments through an editorial masonry grid, featured
                            collections, and visual narratives crafted for future archive expansion.
                        </p>
                    </FadeUpWrapper>

                    <FadeUpWrapper
                        delay={0.25}
                        className="mt-10 flex flex-wrap items-center justify-center md:justify-end gap-4"
                    >
                        {galleryStats.map(({ value, label }) => (
                            <div
                                key={label}
                                className="rounded-xl min-w-36 border px-4 py-4 text-center"
                                style={{
                                    background: "rgba(255,255,255,0.07)",
                                    borderColor: "rgba(255,255,255,0.12)",
                                }}
                            >
                                <p className="text-2xl font-bold text-white">{value}</p>
                                <p className="mt-0.5 text-sm text-gunmetal-200 dark:text-primary">{label}</p>
                            </div>
                        ))}
                    </FadeUpWrapper>
                </div>
            </FadeUpWrapper>
        </section>
    )
}
export default GalleryPageHead