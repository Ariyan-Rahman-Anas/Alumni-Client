import { Suspense } from "react";
import VerifyEmailPage from "@/components/Pages/Auth/VerifyEmailPage";

const VerifyEmail = () => {
    return (
        <Suspense fallback={null}>
            <VerifyEmailPage />
        </Suspense>
    );
};
export default VerifyEmail;
