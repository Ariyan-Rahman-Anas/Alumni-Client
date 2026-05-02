import { z, object, string } from "zod";

export const registrationSchema = object({
    name: string().trim().min(2, "Name must be at least 2 characters"),
    email: string().trim().email("Please enter a valid email address"),
    phone: string()
        .regex(/^\+?[0-9]{11,16}$/, "Phone must be 11–16 digits including country code"),
    batch: string().min(1, "Please select your batch year"),
    section: string().min(1, "Please select your section"),
    dob: string()
        .min(1, "Date of birth is required")
        .refine((val) => !isNaN(Date.parse(val)), "Please enter a valid date of birth"),
    bloodGroup: string().min(1, "Please select your blood group"),
    currentAddress: string()
        .trim()
        .min(5, "Current address must be at least 5 characters")
        .max(150, "Current address is too long"),
    permanentAddress: string()
        .trim()
        .min(5, "Permanent address must be at least 5 characters")
        .max(150, "Permanent address is too long"),
    workplace: string().trim().max(120).optional(),
    position: string().trim().max(120).optional(),
    password: string().min(6, "Password must be at least 6 characters"),
    confirmPassword: string().min(1, "Confirm password is required"),
}).refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
}).refine((values)=>values.phone.length >= 11 && values.phone.length <= 16, {
    message: "Phone must be 11–16 digits including country code",
    path: ["phone"],
}).refine((values)=>values.dob && !isNaN(Date.parse(values.dob)) && new Date(values.dob) <= new Date() && new Date(values.dob).getFullYear() < Number(values.batch), {
    message: "Please enter a valid date of birth in the past", 
    path: ["dob"],
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