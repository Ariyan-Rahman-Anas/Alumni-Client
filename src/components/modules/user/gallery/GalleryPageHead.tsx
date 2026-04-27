import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import SectionLabel from "@/components/shared/SectionLabel";
import { RiGalleryLine } from "react-icons/ri"

const GalleryPageHead = () => {

    const galleryStats = [
        { value: "500+", label: "Curated photos" },
        { value: "12", label: "Featured albums" },
        { value: "1966", label: "Earliest capture" },
        { value: "Open", label: "Submissions" },
    ];

    return (
        <FadeUpWrapper delay={0.1}>
            <section
                className="relative overflow-hidden rounded-3xl"
                style={{ background: "linear-gradient(145deg, #041a12 0%, #0c4a34 55%, #062319 100%)" }}
            >
                <div
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
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

                <div className="relative z-10 px-7 py-12 sm:px-12 sm:py-16">
                    <FadeUpWrapper
                        delay={0.15}
                    >
                        <SectionLabel text="Gallery Hub" align="left" icon={<RiGalleryLine />} className="text-primary2-200 capitalize mb-2" />
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
                            Memory Wall,{" "}
                            <span className="text-primary2-300">built as a Living Mosaic</span>
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm sm:text-lg text-primary2-100/75 leading-relaxed">
                            Curated alumni moments through an editorial masonry grid, featured
                            collections, and visual narratives crafted for future archive expansion.
                        </p>
                    </FadeUpWrapper>

                    <FadeUpWrapper
                        delay={0.25}
                        className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl"
                    >
                        {galleryStats.map(({ value, label }) => (
                            <div
                                key={label}
                                className="rounded-2xl border px-4 py-4 text-center"
                                style={{
                                    background: "rgba(255,255,255,0.07)",
                                    borderColor: "rgba(255,255,255,0.12)",
                                }}
                            >
                                <p className="text-2xl font-bold text-white">{value}</p>
                                <p className="mt-0.5 text-xs text-primary2-200/80">{label}</p>
                            </div>
                        ))}
                    </FadeUpWrapper>
                </div>
            </section>
        </FadeUpWrapper>
    )
}
export default GalleryPageHead