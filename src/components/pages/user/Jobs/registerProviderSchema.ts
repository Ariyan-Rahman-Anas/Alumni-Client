import { z } from "zod";

export const registerProviderSchema = z.object({
    providerType: z.string().min(1, "Please select a provider type"),
    bio: z.string().trim().min(20, "Bio must be at least 20 characters"),
    experience: z.string().trim().min(1, "Experience is required"),
    gender: z.enum(["MALE", "FEMALE"]),
    location: z.string().trim().min(2, "Location is required"),
    hourlyRate: z.string().optional(),
    monthlyRate: z.string().optional(),
    availableGenderStudents: z.string().optional(),
});

export type RegisterProviderFormValues = z.infer<typeof registerProviderSchema>;

export const REGISTER_PROVIDER_FIELD_ORDER: (keyof RegisterProviderFormValues)[] = [
    "providerType",
    "bio",
    "experience",
    "gender",
    "location",
];
