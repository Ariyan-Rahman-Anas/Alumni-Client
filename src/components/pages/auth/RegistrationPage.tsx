import LeftSection from "@/components/modules/auth/registration/LeftSection";
import RightSection from "@/components/modules/auth/registration/RightSection";
import { FadeUpWrapper } from "../user/Home/HomePage";

const RegistrationPage = () => {
    return <FadeUpWrapper className="relative overflow-hidden three-xl-section-setup md:pt-30 pb-18 md:pb-10">
        <div className="relative z-10 flex flex-col lg:flex-row">
            <div className="flex-1">
                <LeftSection />
            </div>
            <div className="flex-1">
                <RightSection />
            </div>
        </div>
    </FadeUpWrapper>;
};
export default RegistrationPage;