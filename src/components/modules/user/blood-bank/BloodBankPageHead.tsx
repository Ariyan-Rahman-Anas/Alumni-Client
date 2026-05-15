import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import { Badge } from "@/components/ui/badge"
import { RiHeartPulseLine } from "react-icons/ri"

const BloodBankPageHead = () => {
    return (<div className="three-xl-section-setup ">
        <FadeUpWrapper className="relative overflow-hidden rounded-3xl"
            style={{ background: "linear-gradient(145deg, #2d0a0a 0%, #7f1d1d 50%, #1c0708 100%)" }}>
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />
            <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-30"
                style={{ background: "#dc2626" }} />
            <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full blur-3xl opacity-20"
                style={{ background: "#f87171" }} />

            <div className="relative z-10 px-7 py-12 sm:px-12 sm:py-16">
                <FadeUpWrapper
                //   initial={{ opacity: 0, y: 20 }}
                //   animate={{ opacity: 1, y: 0 }}
                //   transition={{ duration: 0.55 }}
                >
                    <Badge className="mb-5 bg-white/10 text-rose-200 border-rose-400/30 hover:bg-white/10">
                        <RiHeartPulseLine className="mr-1.5" /> Blood Bank Network
                    </Badge>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
                        Emergency support,{" "}
                        <span className="text-rose-300">coordinated with precision</span>
                    </h1>
                    <p className="mt-5 max-w-2xl text-sm sm:text-lg text-rose-100/75 leading-relaxed">
                        A rapid-response coordination hub for donor matching, urgent notices, and life-saving alumni action — all in one place.
                    </p>
                </FadeUpWrapper>
            </div>
        </FadeUpWrapper>
    </div>
    )
}
export default BloodBankPageHead