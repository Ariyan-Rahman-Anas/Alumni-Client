import BloodBankPage from "@/components/pages/user/BloodBank/BloodBankPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blood Bank | BAMHS Alumni",
    description: "Rapid alumni blood support network for urgent and scheduled needs.",
};

const BloodBank = () => {
    return <BloodBankPage />;
};
export default BloodBank;