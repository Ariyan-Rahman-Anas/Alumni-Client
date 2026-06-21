import { constantsData } from "@/constants";
import { z, object, string, boolean, enum as zEnum, literal, array, coerce } from "zod";

export const priceTierSchema = object({
    label: string().min(1, "Tier label is required"),
    fee: coerce.number({ error: "Fee must be a number" }).min(0, "Fee cannot be negative"),
    batchFrom: coerce.number().int().min(1950).max(2150).optional().or(literal("")),
    batchTo: coerce.number().int().min(1950).max(2150).optional().or(literal("")),
});

export const eventSchema = z
    .object({
        title: string().min(3, "Title must be at least 3 characters"),
        description: string().min(10, "Description must be at least 10 characters"),
        category: zEnum(constantsData.event.eventCategory, { error: "Please select a category" }),
        status: zEnum(constantsData.event.eventStatus).optional(),

        startDateTime: string().min(1, "Start date/time is required"),
        endDateTime: string().optional(),

        locationType: zEnum(constantsData.event.locationType).default(constantsData.event.locationType.PHYSICAL),
        venue: string().min(2, "Venue is required"),
        meetingLink: string().optional(),

        organizer: string().optional(),
        contactInfo: string().optional(),

        isRegistrationRequired: boolean().default(false),
        registrationOpensAt: string().optional(),
        registrationDeadline: string().optional(),
        maxAttendees: coerce.number().int().min(1).optional().or(literal("")),

        isFree: boolean().default(true),
        priceTiers: z
            .array(priceTierSchema)
            .optional()
            .default([]),

        allowGuests: boolean().default(false),
        maxGuestsPerAlumni: coerce.number().int().min(0).max(10).default(1),
        guestFee: coerce.number().min(0).default(0),

        collectsTShirtSize: boolean().default(false),
        eventFlow: array(object({ value: string() })).optional().default([]),

        isPublished: boolean().default(false),
        isFeatured: boolean().default(false),
    })
    .refine(
        (d) => {
            if (d.locationType === "ONLINE" || d.locationType === "HYBRID") {
                return !!d.meetingLink;
            }
            return true;
        },
        { message: "Meeting link is required for online/hybrid events", path: ["meetingLink"] }
    )
    .refine(
        (d) => {
            if (d.isFree === false && (!d.priceTiers || d.priceTiers.length === 0)) {
                return false;
            }
            return true;
        },
        { message: "At least one price tier is required for paid events", path: ["priceTiers"] }
    )
    .refine(
        (data) => {
            if (data.endDateTime) {
                return new Date(data.endDateTime) > new Date(data.startDateTime);
            }
            return true;
        },
        {
            message: "End date must be after start date",
            path: ["endDateTime"],
        }
    );

export type EventFormValues = z.infer<typeof eventSchema>;

export const eventFieldOrder: (keyof EventFormValues)[] = [
    "title",
    "description",
    "category",
    "startDateTime",
    "venue",
    "meetingLink",
    "priceTiers",
];

/** Converts a datetime-local string ("2024-01-15T10:00") to a UTC ISO string */
export const toISOString = (val: string): string => new Date(val).toISOString();

/** Build FormData from validated form values + optional image file */
export const buildEventFormData = (data: EventFormValues, image?: File | null): FormData => {
    const fd = new FormData();

    const append = (key: string, val: unknown) => {
        if (val === undefined || val === null || val === "") return;
        if (Array.isArray(val)) {
            fd.append(key, JSON.stringify(val));
        } else {
            fd.append(key, String(val));
        }
    };

    append("title", data.title);
    append("description", data.description);
    append("category", data.category);
    if (data.status) append("status", data.status);

    append("startDateTime", toISOString(data.startDateTime));
    if (data.endDateTime) append("endDateTime", toISOString(data.endDateTime));

    append("locationType", data.locationType);
    append("venue", data.venue);
    if (data.meetingLink) append("meetingLink", data.meetingLink);
    if (data.organizer) append("organizer", data.organizer);
    if (data.contactInfo) append("contactInfo", data.contactInfo);

    append("isRegistrationRequired", data.isRegistrationRequired);
    if (data.registrationOpensAt) append("registrationOpensAt", toISOString(data.registrationOpensAt));
    if (data.registrationDeadline) append("registrationDeadline", toISOString(data.registrationDeadline));
    if (data.maxAttendees) append("maxAttendees", data.maxAttendees);

    append("isFree", data.isFree);
    if (!data.isFree && data.priceTiers && data.priceTiers.length > 0) {
        const tiers = data.priceTiers.map((t) => ({
            label: t.label,
            fee: Number(t.fee),
            ...(t.batchFrom ? { batchFrom: Number(t.batchFrom) } : {}),
            ...(t.batchTo ? { batchTo: Number(t.batchTo) } : {}),
        }));
        fd.append("priceTiers", JSON.stringify(tiers));
    }

    append("allowGuests", data.allowGuests);
    if (data.allowGuests) {
        append("maxGuestsPerAlumni", data.maxGuestsPerAlumni);
        append("guestFee", data.guestFee);
    }

    append("collectsTShirtSize", data.collectsTShirtSize);

    if (data.eventFlow && data.eventFlow.length > 0) {
        const steps = data.eventFlow.map((s) => s.value).filter(Boolean);
        if (steps.length > 0) fd.append("eventFlow", JSON.stringify(steps));
    }

    append("isPublished", data.isPublished);
    append("isFeatured", data.isFeatured);

    if (image) fd.append("coverImage", image);

    return fd;
};
