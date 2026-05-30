import RegisterProviderPage from "@/components/pages/user/Jobs/RegisterProviderPage";
import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const wm = await getWebsiteData();
    const shortName = wm?.schoolName ? toShortName(wm.schoolName) : "BAMHS";
    return {
        title: "Register as Provider",
        description: `Register as a tutor or service provider in the ${shortName} alumni network.`,
    };
}

const RegisterProvider = () => {
    return <RegisterProviderPage />;
};
export default RegisterProvider;