import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import PrimaryButton from "@/components/shared/PrimaryButton"
import { RiArrowRightLine, RiSparkling2Line } from "react-icons/ri"

const JobPageProviderRegCTA = () => {
    return (
        <FadeUpWrapper
            delay={0.5}
            className="relative overflow-hidden rounded-3xl p-8 text-white text-center"
            style={{ background: "linear-gradient(145deg, #041a12 0%, #0c4a34 60%, #062319 100%)" }}
        >
            <div
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />
            <div className="absolute -top-12 right-12 h-32 w-32 rounded-full blur-2xl opacity-25" style={{ background: "rgba(245,158,11,1)" }} />
            <div className="relative z-10">
                <RiSparkling2Line className="text-3xl text-gold-300 mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2">Are you a skilled alumni?</h3>
                <p className="text-primary2-100/80 mb-6 max-w-xl mx-auto text-sm">
                    Register as a tutor or service provider and connect with alumni who need your expertise.
                </p>
                <PrimaryButton
                    title="Get Started"
                    href="/jobs/register-provider"
                    icon2={<RiArrowRightLine />}
                    className="py-[19px] rounded-full bg-white text-primary2-700 font-semibold  "
                    
                />
            </div>
        </FadeUpWrapper>
    )
}
export default JobPageProviderRegCTA