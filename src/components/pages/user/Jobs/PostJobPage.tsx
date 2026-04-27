"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
} from "react-icons/ri";
import { useCreateJobPostMutation, type JobPostType, type CreateJobPostPayload } from "@/redux/apis/jobApi";

const TYPE_OPTIONS: { value: JobPostType; label: string; description: string; icon: React.ReactNode }[] = [
    { value: "official", label: "Official Job", description: "Post a job opening for your company or organization.", icon: <RiBriefcaseLine className="text-2xl" /> },
    { value: "tuition_seek", label: "Tuition Seek", description: "Find a tutor for your child or yourself.", icon: <RiBookOpenLine className="text-2xl" /> },
    { value: "personal_seek", label: "Service Seek", description: "Hire an electrician, plumber, cook, or other professional.", icon: <RiToolsLine className="text-2xl" /> },
];

const SUBJECTS_LIST = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Bangla", "ICT", "Accounting", "Economics", "History"];
const SERVICE_CATEGORIES = ["electrician", "plumber", "cook", "driver", "cleaner", "carpenter", "painter", "gardener", "security", "other"];
const JOB_TYPES = ["full-time", "part-time", "remote", "contract", "internship"];
const EXPERIENCE_LEVELS = ["entry", "mid", "senior", "executive"];
const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

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
                        <button onClick={() => onRemove(t)} className="hover:text-red-500 ml-0.5"><RiCloseLine /></button>
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

function FormField({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
    return (
        <div>
            <label className="block text-sm font-medium text-primary2-900 mb-1.5">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-sm text-primary2-900 focus:outline-none focus:ring-2 focus:ring-primary2-300 focus:border-primary2-300 placeholder:text-muted-foreground";
const selectCls = `${inputCls}`;

export default function PostJobPage() {
    const router = useRouter();
    const [step, setStep] = useState(0); // 0=type select, 1=details
    const [selectedType, setSelectedType] = useState<JobPostType | null>(null);
    const [createJob, { isLoading }] = useCreateJobPostMutation();

    // Common
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    // Official
    const [company, setCompany] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [jobType, setJobType] = useState("");
    const [salaryMin, setSalaryMin] = useState("");
    const [salaryMax, setSalaryMax] = useState("");
    const [salaryNegotiable, setSalaryNegotiable] = useState(false);
    const [requirements, setRequirements] = useState<string[]>([]);
    const [experienceLevel, setExperienceLevel] = useState("");
    const [applicationDeadline, setApplicationDeadline] = useState("");
    const [applicationInstruction, setApplicationInstruction] = useState("");
    const [location, setLocation] = useState("");
    const [isRemote, setIsRemote] = useState(false);

    // Tuition
    const [studentClass, setStudentClass] = useState("");
    const [studentGender, setStudentGender] = useState("");
    const [requiredTutorGender, setRequiredTutorGender] = useState("");
    const [subjects, setSubjects] = useState<string[]>([]);
    const [timing, setTiming] = useState("");
    const [sessionDuration, setSessionDuration] = useState("");
    const [weeklyDays, setWeeklyDays] = useState<string[]>([]);
    const [seekLocation, setSeekLocation] = useState("");
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentPer, setPaymentPer] = useState("");
    const [paymentNegotiable, setPaymentNegotiable] = useState(false);
    const [startDate, setStartDate] = useState("");

    // Personal
    const [serviceCategory, setServiceCategory] = useState("");

    const handleSubmit = async () => {
        if (!selectedType || !title.trim() || !description.trim()) return;

        const base: Record<string, unknown> = { type: selectedType, title: title.trim(), description: description.trim() };

        if (selectedType === "official") {
            Object.assign(base, {
                company: company || undefined,
                jobTitle: jobTitle || undefined,
                jobType: jobType || undefined,
                salaryMin: salaryMin ? Number(salaryMin) : undefined,
                salaryMax: salaryMax ? Number(salaryMax) : undefined,
                salaryNegotiable,
                requirements: requirements.length ? requirements : undefined,
                experienceLevel: experienceLevel || undefined,
                applicationDeadline: applicationDeadline || undefined,
                applicationInstruction: applicationInstruction || undefined,
                location: location || undefined,
                isRemote,
            });
        } else if (selectedType === "tuition_seek") {
            Object.assign(base, {
                studentClass: studentClass || undefined,
                studentGender: studentGender || undefined,
                requiredTutorGender: requiredTutorGender || undefined,
                subjects: subjects.length ? subjects : undefined,
                timing: timing || undefined,
                sessionDuration: sessionDuration || undefined,
                weeklyDays: weeklyDays.length ? weeklyDays : undefined,
                seekLocation: seekLocation || undefined,
                paymentAmount: paymentAmount ? Number(paymentAmount) : undefined,
                paymentPer: paymentPer || undefined,
                paymentNegotiable,
                startDate: startDate || undefined,
            });
        } else {
            Object.assign(base, {
                serviceCategory: serviceCategory || undefined,
                seekLocation: seekLocation || undefined,
                paymentAmount: paymentAmount ? Number(paymentAmount) : undefined,
                paymentPer: paymentPer || undefined,
                paymentNegotiable,
                startDate: startDate || undefined,
            });
        }

        try {
            await createJob(base as CreateJobPostPayload).unwrap();
            router.push("/jobs?posted=1");
        } catch {
            // Error handled by RTK
        }
    };

    return (
        <div className="three-xl-section-setup pb-24 pt-10 max-w-2xl">
            <div className="mb-8">
                <button onClick={() => router.push("/jobs")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary2-700 mb-4 transition-colors">
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
                        <div className="bg-white rounded-2xl border border-surface-200 p-6 space-y-6">
                            {/* Common */}
                            <FormField label="Title" required>
                                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Full Stack Developer at TechCorp" className={inputCls} />
                            </FormField>
                            <FormField label="Description" required>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the position, requirements, or what you're looking for..." rows={4} className={`${inputCls} resize-none`} />
                            </FormField>

                            {/* Official */}
                            {selectedType === "official" && (
                                <>
                                    <FormField label="Company Name"><input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Your Company Ltd." className={inputCls} /></FormField>
                                    <FormField label="Job Title"><input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} placeholder="e.g. Senior Software Engineer" className={inputCls} /></FormField>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Job Type">
                                            <select value={jobType} onChange={(e) => setJobType(e.target.value)} className={selectCls}>
                                                <option value="">Select type</option>
                                                {JOB_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                                            </select>
                                        </FormField>
                                        <FormField label="Experience Level">
                                            <select value={experienceLevel} onChange={(e) => setExperienceLevel(e.target.value)} className={selectCls}>
                                                <option value="">Select level</option>
                                                {EXPERIENCE_LEVELS.map((l) => <option key={l} value={l} className="capitalize">{l}</option>)}
                                            </select>
                                        </FormField>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Min Salary (BDT)"><input value={salaryMin} onChange={(e) => setSalaryMin(e.target.value)} type="number" placeholder="e.g. 30000" className={inputCls} /></FormField>
                                        <FormField label="Max Salary (BDT)"><input value={salaryMax} onChange={(e) => setSalaryMax(e.target.value)} type="number" placeholder="e.g. 60000" className={inputCls} /></FormField>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={salaryNegotiable} onChange={(e) => setSalaryNegotiable(e.target.checked)} className="rounded" /> Salary Negotiable</label>
                                        <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={isRemote} onChange={(e) => setIsRemote(e.target.checked)} className="rounded" /> Remote Friendly</label>
                                    </div>
                                    <FormField label="Location"><input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Dhaka, Bangladesh" className={inputCls} /></FormField>
                                    <FormField label="Application Deadline"><input value={applicationDeadline} onChange={(e) => setApplicationDeadline(e.target.value)} type="date" className={inputCls} /></FormField>
                                    <FormField label="Application Instructions" hint="How should candidates apply? (link, email, or description)">
                                        <textarea value={applicationInstruction} onChange={(e) => setApplicationInstruction(e.target.value)} placeholder="Apply via our portal at careers.company.com or email your CV to hr@company.com" rows={3} className={`${inputCls} resize-none`} />
                                    </FormField>
                                    <FormField label="Requirements">
                                        <TagInput tags={requirements} onAdd={(v) => setRequirements([...requirements, v])} onRemove={(v) => setRequirements(requirements.filter((r) => r !== v))} placeholder="Add requirement and press Enter" />
                                    </FormField>
                                </>
                            )}

                            {/* Tuition */}
                            {selectedType === "tuition_seek" && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Student Class" required><input value={studentClass} onChange={(e) => setStudentClass(e.target.value)} placeholder="e.g. Class 10 / SSC" className={inputCls} /></FormField>
                                        <FormField label="Student Gender">
                                            <select value={studentGender} onChange={(e) => setStudentGender(e.target.value)} className={selectCls}>
                                                <option value="">Any</option>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                            </select>
                                        </FormField>
                                    </div>
                                    <FormField label="Required Tutor Gender">
                                        <select value={requiredTutorGender} onChange={(e) => setRequiredTutorGender(e.target.value)} className={selectCls}>
                                            <option value="">Any</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                        </select>
                                    </FormField>
                                    <FormField label="Subjects" required>
                                        <TagInput tags={subjects} onAdd={(v) => setSubjects([...subjects, v])} onRemove={(v) => setSubjects(subjects.filter((s) => s !== v))} placeholder="Add subject" suggestions={SUBJECTS_LIST} />
                                    </FormField>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Preferred Timing"><input value={timing} onChange={(e) => setTiming(e.target.value)} placeholder="e.g. 5 PM – 7 PM" className={inputCls} /></FormField>
                                        <FormField label="Session Duration"><input value={sessionDuration} onChange={(e) => setSessionDuration(e.target.value)} placeholder="e.g. 2 hours" className={inputCls} /></FormField>
                                    </div>
                                    <FormField label="Preferred Days">
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {DAYS.map((d) => (
                                                <button key={d} type="button" onClick={() => setWeeklyDays(weeklyDays.includes(d) ? weeklyDays.filter((x) => x !== d) : [...weeklyDays, d])}
                                                    className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${weeklyDays.includes(d) ? "border-primary2-600 bg-primary2-50 text-primary2-700" : "border-surface-200 text-muted-foreground hover:border-primary2-300"}`}
                                                >{d}</button>
                                            ))}
                                        </div>
                                    </FormField>
                                    <FormField label="Location"><input value={seekLocation} onChange={(e) => setSeekLocation(e.target.value)} placeholder="Area / District" className={inputCls} /></FormField>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Payment Amount (BDT)"><input value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} type="number" placeholder="e.g. 5000" className={inputCls} /></FormField>
                                        <FormField label="Per">
                                            <select value={paymentPer} onChange={(e) => setPaymentPer(e.target.value)} className={selectCls}>
                                                <option value="">Select</option>
                                                <option value="month">Month</option>
                                                <option value="hour">Hour</option>
                                                <option value="session">Session</option>
                                            </select>
                                        </FormField>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={paymentNegotiable} onChange={(e) => setPaymentNegotiable(e.target.checked)} className="rounded" /> Negotiable</label>
                                    </div>
                                    <FormField label="Start Date"><input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" className={inputCls} /></FormField>
                                </>
                            )}

                            {/* Personal */}
                            {selectedType === "personal_seek" && (
                                <>
                                    <FormField label="Service Category" required>
                                        <select value={serviceCategory} onChange={(e) => setServiceCategory(e.target.value)} className={selectCls}>
                                            <option value="">Select category</option>
                                            {SERVICE_CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
                                        </select>
                                    </FormField>
                                    <FormField label="Location"><input value={seekLocation} onChange={(e) => setSeekLocation(e.target.value)} placeholder="Area / District" className={inputCls} /></FormField>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Payment Amount (BDT)"><input value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} type="number" placeholder="e.g. 2000" className={inputCls} /></FormField>
                                        <FormField label="Per">
                                            <select value={paymentPer} onChange={(e) => setPaymentPer(e.target.value)} className={selectCls}>
                                                <option value="">Select</option>
                                                <option value="session">Session</option>
                                                <option value="hour">Hour</option>
                                                <option value="month">Month</option>
                                            </select>
                                        </FormField>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 text-sm cursor-pointer"><input type="checkbox" checked={paymentNegotiable} onChange={(e) => setPaymentNegotiable(e.target.checked)} className="rounded" /> Negotiable</label>
                                    </div>
                                    <FormField label="Start Date"><input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="date" className={inputCls} /></FormField>
                                </>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button onClick={() => setStep(0)} className="px-5 py-2.5 border border-surface-200 rounded-xl text-sm hover:border-surface-300 text-neutral-700 transition-colors">
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading || !title.trim() || !description.trim()}
                                    className="flex-1 px-6 py-2.5 bg-primary2-700 text-white font-bold rounded-xl hover:bg-primary2-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                                >
                                    {isLoading ? "Submitting…" : <><RiCheckboxCircleLine /> Submit for Review</>}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
