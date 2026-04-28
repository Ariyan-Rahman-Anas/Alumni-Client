"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
    RiBriefcaseLine,
    RiBookOpenLine,
    RiToolsLine,
    RiArrowRightLine,
    RiArrowLeftLine,
    RiCheckboxCircleLine,
    RiAddLine,
    RiCloseLine,
    RiMapPin2Line,
} from "react-icons/ri";
import { useCreateJobPostMutation, type JobPostType, type CreateJobPostPayload } from "@/redux/apis/jobApi";
import { useFormWithToast } from "@/hooks/useFormWithToast";
import InputField from "@/components/shared/InputField";
import TextAreaBox from "@/components/shared/TextAreaBox";
import SingleSelect from "@/components/shared/SingleSelect";
import DatePickerSingle from "@/components/shared/DatePickerSingle";
import PrimaryButton from "@/components/shared/PrimaryButton";
import {
    PostJobFormValues,
    POST_JOB_FIELD_ORDER,
    postJobSchema,
} from "./postJobSchema";

const TYPE_OPTIONS: { value: JobPostType; label: string; description: string; icon: React.ReactNode }[] = [
    { value: "OFFICIAL", label: "Official Job", description: "Post a job opening for your company or organization.", icon: <RiBriefcaseLine className="text-2xl" /> },
    { value: "TUITION", label: "Tuition Seek", description: "Find a tutor for your child or yourself.", icon: <RiBookOpenLine className="text-2xl" /> },
    { value: "PERSONAL", label: "Service Seek", description: "Hire an electrician, plumber, cook, or other professional.", icon: <RiToolsLine className="text-2xl" /> },
];

const SUBJECTS_LIST = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Bangla", "ICT", "Accounting", "Economics", "History"];
const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const JOB_TYPE_OPTIONS = [
    { label: "Full Time", value: "FULL_TIME" },
    { label: "Part Time", value: "PART_TIME" },
    { label: "Remote", value: "REMOTE" },
    { label: "Contract", value: "CONTRACT" },
    { label: "Intern", value: "INTERN" },
];
const EXPERIENCE_LEVEL_OPTIONS = [
    { label: "Entry", value: "ENTRY" },
    { label: "Mid", value: "MID" },
    { label: "Senior", value: "SENIOR" },
    { label: "Executive", value: "EXECUTIVE" },
];
const SERVICE_CATEGORY_OPTIONS = [
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
    { label: "Any", value: "" },
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
];
const PAYMENT_PER_OPTIONS = [
    { label: "Month", value: "MONTH" },
    { label: "Hour", value: "HOUR" },
    { label: "Session", value: "SESSION" },
];

function TagInput({ tags, onAdd, onRemove, placeholder, suggestions }: {
    tags: string[];
    onAdd: (v: string) => void;
    onRemove: (v: string) => void;
    placeholder?: string;
    suggestions?: string[];
}) {
    const [val, setVal] = useState("");
    const add = (v: string) => {
        const trimmed = v.trim();
        if (trimmed && !tags.includes(trimmed)) { onAdd(trimmed); setVal(""); }
    };
    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 bg-primary2-50 text-primary2-700 border border-primary2-200 text-sm px-3 py-1 rounded-full">
                        {t}
                        <button type="button" onClick={() => onRemove(t)} className="hover:text-red-500 ml-0.5"><RiCloseLine /></button>
                    </span>
                ))}
            </div>
            <div className="flex gap-2">
                <input
                    value={val}
                    onChange={(e) => setVal(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(val); } }}
                    placeholder={placeholder ?? "Type and press Enter"}
                    className="flex-1 px-3 py-2 text-sm rounded-xl border border-surface-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary2-300 focus:border-primary2-300"
                />
                <button type="button" onClick={() => add(val)} className="px-3 py-2 bg-primary2-50 text-primary2-700 border border-primary2-200 rounded-xl hover:bg-primary2-100 transition-colors">
                    <RiAddLine />
                </button>
            </div>
            {suggestions && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                    {suggestions.filter((s) => !tags.includes(s)).map((s) => (
                        <button key={s} type="button" onClick={() => onAdd(s)} className="text-xs text-muted-foreground bg-surface-100 hover:bg-primary2-50 hover:text-primary2-700 px-2.5 py-1 rounded-full transition-colors capitalize">
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function PostJobPage() {
    const router = useRouter();
    const [step, setStep] = useState(0);
    const [selectedType, setSelectedType] = useState<JobPostType | null>(null);
    const [createJob, { isLoading }] = useCreateJobPostMutation();

    // Array / checkbox state (not managed by react-hook-form)
    const [requirements, setRequirements] = useState<string[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [weeklyDays, setWeeklyDays] = useState<string[]>([]);
    const [salaryNegotiable, setSalaryNegotiable] = useState(false);
    const [isRemote, setIsRemote] = useState(false);
    const [paymentNegotiable, setPaymentNegotiable] = useState(false);

    const methods = useFormWithToast<PostJobFormValues>(
        {
            resolver: zodResolver(postJobSchema),
            defaultValues: {
                title: "",
                description: "",
                company: "",
                jobTitle: "",
                jobType: "",
                salaryMin: "",
                salaryMax: "",
                experienceLevel: "",
                applicationDeadline: "",
                applicationInstruction: "",
                location: "",
                studentClass: "",
                studentGender: "",
                requiredTutorGender: "",
                timing: "",
                sessionDuration: "",
                seekLocation: "",
                paymentAmount: "",
                paymentPer: "",
                serviceCategory: "",
                startDate: "",
            },
        },
        { fieldOrder: POST_JOB_FIELD_ORDER }
    );

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = methods;

    const onSubmit = async (data: PostJobFormValues) => {
        if (!selectedType) return;

        if (selectedType === "TUITION" && !data.studentClass?.trim()) {
            toast.error("Student class is required for tuition posts.");
            return;
        }
        if (selectedType === "PERSONAL" && !data.serviceCategory) {
            toast.error("Service category is required.");
            return;
        }

        const base: Record<string, unknown> = {
            type: selectedType,
            title: data.title,
            description: data.description,
        };

        if (selectedType === "OFFICIAL") {
            Object.assign(base, {
                company: data.company || undefined,
                jobTitle: data.jobTitle || undefined,
                jobType: data.jobType || undefined,
                salaryMin: data.salaryMin ? Number(data.salaryMin) : undefined,
                salaryMax: data.salaryMax ? Number(data.salaryMax) : undefined,
                salaryNegotiable,
                requirements: requirements.length ? requirements : undefined,
                experienceLevel: data.experienceLevel || undefined,
                applicationDeadline: data.applicationDeadline || undefined,
                applicationInstruction: data.applicationInstruction || undefined,
                location: data.location || undefined,
                isRemote,
            });
        } else if (selectedType === "TUITION") {
            Object.assign(base, {
                studentClass: data.studentClass || undefined,
                employerGender: data.studentGender || undefined,
                employeeGender: data.requiredTutorGender || undefined,
                subjects: subjects.length ? subjects : undefined,
                timing: data.timing || undefined,
                sessionDuration: data.sessionDuration || undefined,
                weeklyDays: weeklyDays.length ? weeklyDays : undefined,
                seekLocation: data.seekLocation || undefined,
                paymentAmount: data.paymentAmount ? Number(data.paymentAmount) : undefined,
                paymentPer: data.paymentPer || undefined,
                paymentNegotiable,
                startDate: data.startDate || undefined,
            });
        } else {
            Object.assign(base, {
                serviceCategory: data.serviceCategory || undefined,
                seekLocation: data.seekLocation || undefined,
                paymentAmount: data.paymentAmount ? Number(data.paymentAmount) : undefined,
                paymentPer: data.paymentPer || undefined,
                paymentNegotiable,
                startDate: data.startDate || undefined,
            });
        }

        try {
            await createJob(base as CreateJobPostPayload).unwrap();
            router.push("/jobs?posted=1");
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
                <h1 className="text-3xl font-extrabold text-primary2-900">Post a Job</h1>
                <p className="text-muted-foreground mt-1">Share an opportunity with the BAMHS alumni community.</p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-3 mb-8">
                {["Select Type", "Fill Details"].map((label, i) => (
                    <div key={label} className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step >= i ? "bg-primary2-700 text-white" : "bg-surface-200 text-muted-foreground"}`}>
                            {step > i ? <RiCheckboxCircleLine /> : i + 1}
                        </div>
                        <span className={`text-sm ${step >= i ? "text-primary2-900 font-medium" : "text-muted-foreground"}`}>{label}</span>
                        {i < 1 && <div className="w-8 h-px bg-surface-300" />}
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {step === 0 ? (
                    <motion.div key="step0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                        <div className="space-y-4">
                            {TYPE_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => { setSelectedType(opt.value); setStep(1); }}
                                    className={`w-full flex items-center gap-5 p-6 rounded-2xl border-2 transition-all text-left ${selectedType === opt.value ? "border-primary2-600 bg-primary2-50" : "border-surface-200 bg-white hover:border-primary2-300"}`}
                                >
                                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedType === opt.value ? "bg-primary2-100 text-primary2-700" : "bg-surface-100 text-muted-foreground"}`}>
                                        {opt.icon}
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary2-900">{opt.label}</p>
                                        <p className="text-sm text-muted-foreground mt-0.5">{opt.description}</p>
                                    </div>
                                    <RiArrowRightLine className="ml-auto text-muted-foreground flex-shrink-0" />
                                </button>
                            ))}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <FormProvider {...methods}>
                            <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-white rounded-2xl border border-surface-200 p-6 space-y-6">
                                {/* Common */}
                                <InputField
                                    {...register("title")}
                                    id="job-title"
                                    label="Title"
                                    placeholder="e.g. Full Stack Developer at TechCorp"
                                    error={errors.title?.message}
                                    required
                                />
                                <TextAreaBox
                                    {...register("description")}
                                    id="job-description"
                                    label="Description"
                                    placeholder="Describe the position, requirements, or what you're looking for..."
                                    rows={4}
                                    error={errors.description?.message}
                                    required
                                />

                                {/* Official */}
                                {selectedType === "OFFICIAL" && (
                                    <>
                                        <InputField {...register("company")} id="job-company" label="Company Name" placeholder="Your Company Ltd." />
                                        <InputField {...register("jobTitle")} id="job-job-title" label="Job Title" placeholder="e.g. Senior Software Engineer" />
                                        <div className="grid grid-cols-2 gap-4">
                                            <Controller
                                                name="jobType"
                                                control={control}
                                                render={({ field }) => (
                                                    <SingleSelect id="job-type" label="Job Type" value={field.value ?? ""} onValueChange={field.onChange} options={JOB_TYPE_OPTIONS} placeholder="Select type" searchable={false} />
                                                )}
                                            />
                                            <Controller
                                                name="experienceLevel"
                                                control={control}
                                                render={({ field }) => (
                                                    <SingleSelect id="job-exp-level" label="Experience Level" value={field.value ?? ""} onValueChange={field.onChange} options={EXPERIENCE_LEVEL_OPTIONS} placeholder="Select level" searchable={false} />
                                                )}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField {...register("salaryMin")} id="job-salary-min" label="Min Salary (BDT)" type="number" placeholder="e.g. 30000" />
                                            <InputField {...register("salaryMax")} id="job-salary-max" label="Max Salary (BDT)" type="number" placeholder="e.g. 60000" />
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={salaryNegotiable} onChange={(e) => setSalaryNegotiable(e.target.checked)} className="rounded" /> Salary Negotiable</label>
                                            <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={isRemote} onChange={(e) => setIsRemote(e.target.checked)} className="rounded" /> Remote Friendly</label>
                                        </div>
                                        <InputField {...register("location")} id="job-location" label="Location" placeholder="e.g. Dhaka, Bangladesh" icon={<RiMapPin2Line />} />
                                        <Controller
                                            name="applicationDeadline"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePickerSingle id="job-deadline" label="Application Deadline" value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                        <TextAreaBox
                                            {...register("applicationInstruction")}
                                            id="job-app-instruction"
                                            label="Application Instructions"
                                            placeholder="Apply via our portal at careers.company.com or email your CV to hr@company.com"
                                            rows={3}
                                            helperText="How should candidates apply? (link, email, or description)"
                                        />
                                        <div>
                                            <label className="block text-xs mb-1.5">Requirements</label>
                                            <TagInput tags={requirements} onAdd={(v) => setRequirements([...requirements, v])} onRemove={(v) => setRequirements(requirements.filter((r) => r !== v))} placeholder="Add requirement and press Enter" />
                                        </div>
                                    </>
                                )}

                                {/* Tuition */}
                                {selectedType === "TUITION" && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField {...register("studentClass")} id="job-student-class" label="Student Class" placeholder="e.g. Class 10 / SSC" error={errors.studentClass?.message} required />
                                            <Controller
                                                name="studentGender"
                                                control={control}
                                                render={({ field }) => (
                                                    <SingleSelect id="job-student-gender" label="Student Gender" value={field.value ?? ""} onValueChange={field.onChange} options={GENDER_OPTIONS} searchable={false} />
                                                )}
                                            />
                                        </div>
                                        <Controller
                                            name="requiredTutorGender"
                                            control={control}
                                            render={({ field }) => (
                                                <SingleSelect id="job-tutor-gender" label="Required Tutor Gender" value={field.value ?? ""} onValueChange={field.onChange} options={GENDER_OPTIONS} searchable={false} />
                                            )}
                                        />
                                        <div>
                                            <label className="block text-xs mb-1.5">Subjects <span className="ml-1 text-danger">*</span></label>
                                            <TagInput tags={subjects} onAdd={(v) => setSubjects([...subjects, v])} onRemove={(v) => setSubjects(subjects.filter((s) => s !== v))} placeholder="Add subject" suggestions={SUBJECTS_LIST} />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField {...register("timing")} id="job-timing" label="Preferred Timing" placeholder="e.g. 5 PM – 7 PM" />
                                            <InputField {...register("sessionDuration")} id="job-session-dur" label="Session Duration" placeholder="e.g. 2 hours" />
                                        </div>
                                        <div>
                                            <label className="block text-xs mb-1.5">Preferred Days</label>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {DAYS.map((d) => (
                                                    <button key={d} type="button" onClick={() => setWeeklyDays(weeklyDays.includes(d) ? weeklyDays.filter((x) => x !== d) : [...weeklyDays, d])}
                                                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${weeklyDays.includes(d) ? "border-primary2-600 bg-primary2-50 text-primary2-700" : "border-surface-200 text-muted-foreground hover:border-primary2-300"}`}
                                                    >{d}</button>
                                                ))}
                                            </div>
                                        </div>
                                        <InputField {...register("seekLocation")} id="job-seek-location" label="Location" placeholder="Area / District" icon={<RiMapPin2Line />} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField {...register("paymentAmount")} id="job-payment-amount" label="Payment Amount (BDT)" type="number" placeholder="e.g. 5000" />
                                            <Controller
                                                name="paymentPer"
                                                control={control}
                                                render={({ field }) => (
                                                    <SingleSelect id="job-payment-per" label="Per" value={field.value ?? ""} onValueChange={field.onChange} options={PAYMENT_PER_OPTIONS} placeholder="Select" searchable={false} />
                                                )}
                                            />
                                        </div>
                                        <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={paymentNegotiable} onChange={(e) => setPaymentNegotiable(e.target.checked)} className="rounded" /> Negotiable</label>
                                        <Controller
                                            name="startDate"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePickerSingle id="job-start-date" label="Start Date" value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                    </>
                                )}

                                {/* Personal */}
                                {selectedType === "PERSONAL" && (
                                    <>
                                        <Controller
                                            name="serviceCategory"
                                            control={control}
                                            render={({ field }) => (
                                                <SingleSelect id="job-service-cat" label="Service Category" value={field.value ?? ""} onValueChange={field.onChange} options={SERVICE_CATEGORY_OPTIONS} placeholder="Select category" searchable={false} error={errors.serviceCategory?.message} required />
                                            )}
                                        />
                                        <InputField {...register("seekLocation")} id="job-personal-location" label="Location" placeholder="Area / District" icon={<RiMapPin2Line />} />
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField {...register("paymentAmount")} id="job-personal-payment" label="Payment Amount (BDT)" type="number" placeholder="e.g. 2000" />
                                            <Controller
                                                name="paymentPer"
                                                control={control}
                                                render={({ field }) => (
                                                    <SingleSelect id="job-personal-per" label="Per" value={field.value ?? ""} onValueChange={field.onChange} options={PAYMENT_PER_OPTIONS} placeholder="Select" searchable={false} />
                                                )}
                                            />
                                        </div>
                                        <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={paymentNegotiable} onChange={(e) => setPaymentNegotiable(e.target.checked)} className="rounded" /> Negotiable</label>
                                        <Controller
                                            name="startDate"
                                            control={control}
                                            render={({ field }) => (
                                                <DatePickerSingle id="job-personal-start" label="Start Date" value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                    </>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setStep(0)} className="px-5 py-2.5 border border-surface-200 rounded-xl text-sm hover:border-surface-300 text-neutral-700 transition-colors">
                                        Back
                                    </button>
                                    <PrimaryButton
                                        type="submit"
                                        title="Submit for Review"
                                        icon={<RiCheckboxCircleLine />}
                                        isLoading={isLoading}
                                        loadingTitle="Submitting..."
                                        className="flex-1 py-2.5"
                                    />
                                </div>
                            </form>
                        </FormProvider>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
