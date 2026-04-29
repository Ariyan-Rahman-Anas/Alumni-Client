import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import PrimaryButton from "@/components/shared/PrimaryButton"
import SectionLabel from "@/components/shared/SectionLabel"
import { RiAddLine, RiBriefcaseLine, RiStarLine } from "react-icons/ri"

const JobPageHead = () => {
    
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

                <div className="relative z-10 px-7 py-12 sm:px-12 sm:py-16 space-y-8">
                    <FadeUpWrapper
                        delay={0.15}
                    >
                        <SectionLabel text="Alumni Network · Job Board" align="left" icon={<RiBriefcaseLine />} className="text-primary2-200 capitalize mb-2" />
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
                            Opportunities{" "}
                            <span className="text-primary2-300">& Services Hub</span>
                        </h1>

                        <p className="mt-5 max-w-2xl text-sm sm:text-lg text-primary2-100/75 leading-relaxed">
                            Discover career openings, find tutors, hire skilled workers — or post your own. All within the BAMHS alumni community.
                        </p>
                    </FadeUpWrapper>


                    {/* Actions */}
                    <FadeUpWrapper delay={0.25}>
                        <div className="flex flex-wrap gap-3 tracking-wide">
                            <PrimaryButton
                                title="Post a Job"
                                icon={<RiAddLine />}
                                href="/jobs/post"
                                className="bg-white text-primary2-700 py-[19px] rounded-full font-semibold"
                            />
                            <PrimaryButton
                                title="Register as Provider"
                                icon={<RiStarLine />}
                                href="/jobs/register-provider"
                                className="bg-transparent text-white py-[19px] rounded-full border border-surface-100/60 primary2-500/50 font-semibold"
                            />
                        </div>
                    </FadeUpWrapper>
                </div>
            </section>
        </FadeUpWrapper>
    )
}
export default JobPageHead