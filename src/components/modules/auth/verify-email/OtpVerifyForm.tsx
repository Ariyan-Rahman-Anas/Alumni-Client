"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import PrimaryButton from "@/components/shared/PrimaryButton";
import { useResendOtpMutation, useVerifyOtpMutation } from "@/redux/apis/authApi";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

interface OtpVerifyFormProps {
    email: string;
}

const OtpVerifyForm = ({ email }: OtpVerifyFormProps) => {
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
    const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

    // Countdown timer
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const focusInput = (index: number) => {
        inputRefs.current[index]?.focus();
    };

    const handleChange = (index: number, value: string) => {
        // allow paste of full OTP
        if (value.length > 1) {
            const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
            const next = [...otp];
            digits.forEach((d, i) => {
                if (index + i < OTP_LENGTH) next[index + i] = d;
            });
            setOtp(next);
            const nextFocus = Math.min(index + digits.length, OTP_LENGTH - 1);
            focusInput(nextFocus);
            return;
        }

        const digit = value.replace(/\D/g, "");
        const next = [...otp];
        next[index] = digit;
        setOtp(next);
        if (digit && index < OTP_LENGTH - 1) {
            focusInput(index + 1);
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace") {
            if (otp[index]) {
                const next = [...otp];
                next[index] = "";
                setOtp(next);
            } else if (index > 0) {
                focusInput(index - 1);
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            focusInput(index - 1);
        } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
            focusInput(index + 1);
        }
    };

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            const code = otp.join("");
            if (code.length < OTP_LENGTH) {
                toast.error("Please enter the complete 6-digit code.");
                return;
            }
            try {
                const verifyRes = await verifyOtp({ email, otp: code }).unwrap();
                // toast.success("Email verified! You can now log in once your account is approved.");
                toast.success(verifyRes.message);
                router.push("/login");
            } catch (err: unknown) {
                const message =
                    (err as { data?: { message?: string } })?.data?.message ||
                    "Verification failed. Please try again.";
                toast.error(message);
                // clear otp boxes on failure
                setOtp(Array(OTP_LENGTH).fill(""));
                focusInput(0);
            }
        },
        [otp, email, verifyOtp, router]
    );

    const handleResend = async () => {
        try {
            const resendRes = await resendOtp({ email }).unwrap();
            toast.success(resendRes.message);
            setCountdown(RESEND_COOLDOWN);
            setOtp(Array(OTP_LENGTH).fill(""));
            focusInput(0);
        } catch (err: unknown) {
            const message =
                (err as { data?: { message?: string } })?.data?.message ||
                "Failed to resend code. Please try again.";
            toast.error(message);
        }
    };

    const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, (_, a, _b, c) => `${a}${"*".repeat(4)}${c}`);

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col items-center gap-6">
            <div className="text-center">
                <p className="text-sm text-muted-foreground">
                    We sent a 6-digit code to <span className="font-medium text-primary2-700">
                        {maskedEmail}
                    </span>
                </p>
                
                <p className="text-sm text-muted-foreground">
                    Code is valid for 10 minutes
                </p>
            </div>

            {/* OTP boxes */}
            <div className="flex gap-2.5">
                {otp.map((digit, i) => (
                    <input
                        key={i}
                        ref={(el) => { inputRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={OTP_LENGTH}
                        value={digit}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onFocus={(e) => e.target.select()}
                        className={`h-12 w-11 rounded-lg border-[2.5px] bg-white dark:bg-gunmetal-600 text-center text-black dark:text-gunmetal-200 text-lg font-semibold text-accent-foreground outline-none transition focus:border-primary2-500 dark:focus:border-gunmetal-200 ${digit ? "border-primary2-400 dark:border-gunmetal-300" : "border-border dark:border-gunmetal-400"}`}
                        aria-label={`Digit ${i + 1}`}
                        autoComplete={i === 0 ? "one-time-code" : "off"}
                    />
                ))}
            </div>

            <PrimaryButton
                type="submit"
                title="Verify Email"
                isFullWidth
                isLoading={isVerifying}
                loadingTitle="Verifying..." className="py-[19px] "
            />

            {/* Resend */}
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <span>Didn&apos;t receive it?</span>
                {countdown > 0 ? (
                    <span className="text-neutral-400">
                        Resend in {countdown}s
                    </span>
                ) : (
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={isResending}
                        className="font-medium text-primary2-600 underline-offset-2 hover:underline disabled:opacity-50"
                    >
                        {isResending ? "Sending..." : "Resend code"}
                    </button>
                )}
            </div>
        </form>
    );
};

export default OtpVerifyForm;
