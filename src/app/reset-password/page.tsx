import ResetPasswordPage from "@/components/pages/auth/ResetPasswordPage";
import { Suspense } from "react";

const ResetPassword = () => {
    return (
        <Suspense fallback={null}>
            <ResetPasswordPage />
        </Suspense>
    );
};

export default ResetPassword;
