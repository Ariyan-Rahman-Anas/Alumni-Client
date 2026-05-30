import TermsPage from "@/components/pages/user/Terms/TermsPage";
import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const wm = await getWebsiteData();
    const shortName = wm?.schoolName ? toShortName(wm.schoolName) : "BAMHS";
    return {
        title: "Terms of Service",
        description: `Read the terms and conditions governing your use of the ${shortName} Alumni portal.`,
    };
}

export default function Terms() {
    return <TermsPage />;
}
