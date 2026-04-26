import LeftSection from "@/components/modules/auth/login/LeftSection";
import RightSection from "@/components/modules/auth/login/RightSection";
import { FadeUpWrapper } from "../user/Home/HomePage";

const LoginPage = () => {
    return <section className="relative overflow-hidden min-h-screen flex items-center justify-center py-24 sm:py-28">
        <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(165deg, #041a12 0%, #0a3d2b 52%, #051f15 100%)" }}
        />

        <div
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
        />

        <FadeUpWrapper delay={0.1} className="page-setup mx-auto z-10 flex flex-col md:flex-row ices-center justify-center shadow-2xl">
            <div
                className="rounded-t-3xl border border-surface border-b-0 md:border-b md:border-r-0 w-full md:w-1/2 md:rounded-tr-none md:rounded-l-3xl flex flex-col md:flex-row items-center justify-center"
                style={{
                    background: "linear-gradient(145deg, rgba(46,139,87,0.18) 0%, rgba(10,61,43,0.52) 100%)",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                }}
            >
                <LeftSection />
            </div>
            <RightSection />
        </FadeUpWrapper>
    </section>;
};
export default LoginPage;