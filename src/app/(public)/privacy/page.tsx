import PrivacyPage from "@/components/pages/user/Privacy/PrivacyPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy | BAMHS Alumni",
    description: "Learn how BAMHS Alumni Association collects, uses, and protects your personal information.",
};

export default function Privacy() {
    return <PrivacyPage />;
}
