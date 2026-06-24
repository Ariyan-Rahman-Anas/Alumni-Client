import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import PrimaryButton from "@/components/shared/PrimaryButton";
import SectionLabel from "@/components/shared/SectionLabel"
import { useSchoolInfo } from "@/hooks/useSchoolInfo";
import { RiImageLine, RiShieldCheckLine, RiUploadCloud2Line } from "react-icons/ri"

const GalleryPageImagesContributingAds = ({ setContributeOpen }:{ setContributeOpen?: (open: boolean) => void }) => {
    const { shortName } = useSchoolInfo();

    return (
        <FadeUpWrapper className="three-xl-section-setup">
            <div
                className="relative overflow-hidden rounded-3xl"
                style={{ background: "linear-gradient(135deg, #041a12 0%, #0c4a34 60%, #1a5436 100%)" }}
            >
                {/* Background grid texture */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />

                <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-12">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">

                        {/* ── Left content ── */}
                        <div className="flex-1">
                            <SectionLabel
                                align="left"
                                text="Contribute to the Gallery"
                                icon={<RiUploadCloud2Line />}
                                className="text-primary2-300 dark:text-gunmetal-300 border-primary2-600 dark:border-gunmetal-400" />

                            <h2 className="mt-5 text-2xl sm:text-3xl font-bold text-white dark:text-gunmetal-200 leading-snug max-w-xl">
                                Your memories deserve{" "}
                                <span className="text-primary2-300 dark:text-primary">a Permanent Place</span>{" "}
                                in the archive
                            </h2>
                            <p className="text-base sm:text-lg leading-relaxed max-w-4xl text-gunmetal-300 mt-5 mb-8">
                                Submit your best {shortName} moments with the alumni community — sports days, graduations,
                                classroom memories. Your photos will be reviewed by an admin before appearing in the public gallery.
                            </p>

                            {/* Feature bullets */}
                            <ul className="mt-6 space-y-2.5">
                                {[
                                    { icon: <RiShieldCheckLine />, text: "Every photo reviewed before going public" },
                                    { icon: <RiImageLine />, text: "Upload up to 10 photos per submission" },
                                ].map(({ icon, text }) => (
                                    <li key={text} className="flex items-center gap-2.5 text-sm text-gunmetal-200">
                                        <span className="flex-shrink-0 text-primary2-400 text-base">{icon}</span>
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ── Right CTA card ── */}
                        <div className="lg:w-64 xl:w-72">
                            <div
                                className="rounded-2xl border p-6 flex flex-col items-center text-center gap-5"
                                style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)" }}
                            >
                                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(46,139,87,0.25)", border: "1px solid rgba(46,139,87,0.35)" }}>
                                    <RiUploadCloud2Line className="text-2xl text-primary2-300 dark:text-gunmetal-200" />
                                </div>
                                <div>
                                    <p className="font-semibold text-white dark:text-gunmetal-200 ">Ready to contribute?</p>
                                    <p className="mt-3 text-xs text-gunmetal-200 dark:text-gunmetal-300">Join the growing list of alumni keeping {shortName} memories alive.</p>
                                </div>
                                <PrimaryButton
                                    title="Submit Photos"
                                    onClick={() => setContributeOpen && setContributeOpen(true)}
                                    icon={<RiUploadCloud2Line />}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FadeUpWrapper>
    )
}
export default GalleryPageImagesContributingAds