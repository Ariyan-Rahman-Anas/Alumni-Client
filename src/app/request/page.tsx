import type { Metadata } from "next";
import RequestToAdminPage from "@/components/Pages/Request/RequestToAdminPage";

export const metadata: Metadata = {
    title: "Request To Admin | BAMHS Alumni",
    description: "Submit alumni support requests directly to admin with clear workflow tracking.",
};

const RequestPage = () => {
    return <RequestToAdminPage />;
};

export default RequestPage;
