import { z, string, object } from "zod";

export const resetPasswordSchema = object({
    password: string()
        .min(6, "Password must be at least 6 characters"),
    confirmPassword: string()
        .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const RESET_PASSWORD_FIELD_ORDER: (keyof ResetPasswordFormValues)[] = [
    "password",
    "confirmPassword",
];
