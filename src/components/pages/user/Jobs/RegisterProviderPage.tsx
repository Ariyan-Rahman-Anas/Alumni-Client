"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
    RiArrowLeftLine,
    RiCheckboxCircleLine,
    RiUploadLine,
    RiCloseLine,
    RiAddLine,
    RiMapPin2Line,
    RiBriefcase4Line,
} from "react-icons/ri";
import { useRegisterProviderMutation} from "@/redux/apis/jobApi";
import { useFormWithToast } from "@/hooks/useFormWithToast";
import InputField from "@/components/shared/InputField";
import TextAreaBox from "@/components/shared/TextAreaBox";
import SingleSelect from "@/components/shared/SingleSelect";
import PrimaryButton from "@/components/shared/PrimaryButton";
import {
    RegisterProviderFormValues,
    REGISTER_PROVIDER_FIELD_ORDER,
    registerProviderSchema,
} from "./registerProviderSchema";
import { TCreateProviderPayload } from "@/components/modules/user/job/job.types";

const PROVIDER_TYPE_OPTIONS = [
    { label: "Tutor", value: "TUTOR" },
    { label: "Electrician", value: "ELECTRICIAN" },
    { label: "Plumber", value: "PLUMBER" },
    { label: "Cook", value: "COOK" },
    { label: "Driver", value: "DRIVER" },
    { label: "Cleaner", value: "CLEANER" },
    { label: "Carpenter", value: "CARPENTER" },
    { label: "Painter", value: "PAINTER" },
    { label: "Gardener", value: "GARDENER" },
    { label: "Security", value: "SECURITY" },
];

const GENDER_OPTIONS = [
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
];

const STUDENT_GENDER_OPTIONS = [
    { label: "Any", value: "" },
    { label: "Male students only", value: "MALE" },
    { label: "Female students only", value: "FEMALE" },
    { label: "Both", value: "ANY" },
];

const SUBJECTS_LIST = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Bangla", "ICT", "Accounting", "Economics", "History"];
const CLASS_RANGE = ["Class 1–5", "Class 6–8", "Class 9–10", "SSC", "HSC", "University"];
const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-sm text-primary2-900 focus:outline-none focus:ring-2 focus:ring-primary2-300 focus:border-primary2-300 placeholder:text-muted-foreground";

function TagInput({ tags, onAdd, onRemove, placeholder, suggestions }: { tags: string[]; onAdd: (v: string) => void; onRemove: (v: string) => void; placeholder?: string; suggestions?: string[] }) {
    const [val, setVal] = useState("");
    const add = (v: string) => { const t = v.trim(); if (t && !tags.includes(t)) { onAdd(t); setVal(""); } };
    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 bg-primary2-50 text-primary2-700 border border-primary2-200 text-sm px-3 py-1 rounded-full">
                        {t}<button type="button" onClick={() => onRemove(t)} className="hover:text-red-500 ml-0.5"><RiCloseLine /></button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <input value={val} onChange={(e) => setVal(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(val); } }} placeholder={placeholder} className={inputCls} />
                <button type="button" onClick={() => add(val)} className="px-3 py-2 bg-primary2-50 text-primary2-700 border border-primary2-200 rounded-xl hover:bg-primary2-100 transition-colors"><RiAddLine /></button>
            </div>
            {suggestions && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {suggestions.filter((s) => !tags.includes(s)).map((s) => (
                        <button key={s} type="button" onClick={() => onAdd(s)} className="text-xs text-muted-foreground bg-surface-100 hover:bg-primary2-50 hover:text-primary2-700 px-2.5 py-1 rounded-full transition-colors">{s}</button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function RegisterProviderPage() {
    const router = useRouter();
    const [registerProvider, { isLoading }] = useRegisterProviderMutation();

    // State for array/file fields not managed by react-hook-form
    const [availability, setAvailability] = useState<string[]>([]);
    const [qualifications, setQualifications] = useState<string[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [classRange, setClassRange] = useState<string[]>([]);
    const [certFiles, setCertFiles] = useState<File[]>([]);

    const methods = useFormWithToast<RegisterProviderFormValues>(
        {
            resolver: zodResolver(registerProviderSchema),
            defaultValues: {
                providerType: "",
                bio: "",
                experience: "",
                gender: "MALE",
                location: "",
                hourlyRate: "",
                monthlyRate: "",
                availableGenderStudents: "",
            },
        },
        { fieldOrder: REGISTER_PROVIDER_FIELD_ORDER }
    );

    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = methods;

    const providerType = watch("providerType");
    const isTutor = providerType === "TUTOR";

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        setCertFiles((prev) => [...prev, ...files].slice(0, 5));
    };

    const onSubmit = async (data: RegisterProviderFormValues) => {
        if (isTutor && certFiles.length === 0) {
            toast.error("Tutors must upload at least one certificate.");
            return;
        }

        const payload: TCreateProviderPayload = {
            providerType: data.providerType as TCreateProviderPayload["providerType"],
            bio: data.bio,
            experience: data.experience,
            gender: data.gender,
            location: data.location,
            hourlyRate: data.hourlyRate ? Number(data.hourlyRate) : undefined,
            monthlyRate: data.monthlyRate ? Number(data.monthlyRate) : undefined,
            availability: availability.length ? availability : undefined,
            qualifications: qualifications.length ? qualifications : undefined,
            subjects: isTutor && subjects.length ? subjects : undefined,
            classRange: isTutor && classRange.length ? classRange : undefined,
            availableGenderStudents: data.availableGenderStudents || undefined,
        } as TCreateProviderPayload;

        try {
            await registerProvider({ payload, certificates: certFiles.length ? certFiles : undefined }).unwrap();
            toast.success("Provider profile submitted for review!");
            router.push("/jobs?registered=1");
        } catch (err: unknown) {
            const message =
                (err as { data?: { message?: string } })?.data?.message ?? "Submission failed. Please try again.";
            toast.error(message);
        }
    };

    return (
        <div className="three-xl-section-setup pb-24 pt-10 max-w-2xl">
            <div className="mb-8">
                <button type="button" onClick={() => router.push("/jobs")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary2-700 mb-4 transition-colors">
                    <RiArrowLeftLine /> Back to Jobs
                </button>
                <h1 className="text-3xl font-extrabold text-primary2-900">Register as Provider</h1>
                <p className="text-muted-foreground mt-1">Create your provider profile. Admin will review and approve it.</p>
            </div>

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-white rounded-2xl border border-surface-200 p-6 space-y-6">

                    <Controller
                        name="providerType"
                        control={control}
                        render={({ field }) => (
                            <SingleSelect
                                id="provider-type"
                                label="Provider Type"
                                value={field.value}
                                onValueChange={field.onChange}
                                options={PROVIDER_TYPE_OPTIONS}
                                placeholder="Select your role"
                                searchable={false}
                                error={errors.providerType?.message}
                                required
                            />
                        )}
                    />

                    <TextAreaBox
                        {...register("bio")}
                        id="provider-bio"
                        label="Bio"
                        placeholder="Tell alumni about yourself, your background, and what makes you the right choice..."
                        rows={4}
                        error={errors.bio?.message}
                        helperText="Describe your expertise, experience, and teaching/service style."
                        required
                    />

                    <InputField
                        {...register("experience")}
                        id="provider-experience"
                        label="Years of Experience"
                        placeholder="e.g. 5 years as math tutor / 3 years as electrician"
                        icon={<RiBriefcase4Line />}
                        error={errors.experience?.message}
                        required
                    />

                    <Controller
                        name="gender"
                        control={control}
                        render={({ field }) => (
                            <SingleSelect
                                id="provider-gender"
                                label="Your Gender"
                                value={field.value}
                                onValueChange={field.onChange}
                                options={GENDER_OPTIONS}
                                searchable={false}
                                error={errors.gender?.message}
                                required
                            />
                        )}
                    />

                    <InputField
                        {...register("location")}
                        id="provider-location"
                        label="Location"
                        placeholder="e.g. Mirpur, Dhaka"
                        icon={<RiMapPin2Line />}
                        error={errors.location?.message}
                        helperText="Where are you available to work?"
                        required
                    />

                    {/* Tutor-specific */}
                    {isTutor && (
                        <>
                            <div>
                                <label className="block text-xs mb-1.5">Subjects You Teach</label>
                                <TagInput tags={subjects} onAdd={(v) => setSubjects([...subjects, v])} onRemove={(v) => setSubjects(subjects.filter((s) => s !== v))} placeholder="Add subject" suggestions={SUBJECTS_LIST} />
                            </div>

                            <div>
                                <label className="block text-xs mb-1.5">Class Range</label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {CLASS_RANGE.map((c) => (
                                        <button key={c} type="button" onClick={() => setClassRange(classRange.includes(c) ? classRange.filter((x) => x !== c) : [...classRange, c])}
                                            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${classRange.includes(c) ? "border-primary2-600 bg-primary2-50 text-primary2-700" : "border-surface-200 text-muted-foreground hover:border-primary2-300"}`}
                                        >{c}</button>
                                    ))}
                                </div>
                            </div>

                            <Controller
                                name="availableGenderStudents"
                                control={control}
                                render={({ field }) => (
                                    <SingleSelect
                                        id="provider-student-gender"
                                        label="Prefer to teach (gender)"
                                        value={field.value ?? ""}
                                        onValueChange={field.onChange}
                                        options={STUDENT_GENDER_OPTIONS}
                                        searchable={false}
                                    />
                                )}
                            />
                        </>
                    )}

                    {/* Qualifications */}
                    <div>
                        <label className="block text-xs mb-1.5">Qualifications / Certifications</label>
                        <TagInput tags={qualifications} onAdd={(v) => setQualifications([...qualifications, v])} onRemove={(v) => setQualifications(qualifications.filter((q) => q !== v))} placeholder="e.g. BSc in EEE, BUET" />
                    </div>

                    {/* Rates */}
                    <div className="grid grid-cols-2 gap-4">
                        <InputField
                            {...register("hourlyRate")}
                            id="provider-hourly-rate"
                            label="Hourly Rate (BDT)"
                            type="number"
                            placeholder="e.g. 200"
                            error={errors.hourlyRate?.message}
                        />
                        <InputField
                            {...register("monthlyRate")}
                            id="provider-monthly-rate"
                            label="Monthly Rate (BDT)"
                            type="number"
                            placeholder="e.g. 5000"
                            error={errors.monthlyRate?.message}
                        />
                    </div>

                    {/* Availability */}
                    <div>
                        <label className="block text-xs mb-1.5">Available Days</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {DAYS.map((d) => (
                                <button key={d} type="button" onClick={() => setAvailability(availability.includes(d) ? availability.filter((x) => x !== d) : [...availability, d])}
                                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${availability.includes(d) ? "border-primary2-600 bg-primary2-50 text-primary2-700" : "border-surface-200 text-muted-foreground hover:border-primary2-300"}`}
                                >{d}</button>
                            ))}
                        </div>
                    </div>

                    {/* Certificate upload */}
                    <div>
                        <label className="block text-xs mb-1.5">
                            Certificates / Documents {isTutor && <span className="ml-1 text-danger">*</span>}
                        </label>
                        <label className={`flex flex-col items-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${isTutor && certFiles.length === 0 ? "border-red-300 hover:border-red-400" : "border-surface-300 hover:border-primary2-400"}`}>
                            <RiUploadLine className="text-2xl text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">Click to upload files</span>
                            <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
                        </label>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {isTutor ? "Required for tutors — upload up to 5 documents (PDF, images)." : "Upload up to 5 documents (PDF, images)."}
                        </p>
                        {certFiles.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {certFiles.map((f, i) => (
                                    <div key={i} className="flex items-center justify-between gap-2 bg-surface-50 rounded-xl px-4 py-2 text-sm">
                                        <span className="text-neutral-700 truncate">{f.name}</span>
                                        <button type="button" onClick={() => setCertFiles(certFiles.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 flex-shrink-0"><RiCloseLine /></button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <PrimaryButton
                        type="submit"
                        title="Submit for Review"
                        icon={<RiCheckboxCircleLine />}
                        isFullWidth
                        isLoading={isLoading}
                        loadingTitle="Submitting..."
                        className="py-3"
                    />
                </form>
            </FormProvider>
        </div>
    );
}

