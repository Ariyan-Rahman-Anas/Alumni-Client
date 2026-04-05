import { FadeUpWrapper } from "@/components/Pages/Home/HomePage"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { HiArrowUpRight } from "react-icons/hi2"
import { RiArrowRightLine, RiImageLine } from "react-icons/ri"

const GallerySection = () => {
    const gallery = [
        { label: "Class of 2005 Reunion", color: "#0A3D2B" },
        { label: "Annual Sports Day", color: "#155A3E" },
        { label: "Cultural Programme", color: "#257048" },
        { label: "Blood Donation Camp", color: "#2E8B57" },
        { label: "Scholarship Ceremony", color: "#3B8E62" },
        { label: "Farewell 2012", color: "#4DB472" },
    ];

    return (
        <section className="section-warm">
            <div className="three-xl-section-setup">
                <FadeUpWrapper className="text-center mb-14">
                    <span className="text-label block mb-3">Captured Memories</span>
                    <h2 className="section-heading" style={{ color: "var(--color-primary-900)" }}>
                        Gallery
                    </h2>
                    <p className="section-subheading">
                        Moments frozen in time — from dusty playgrounds to proud graduations.
                    </p>
                </FadeUpWrapper>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {gallery.map(({ label, color }, i) => (
                        <FadeUpWrapper key={label} delay={i * 0.07}>
                            <Link href="/gallery">
                                <div className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
                                    style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)` }}>
                                    {/* placeholder gradient — swap with next/image */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <RiImageLine className="text-4xl opacity-20" style={{ color: "#FDFAF2" }} />
                                    </div>
                                    {/* hover overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-300" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        <p className="font-sans text-sm font-medium text-white">{label}</p>
                                    </div>
                                    {/* corner arrow */}
                                    <div className="absolute top-3 right-3 w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <HiArrowUpRight className="text-white text-sm" />
                                    </div>
                                </div>
                            </Link>
                        </FadeUpWrapper>
                    ))}
                </div>

                <FadeUpWrapper className="text-center mt-10">
                    <Button asChild variant="outline" className="rounded-xl font-medium border-2"
                        style={{ borderColor: "var(--color-primary-500)", color: "var(--color-primary-600)" }}>
                        <Link href="/gallery">View Full Gallery <RiArrowRightLine className="ml-1" /></Link>
                    </Button>
                </FadeUpWrapper>
            </div>
        </section>
    )
}
export default GallerySection