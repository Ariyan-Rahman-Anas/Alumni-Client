import BloodBankPage from "@/components/pages/user/BloodBank/BloodBankPage";
import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const wm = await getWebsiteData();
    const shortName = wm?.schoolName ? toShortName(wm.schoolName) : "BAMHS";
    return {
        title: "Blood Bank",
        description: `Rapid ${shortName} alumni blood support network for urgent and scheduled needs.`,
    };
}

const BloodBank = () => {
    return <BloodBankPage />;
};
export default BloodBank;