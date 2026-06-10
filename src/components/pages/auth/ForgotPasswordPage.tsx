import ForgotPasswordForm from "@/components/modules/auth/forgot-password/ForgotPasswordForm";

const ForgotPasswordPage = () => {
    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <div
                className="w-full max-w-md rounded-3xl bg-white dark:bg-gunmetal-600 p-8"
                style={{ boxShadow: "0 24px 65px rgba(5,31,21,0.18)" }}
            >
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary2-50 text-3xl text-primary2-600">
                        🔑
                    </div>
                    <h1 className="text-2xl font-semibold text-primary2-900 dark:text-gunmetal-100">
                        Forgot password?
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Enter your email and we&apos;ll send you a reset link.
                    </p>
                </div>

                <ForgotPasswordForm />
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
