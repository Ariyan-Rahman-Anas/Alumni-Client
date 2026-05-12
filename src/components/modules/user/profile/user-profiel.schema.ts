import { z, object, string, boolean } from "zod";
import { constantsData } from "@/constants";

const BLOOD_GROUPS = Object.values(constantsData.BLOOD_GROUPS) as string[];

export const profileSchema = object({
  name: string().min(2, "Name must be at least 2 characters"),

  phone: string()
    .optional()
    .refine(
      (v) => !v || /^\+?[0-9]{11,14}$/.test(v),
      "Phone number must be 11–14 digits"
    ),

  bloodGroup: string()
    .optional()
    .refine(
      (v) => !v || BLOOD_GROUPS.includes(v),
      "Invalid blood group"
    ),

  dob: string().optional(),

  currentAddress: string()
    .optional()
    .refine(
      (v) => !v || v.length === 0 || v.length >= 5,
      "Address must be at least 5 characters"
    ),

  permanentAddress: string()
    .optional()
    .refine(
      (v) => !v || v.length === 0 || v.length >= 5,
      "Address must be at least 5 characters"
    ),

  workplace: string().optional(),
  position: string().optional(),

  isInterestedToDonateBlood: boolean().optional(),

  bloodDonateCount: z.coerce.number().min(0).optional(),

  lastBloodDonationDate: string().optional(),
})
.superRefine((data, ctx) => {

  // 1. bloodDonateCount > 0 hole lastBloodDonationDate required
  if (data.bloodDonateCount && data.bloodDonateCount > 0) {
    if (!data.lastBloodDonationDate || data.lastBloodDonationDate === "") {
      ctx.addIssue({
        code: "custom" as const,
        path: ["lastBloodDonationDate"],
        message: "Please provide the date of your last blood donation",
      });
    }
  }

  // 1b. bloodDonateCount 0 ba empty hole date dewa jacche na
  if (!data.bloodDonateCount || data.bloodDonateCount === 0) {
    if (data.lastBloodDonationDate && data.lastBloodDonationDate !== "") {
      ctx.addIssue({
        code: "custom" as const,
        path: ["lastBloodDonationDate"],
        message: "Since your blood donation count is zero, you cannot provide a last donation date",
      });
    }
  }

  // 2. lastBloodDonationDate future hote parbe na
  if (data.lastBloodDonationDate) {
    const inputDate = new Date(data.lastBloodDonationDate);
    const today = new Date();

    // remove time for proper compare
    today.setHours(0, 0, 0, 0);

    if (inputDate > today) {
      ctx.addIssue({
        code: "custom" as const,
        path: ["lastBloodDonationDate"],
        message: "Date cannot be in the future",
      });
    }
  }
});