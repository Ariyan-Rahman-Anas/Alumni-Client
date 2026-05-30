import PrivacyPage from "@/components/pages/user/Privacy/PrivacyPage";
import { getWebsiteData } from "@/lib/getWebsiteData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const wm = await getWebsiteData();
    const name: string = wm?.schoolName ?? "Battali Abdul Matin High School";
    return {
        title: "Privacy Policy",
        description: `Learn how ${name} Alumni Association collects, uses, and protects your personal information.`,
    };
}

export default function Privacy() {
    return <PrivacyPage />;
}
