import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import SectionLabel from "@/components/shared/SectionLabel"
import {
    RiBriefcaseLine,
} from "react-icons/ri"
import { useSchoolInfo } from "@/hooks/useSchoolInfo";

const JobPageHead = () => {
    const { shortName } = useSchoolInfo();

    return (
        <FadeUpWrapper delay={0.1} className="three-xl-section-setup">
            <section
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

                <div className="relative z-10 px-7 py-12 sm:px-12 sm:py-16 space-y-8">
                    <FadeUpWrapper
                        delay={0.15}
                    >
                        <SectionLabel text="Alumni Network · Job Board" align="left" icon={<RiBriefcaseLine />}
                            className="text-primary2-300 dark:text-gunmetal-300 border-primary2-600 dark:border-gunmetal-400 " />

                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mt-5 text-white dark:text-gunmetal-200 leading-tight max-w-3xl">
                            Opportunities {" "}
                            <span className="text-primary2-300 dark:text-primary">& Services Hub</span>
                        </h1>

                        <p className="text-base sm:text-lg leading-relaxed max-w-4xl text-gunmetal-300 mb-12 mt-5">
                            Discover career openings, find tutors, hire skilled workers — or post your own. All within the {shortName} alumni community.
                        </p>
                    </FadeUpWrapper>
                </div>
            </section>
        </FadeUpWrapper>
    )
}
export default JobPageHead