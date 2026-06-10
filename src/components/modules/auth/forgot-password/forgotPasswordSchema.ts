import { z, string, object } from "zod";

export const forgotPasswordSchema = object({
    email: string()
        .trim()
        .min(1, "Please enter your email")
        .email("Please enter a valid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const FORGOT_PASSWORD_FIELD_ORDER: (keyof ForgotPasswordFormValues)[] = ["email"];
