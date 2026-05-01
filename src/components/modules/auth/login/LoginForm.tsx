"use client";

import Link from "next/link";
import { useDispatch } from "react-redux";
import { Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { RiArrowRightLine, RiMailLine } from "react-icons/ri";

import InputField from "@/components/shared/InputField";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { useLoginUserMutation } from "@/redux/apis/authApi";
import type { AppDispatch } from "@/redux/store";
import { setUser } from "@/redux/slice/authSlice";
import { useFormWithToast } from "@/hooks/useFormWithToast";
import { LOGIN_FIELD_ORDER, LoginFormValues, loginSchema } from "./loginSchema";
import PasswordField from "@/components/shared/PasswordField";
import { ILoginPayload } from "@/app/(auth)/auth.types";

const LoginForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [loginUser, { isLoading }] = useLoginUserMutation();

    const methods = useFormWithToast<LoginFormValues>(
        {
            resolver: zodResolver(loginSchema),
            defaultValues: {
                email: "",
                password: "",
            },
        },
        { fieldOrder: LOGIN_FIELD_ORDER }
    );

    const {
        register,
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = methods;

    const onSubmit = async (data: LoginFormValues) => {
        try {
            const payload: ILoginPayload = { email: data.email, password: data.password };
            console.log({ data })
            const result = await loginUser(payload).unwrap();
            dispatch(setUser({ user: result.data.user, accessToken: result.data.accessToken }));
            toast.success(result.message);
            reset();
            // ClientAuthGuard (requireGuest) detects the user in Redux and
            // redirects to ?next (or /) — no explicit router.push needed here.
        } catch (err: unknown) {
            const message =
                (err as { data?: { message?: string } })?.data?.message ||
                "Login failed. Please check your credentials.";
            toast.error(message);
        }
    };

    return (
        <FormProvider {...methods}>
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

                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <PasswordField
                            id="login-password"
                            name={field.name}
                            label="Password"
                            value={field.value}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            error={errors.password?.message}
                            required
                        />
                    )}
                />

                <div className="flex items-center justify-end pt-0.5">
                    <Link
                        href="/forgot-password"
                        className="text-xs font-medium text-primary2-600 dark:text-primary hover:underline"
                    >
                        Forgot password?
                    </Link>
                </div>

                <PrimaryButton
                    type="submit"
                    title="Sign In"
                    icon2={<RiArrowRightLine />}
                    iconSide2="right"
                    isFullWidth
                    isLoading={isLoading} className="py-5"
                    loadingTitle="Signing in..."
                />
            </form>
        </FormProvider>
    );
};
export default LoginForm;
