import { z, object, string, boolean } from "zod";
import { constantsData } from "@/constants";

const BLOOD_GROUPS = Object.values(constantsData.BLOOD_GROUPS) as string[];

/** Returns age in full years from an ISO date string, or null if not parseable. */
function calcAge(dob: string | undefined): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (isNaN(d.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - d.getFullYear();
  const m = today.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < d.getDate())) age--;
  return age;
}

/** WHO minimum days between whole-blood donations (male = 90, female = 120).
 *  Without gender data we enforce the universal minimum of 90 days.
 */
const MIN_DONATION_INTERVAL_DAYS = 90;

/** Minimum age (years) to be a registered blood donor. */
const MIN_DONOR_AGE = 18;

/** Maximum recommended donor age. */
const MAX_DONOR_AGE = 65;

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

  bloodDonateCount: z.coerce
    .number({ error: "Enter a valid number" })
    .int("Must be a whole number")
    .min(0, "Cannot be negative")
    .max(500, "Value seems unrealistically high")
    .optional(),

  lastBloodDonationDate: string().optional(),
})
.superRefine((data, ctx) => {
  const age = calcAge(data.dob);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  /* ── 1. Interested to donate: must be ≥ 18 ───────────────────── */
  if (data.isInterestedToDonateBlood) {
    if (age !== null && age < MIN_DONOR_AGE) {
      ctx.addIssue({
        code: "custom" as const,
        path: ["isInterestedToDonateBlood"],
        message: `You must be at least ${MIN_DONOR_AGE} years old to register as a blood donor (WHO standard)`,
      });
    }
    if (age !== null && age > MAX_DONOR_AGE) {
      ctx.addIssue({
        code: "custom" as const,
        path: ["isInterestedToDonateBlood"],
        message: `Regular blood donors must be under ${MAX_DONOR_AGE} years of age (WHO standard)`,
      });
    }
  }

  /* ── 2. Donation count validations ───────────────────────────── */
  const count = data.bloodDonateCount ?? 0;

  if (count > 0) {
    // 2a. Must be ≥ 18 to have donated at all
    if (age !== null && age < MIN_DONOR_AGE) {
      ctx.addIssue({
        code: "custom" as const,
        path: ["bloodDonateCount"],
        message: `You cannot have donated blood before age ${MIN_DONOR_AGE}. Please correct your date of birth or donation count.`,
      });
    }

    // 2b. Lifetime maximum — bounded by last donation date (if provided) or today
    if (age !== null && age >= MIN_DONOR_AGE && data.dob) {
      const eighteenthBirthday = new Date(data.dob);
      eighteenthBirthday.setFullYear(eighteenthBirthday.getFullYear() + MIN_DONOR_AGE);
      eighteenthBirthday.setHours(0, 0, 0, 0);

      // If a last-donation date is given and is on/after the 18th birthday,
      // compute the physical maximum from eligibility start → that date.
      // Otherwise fall back to eligibility start → today.
      let referenceDate = today;
      if (
        data.lastBloodDonationDate &&
        data.lastBloodDonationDate !== ""
      ) {
        const ld = new Date(data.lastBloodDonationDate);
        ld.setHours(0, 0, 0, 0);
        if (ld >= eighteenthBirthday) referenceDate = ld;
      }

      const daysEligible = Math.floor(
        (referenceDate.getTime() - eighteenthBirthday.getTime()) / 86400000
      );
      // First donation possible on day 0 (18th birthday), then every MIN_DONATION_INTERVAL_DAYS
      const maxLifetime =
        daysEligible < 0 ? 0 : Math.floor(daysEligible / MIN_DONATION_INTERVAL_DAYS) + 1;

      if (count > maxLifetime) {
        const byDateNote =
          referenceDate !== today
            ? ` by your last recorded donation date`
            : ` given your age`;
        ctx.addIssue({
          code: "custom" as const,
          path: ["bloodDonateCount"],
          message:
            maxLifetime === 0
              ? "You just became eligible — you could not have donated yet"
              : `The maximum physically possible donations${byDateNote} is ${maxLifetime} (one every ${MIN_DONATION_INTERVAL_DAYS} days since age ${MIN_DONOR_AGE})`,
        });
      }
    }

    // 2c. lastBloodDonationDate required when count > 0
    if (!data.lastBloodDonationDate || data.lastBloodDonationDate === "") {
      ctx.addIssue({
        code: "custom" as const,
        path: ["lastBloodDonationDate"],
        message: "Please provide the date of your last blood donation",
      });
    }
  }

  // 2d. Count = 0 → no date allowed
  if (count === 0) {
    if (data.lastBloodDonationDate && data.lastBloodDonationDate !== "") {
      ctx.addIssue({
        code: "custom" as const,
        path: ["lastBloodDonationDate"],
        message: "Remove the date — your donation count is 0",
      });
    }
  }

  /* ── 3. lastBloodDonationDate validations ────────────────────── */
  if (data.lastBloodDonationDate && data.lastBloodDonationDate !== "") {
    const donationDate = new Date(data.lastBloodDonationDate);
    donationDate.setHours(0, 0, 0, 0);

    // 3a. Not in the future
    if (donationDate > today) {
      ctx.addIssue({
        code: "custom" as const,
        path: ["lastBloodDonationDate"],
        message: "Last donation date cannot be in the future",
      });
    }

    // 3b. Cannot be before donor turned 18
    if (age !== null && data.dob) {
      const eighteenthBirthday = new Date(data.dob);
      eighteenthBirthday.setFullYear(eighteenthBirthday.getFullYear() + MIN_DONOR_AGE);
      if (donationDate < eighteenthBirthday) {
        ctx.addIssue({
          code: "custom" as const,
          path: ["lastBloodDonationDate"],
          message: `Donation date cannot be before you turned ${MIN_DONOR_AGE}`,
        });
      }
    }
  }
});