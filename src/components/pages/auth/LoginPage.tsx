import LeftSection from "@/components/modules/auth/login/LeftSection";
import RightSection from "@/components/modules/auth/login/RightSection";
import { FadeUpWrapper } from "../user/Home/HomePage";

const LoginPage = () => {
    return <FadeUpWrapper delay={0.1} className="relative bg-blue500 z-10 grid grid-cols-1 md:grid-cols-[60%_40%] three-xl-section-setup">
        <div
            className="rounded-t-3xl border border-white dark:border-gunmetal-500 border-b-0 md:border-b md:border-r-0 w-full md:rounded-tr-none md:rounded-l-3xl flex flex-col md:flex-row items-center justify-center">
            <LeftSection />
        </div>
        <RightSection />

    </FadeUpWrapper>
};
export default LoginPage;