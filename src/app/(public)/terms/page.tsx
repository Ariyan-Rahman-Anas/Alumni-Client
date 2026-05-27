import TermsPage from "@/components/pages/user/Terms/TermsPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service | BAMHS Alumni",
    description: "Read the terms and conditions governing your use of the BAMHS Alumni portal.",
};

export default function Terms() {
    return <TermsPage />;
}
