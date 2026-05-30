import { Suspense } from "react";
import ResetPasswordPage from "@/components/pages/auth/ResetPasswordPage";

const ResetPassword = () => (
    <Suspense fallback={null}>
        <ResetPasswordPage />
    </Suspense>
);
export default ResetPassword;
