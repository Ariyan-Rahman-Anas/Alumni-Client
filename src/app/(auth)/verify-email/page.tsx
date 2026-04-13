import VerifyEmailPage from "@/components/pages/auth/VerifyEmailPage";
import { Suspense } from "react";

const VerifyEmail = () => {
    return (
        <Suspense fallback={null}>
            <VerifyEmailPage />
        </Suspense>
    );
};
export default VerifyEmail;
