import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import SectionLabel from "@/components/shared/SectionLabel"
import { RiGroupLine } from "react-icons/ri"

const BatchPageHead = () => {
    return (
        <FadeUpWrapper><section className="relative overflow-hidden rounded-3xl"
            style={{ background: "linear-gradient(145deg, var(--color-primary-950) 0%, var(--color-primary-900) 55%, var(--color-primary-950) 100%)" }}>
            <div className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-25"
                style={{ background: "var(--color-primary-500)" }} />
            <div className="absolute -bottom-12 left-1/3 h-48 w-48 rounded-full blur-3xl opacity-15"
                style={{ background: "rgba(245,158,11,1)" }} />

            <div className="relative z-10 px-7 py-12 sm:px-12 sm:py-16">
                <FadeUpWrapper>
                    <SectionLabel text="Batch Universe" align="left" icon={<RiGroupLine />}
                        className="text-primary2-300 dark:text-gunmetal-300 border-primary2-600 dark:border-gunmetal-400 " />
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl mt-5 font-bold text-white leading-tight max-w-3xl">
                        Every batch,{" "}
                        <span className="text-primary2-300">one Connected Ecosystem</span>
                    </h1>
                    <p className="text-base sm:text-lg leading-relaxed max-w-4xl text-gunmetal-300 mb-12 mt-5">
                        Map alumni by era, enable batch-led initiatives, and unlock collaboration patterns spanning six decades of graduating classes.
                    </p>
                </FadeUpWrapper>
            </div>
        </section></FadeUpWrapper>
    )
}
export default BatchPageHead