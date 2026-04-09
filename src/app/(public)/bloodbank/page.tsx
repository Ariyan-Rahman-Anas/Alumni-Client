import type { Metadata } from "next";
import BloodBankPage from "@/components/Pages/BloodBank/BloodBankPage";

export const metadata: Metadata = {
    title: "Blood Bank | BAMHS Alumni",
    description: "Rapid alumni blood support network for urgent and scheduled needs.",
};

const BloodBank = () => {
    return <BloodBankPage />;
};

export default BloodBank;
