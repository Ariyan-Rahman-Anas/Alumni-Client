import { z } from "zod";

export const postJobSchema = z.object({
    title: z.string().trim().min(3, "Title must be at least 3 characters"),
    description: z.string().trim().min(10, "Description is required"),

    // Official
    company: z.string().trim().optional(),
    jobTitle: z.string().trim().optional(),
    jobType: z.string().optional(),
    salaryMin: z.string().optional(),
    salaryMax: z.string().optional(),
    experienceLevel: z.string().optional(),
    applicationDeadline: z.string().optional(),
    applicationInstruction: z.string().trim().optional(),
    location: z.string().trim().optional(),

    // Tuition
    studentClass: z.string().trim().optional(),
    studentGender: z.string().optional(),
    requiredTutorGender: z.string().optional(),
    timing: z.string().trim().optional(),
    sessionDuration: z.string().trim().optional(),

    // Shared seek
    seekLocation: z.string().trim().optional(),
    paymentAmount: z.string().optional(),
    paymentPer: z.string().optional(),
    startDate: z.string().optional(),

    // Personal
    serviceCategory: z.string().optional(),
});

export type PostJobFormValues = z.infer<typeof postJobSchema>;

export const POST_JOB_FIELD_ORDER: (keyof PostJobFormValues)[] = [
    "title",
    "description",
    "studentClass",
    "serviceCategory",
];
