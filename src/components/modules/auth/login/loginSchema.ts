import { z, string, object } from "zod";

export const loginSchema = object({
    email: 
    string()
    .trim()
    .min(1, "Please enter your email")
    .email("Please enter a valid email address"),
    password: string({error: "Password is required"}).min(6, "Password must be at least 6 characters"),
});


export type LoginFormValues = z.infer<typeof loginSchema>;

/** Determines which field's error is shown first (top → bottom order). */
export const LOGIN_FIELD_ORDER: (keyof LoginFormValues)[] = [
    "email",
    "password",
];