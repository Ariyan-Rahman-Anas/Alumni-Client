import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import SectionLabel from "@/components/shared/SectionLabel"
import { RiGroupLine } from "react-icons/ri"

const BatchPageHead = () => {
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
                        <SectionLabel text="Batch Universe" align="left" icon={<RiGroupLine />}
                            className="text-primary2-300 dark:text-gunmetal-300 border-primary2-600 dark:border-gunmetal-400 " />
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mt-5 text-white dark:text-gunmetal-200 leading-tight max-w-3xl">
                            Every batch,{" "}
                            <span className="text-primary2-300 dark:text-primary">One Connected Ecosystem</span>
                        </h1>
                        <p className="text-base sm:text-lg leading-relaxed max-w-4xl text-gunmetal-300 mb-12 mt-5">
                            Map alumni by era, enable batch-led initiatives, and unlock collaboration patterns spanning six decades of graduating classes.
                        </p>
                    </FadeUpWrapper>
                </div>
            </FadeUpWrapper>
        </section>
    )
}
export default BatchPageHead