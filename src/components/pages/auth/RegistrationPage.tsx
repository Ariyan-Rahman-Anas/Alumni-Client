import LeftSection from "@/components/modules/auth/registration/LeftSection";
import RightSection from "@/components/modules/auth/registration/RightSection";

const RegistrationPage = () => {
    return <section className="relative overflow-hidden py-24sm:py-28">
        {/* <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(165deg, #041a12 0%, #0a3d2b 52%, #051f15 100%)" }}
        /> */}

        {/* <div
            className="absolute inset-0 pointer-events-none"
            style={{
                backgroundImage:
                    "linear-gradient(rgba(46,139,87,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.08) 1px, transparent 1px)",
                backgroundSize: "52px 52px",
            }}
        />

        <div
            className="absolute -top-20 -left-20 h-80 w-80 rounded-full blur-3xl"
            style={{ background: "rgba(77,180,114,0.22)" }}
        />
        <div
            className="absolute -bottom-24 -right-12 h-96 w-96 rounded-full blur-3xl"
            style={{ background: "rgba(245,158,11,0.16)" }}
        /> */}

        <div className="pagesetup relative z-10 flex flex-col md:flex-row gap-8">
            <div className="flex-1">
                <LeftSection />
            </div>
            <div className="flex-1">
                <RightSection />
            </div>
        </div>
    </section>;
};

export default RegistrationPage;