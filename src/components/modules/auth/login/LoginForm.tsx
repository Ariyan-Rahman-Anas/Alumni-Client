"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { RiArrowRightLine, RiEyeLine, RiEyeOffLine, RiLock2Line, RiMailLine } from "react-icons/ri";

import InputField from "@/components/shared/InputField";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { LoginPayload, useLoginUserMutation } from "@/redux/apis/authApi";
import type { AppDispatch } from "@/redux/store";
import { setUser } from "@/redux/slice/authSlice";

const loginSchema = z.object({
    email: z.string().trim().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [showPassword, setShowPassword] = useState(false);
    const [loginUser, { isLoading }] = useLoginUserMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const payload: LoginPayload = { email: data.email, password: data.password };
            const result = await loginUser(payload).unwrap();
            dispatch(setUser(result.data.user));
            toast.success(result.message);
            router.push("/");
        } catch (err: unknown) {
            const message =
                (err as { data?: { message?: string } })?.data?.message ||
                "Login failed. Please check your credentials.";
            toast.error(message);
        }
    };

    return (
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <InputField
                {...register("email")}
                id="login-email"
                type="email"
                label="Email Address"
                placeholder="you@example.com"
                icon={<RiMailLine />}
                error={errors.email?.message}
                required
            />

            <div className="flex flex-col gap-1.5">
                <label htmlFor="login-password" className="block text-xs">
                    Password <span className="text-danger">*</span>
                </label>
                <div className="relative">
                    <RiLock2Line
                        className={`pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg ${errors.password ? "text-danger" : "text-primary2-500"}`}
                    />
                    <input
                        {...register("password")}
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className={`h-10 w-full rounded-lg border bg-white pl-10 pr-10 text-sm text-accent-foreground outline-none transition focus-visible:border-primary2-500 ${errors.password ? "border-danger" : ""}`}
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword((p) => !p)}
                        className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg ${errors.password ? "text-danger" : "text-primary2-500"}`}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-xs text-danger">{errors.password.message}</p>
                )}
            </div>

            <div className="flex items-center justify-end pt-0.5">
                <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-primary2-600 hover:underline"
                >
                    Forgot password?
                </Link>
            </div>

            <PrimaryButton
                type="submit"
                title="Sign In"
                icon={<RiArrowRightLine />}
                iconSide="right"
                isFullWidth
                isLoading={isLoading} className="py-5"
                loadingTitle="Signing in..."
            />
        </form>
    );
};

export default LoginForm;
