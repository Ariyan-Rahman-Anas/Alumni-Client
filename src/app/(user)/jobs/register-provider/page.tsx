import RegisterProviderPage from "@/components/pages/user/Jobs/RegisterProviderPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Register as Provider | BAMHS Alumni",
    description: "Register as a tutor or service provider in the BAMHS alumni network.",
};

const RegisterProvider = () => {
    return <RegisterProviderPage />;
};
export default RegisterProvider;