import { z } from "zod";

export const registrationSchema = z.object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Please enter a valid email address"),
    phone: z
        .string()
        .regex(/^\+?[0-9]{11,16}$/, "Phone must be 11–16 digits including country code"),
    batch: z.string().min(1, "Please select your batch year"),
    section: z.string().min(1, "Please select your section"),
    dob: z
        .string()
        .min(1, "Date of birth is required")
        .refine((val) => !isNaN(Date.parse(val)), "Please enter a valid date of birth"),
    bloodGroup: z.string().min(1, "Please select your blood group"),
    currentAddress: z
        .string()
        .trim()
        .min(5, "Current address must be at least 5 characters")
        .max(150, "Current address is too long"),
    permanentAddress: z
        .string()
        .trim()
        .min(5, "Permanent address must be at least 5 characters")
        .max(150, "Permanent address is too long"),
    workplace: z.string().trim().max(120).optional(),
    position: z.string().trim().max(120).optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

export type RegistrationFormValues = z.infer<typeof registrationSchema>;

/** Determines which field's error is shown first (top → bottom order). */
export const REGISTRATION_FIELD_ORDER: (keyof RegistrationFormValues)[] = [
    "name",
    "email",
    "phone",
    "batch",
    "section",
    "dob",
    "bloodGroup",
    "currentAddress",
    "permanentAddress",
    "password",
    "confirmPassword",
];