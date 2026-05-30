import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import SectionLabel from "@/components/shared/SectionLabel"
import { RiDropLine } from "react-icons/ri"

const BloodBankPageHead = () => {
    return (<div className="three-xl-section-setup ">
        <FadeUpWrapper className="relative overflow-hidden rounded-3xl"
            style={{ background: "linear-gradient(145deg, var(--color-blood-bank-950) 0%, var(--color-blood-bank-900) 50%, var(--color-blood-bank-950) 100%)" }}>
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-30"
                style={{ background: "var(--color-blood-bank-600)" }} />
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full blur-3xl opacity-20"
                style={{ background: "var(--color-blood-bank-300)" }} />

            <div className="relative z-10 three-xl-section-padding">
                <FadeUpWrapper>
                    <SectionLabel
                        text="Blood Bank Network"
                        align="left"
                        icon={<RiDropLine />}
                        className="text-danger border-danger/30"
                    />
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl mt-5 font-bold text-white leading-tight max-w-3xl">
                        Emergency support,{" "}
                        <span className="text-bloodBank-300">coordinated with precision</span>
                    </h1>
                    <p className="mt-5 max-w-2xl text-sm sm:text-lg leading-relaxed" style={{ color: "color-mix(in srgb, var(--color-blood-bank-100) 75%, transparent)" }}>
                        A rapid-response coordination hub for donor matching, urgent notices, and life-saving alumni action — all in one place.
                    </p>
                </FadeUpWrapper>
            </div>
        </FadeUpWrapper>
    </div>
    )
}
export default BloodBankPageHead