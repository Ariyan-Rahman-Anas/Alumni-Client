import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import PrimaryButton from "@/components/shared/PrimaryButton"
import SectionLabel from "@/components/shared/SectionLabel"
import { useGetWebsiteManagementQuery } from "@/redux/apis/websiteManagementApi"
import { HiArrowUpRight } from "react-icons/hi2"
import { RiHeartLine } from "react-icons/ri"

const AboutPageCTA = () => {
    const { data: websiteManagement } = useGetWebsiteManagementQuery();
    const { schoolName } = websiteManagement?.data || {};

    const schoolShortName = schoolName?.split(" ")?.map((word: string) => word[0]).join("") || "BAMHS";


    return (
        <section className="three-xl-section-setup">
            <FadeUpWrapper>
                <div
                    className="relative rounded-3xl overflow-hidden"
                    style={{
                        background: "linear-gradient(160deg, #093121 0%, #0c412a 35%, #0A3D2B 100%)",
                    }}>

                    {/* ── Decorative grid  */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(46,139,87,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.06) 1px, transparent 1px)",
                            backgroundSize: "60px 60px",
                        }}
                    />

                    {/* ── Content  */}
                    <div className="z-10px-sm:px-12md:px-16lg:px24 relative z-10 p-8 sm:p-12 md:p-16 lg:p-20">

                        {/* Badge */}
                        <FadeUpWrapper className="flex justify-center mb-5">
                            <SectionLabel text={` ${schoolShortName} Alumni Community`}
                                icon={<RiHeartLine />}
                                className="border-primary2-600 text-primary2-200 bg-transparent dark:border-gunmetal-400 dark:text-gunmetal-200" />
                        </FadeUpWrapper>

                        {/* Headline */}
                        <FadeUpWrapper delay={0.08} className="text-center mb-6">
                            <h2
                                className="font-display font-bold leading-[1.1] text-balance text-white dark:text-gunmetal-200"
                                style={{
                                    fontSize: "clamp(2.4rem, 6vw, 4.2rem)",
                                    letterSpacing: "-0.03em",
                                }}
                            >
                                Your batch is waiting {" "}
                                <span
                                    style={{
                                        background: "linear-gradient(135deg, #72C48C 0%, #4DB472 50%, #9DD8AE 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundClip: "text",
                                    }}
                                >
                                    for You
                                </span>{" "}
                            </h2>
                        </FadeUpWrapper>

                        {/* Subtext */}
                        <FadeUpWrapper delay={0.14} className="text-center mb-12">
                            <p
                                className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto text-gunmetal-300">
                                Do not let time create distance. Reconnect with your classmates, share your story, and become part of the living history of {schoolShortName}.
                            </p>
                        </FadeUpWrapper>

                        {/* CTA Buttons */}
                        <FadeUpWrapper delay={0.26} className="flex flex-col sm:flex-row gap-4 justify-center">
                            <PrimaryButton
                                icon2={<HiArrowUpRight />}
                                title="Join Now - It's Free" href="/login" />

                            <PrimaryButton
                                title="Browse Batches" href="/batches" />
                        </FadeUpWrapper>

                        {/* Bottom trust note */}
                        <FadeUpWrapper delay={0.32} className="text-center mt-8">
                            <p className="text-gunmetal-300 ">
                                Free forever for all {schoolShortName} alumni · No spam · Verified community
                            </p>
                        </FadeUpWrapper>
                    </div>
                </div>
            </FadeUpWrapper>
        </section>
    )
}
export default AboutPageCTA