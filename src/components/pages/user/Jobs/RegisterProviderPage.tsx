"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    RiArrowLeftLine,
    RiCheckboxCircleLine,
    RiUploadLine,
    RiCloseLine,
    RiAddLine,
} from "react-icons/ri";
import { useRegisterProviderMutation, type CreateProviderPayload } from "@/redux/apis/jobApi";

const PROVIDER_TYPES = [
    "tutor", "electrician", "plumber", "cook", "driver", "cleaner",
    "carpenter", "painter", "gardener", "security", "other",
];
const SUBJECTS_LIST = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Bangla", "ICT", "Accounting", "Economics", "History"];
const CLASS_RANGE = ["Class 1–5", "Class 6–8", "Class 9–10", "SSC", "HSC", "University"];
const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const inputCls = "w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-sm text-primary2-900 focus:outline-none focus:ring-2 focus:ring-primary2-300 focus:border-primary2-300 placeholder:text-muted-foreground";

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

function TagInput({ tags, onAdd, onRemove, placeholder, suggestions }: { tags: string[]; onAdd: (v: string) => void; onRemove: (v: string) => void; placeholder?: string; suggestions?: string[] }) {
    const [val, setVal] = useState("");
    const add = (v: string) => { const t = v.trim(); if (t && !tags.includes(t)) { onAdd(t); setVal(""); } };
    return (
        <div>
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((t) => (
                    <span key={t} className="inline-flex items-center gap-1 bg-primary2-50 text-primary2-700 border border-primary2-200 text-sm px-3 py-1 rounded-full">
                        {t}<button onClick={() => onRemove(t)} className="hover:text-red-500 ml-0.5"><RiCloseLine /></button>
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

    const [providerType, setProviderType] = useState("");
    const [bio, setBio] = useState("");
    const [experience, setExperience] = useState("");
    const [gender, setGender] = useState<"male" | "female">("male");
    const [location, setLocation] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [monthlyRate, setMonthlyRate] = useState("");
    const [availability, setAvailability] = useState<string[]>([]);
    const [qualifications, setQualifications] = useState<string[]>([]);
    const [subjects, setSubjects] = useState<string[]>([]);
    const [classRange, setClassRange] = useState<string[]>([]);
    const [availableGenderStudents, setAvailableGenderStudents] = useState("");
    const [certFiles, setCertFiles] = useState<File[]>([]);

    const isTutor = providerType === "tutor";

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        setCertFiles((prev) => [...prev, ...files].slice(0, 5));
    };

    const handleSubmit = async () => {
        if (!providerType || !bio.trim() || !experience.trim() || !location.trim()) return;

        const payload: CreateProviderPayload = {
            providerType: providerType as CreateProviderPayload["providerType"],
            bio: bio.trim(),
            experience: experience.trim(),
            gender,
            location: location.trim(),
            hourlyRate: hourlyRate ? Number(hourlyRate) : undefined,
            monthlyRate: monthlyRate ? Number(monthlyRate) : undefined,
            availability: availability.length ? availability : undefined,
            qualifications: qualifications.length ? qualifications : undefined,
            subjects: isTutor && subjects.length ? subjects : undefined,
            classRange: isTutor && classRange.length ? classRange : undefined,
            availableGenderStudents: availableGenderStudents || undefined,
        } as CreateProviderPayload;

        try {
            await registerProvider({ payload, certificates: certFiles.length ? certFiles : undefined }).unwrap();
            router.push("/jobs?registered=1");
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
                <h1 className="text-3xl font-extrabold text-primary2-900">Register as Provider</h1>
                <p className="text-muted-foreground mt-1">Create your provider profile. Admin will review and approve it.</p>
            </div>

            <div className="bg-white rounded-2xl border border-surface-200 p-6 space-y-6">
                <FormField label="Provider Type" required>
                    <select value={providerType} onChange={(e) => setProviderType(e.target.value)} className={inputCls}>
                        <option value="">Select your role</option>
                        {PROVIDER_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                    </select>
                </FormField>

                <FormField label="Bio" required hint="Describe your expertise, experience, and teaching/service style.">
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Tell alumni about yourself, your background, and what makes you the right choice..." rows={4} className={`${inputCls} resize-none`} />
                </FormField>

                <FormField label="Years of Experience" required>
                    <input value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="e.g. 5 years as math tutor / 3 years as electrician" className={inputCls} />
                </FormField>

                <FormField label="Your Gender" required>
                    <select value={gender} onChange={(e) => setGender(e.target.value as "male" | "female")} className={inputCls}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </FormField>

                <FormField label="Location" required hint="Where are you available to work?">
                    <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Mirpur, Dhaka" className={inputCls} />
                </FormField>

                {/* Tutor-specific */}
                {isTutor && (
                    <>
                        <FormField label="Subjects You Teach">
                            <TagInput tags={subjects} onAdd={(v) => setSubjects([...subjects, v])} onRemove={(v) => setSubjects(subjects.filter((s) => s !== v))} placeholder="Add subject" suggestions={SUBJECTS_LIST} />
                        </FormField>
                        <FormField label="Class Range">
                            <div className="flex flex-wrap gap-2 mt-1">
                                {CLASS_RANGE.map((c) => (
                                    <button key={c} type="button" onClick={() => setClassRange(classRange.includes(c) ? classRange.filter((x) => x !== c) : [...classRange, c])}
                                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${classRange.includes(c) ? "border-primary2-600 bg-primary2-50 text-primary2-700" : "border-surface-200 text-muted-foreground hover:border-primary2-300"}`}
                                    >{c}</button>
                                ))}
                            </div>
                        </FormField>
                        <FormField label="Prefer to teach (gender)">
                            <select value={availableGenderStudents} onChange={(e) => setAvailableGenderStudents(e.target.value)} className={inputCls}>
                                <option value="">Any</option>
                                <option value="male">Male students only</option>
                                <option value="female">Female students only</option>
                                <option value="any">Both</option>
                            </select>
                        </FormField>
                    </>
                )}

                {/* Qualifications */}
                <FormField label="Qualifications / Certifications">
                    <TagInput tags={qualifications} onAdd={(v) => setQualifications([...qualifications, v])} onRemove={(v) => setQualifications(qualifications.filter((q) => q !== v))} placeholder="e.g. BSc in EEE, BUET" />
                </FormField>

                {/* Rates */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="Hourly Rate (BDT)"><input value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} type="number" placeholder="e.g. 200" className={inputCls} /></FormField>
                    <FormField label="Monthly Rate (BDT)"><input value={monthlyRate} onChange={(e) => setMonthlyRate(e.target.value)} type="number" placeholder="e.g. 5000" className={inputCls} /></FormField>
                </div>

                {/* Availability */}
                <FormField label="Available Days">
                    <div className="flex flex-wrap gap-2 mt-1">
                        {DAYS.map((d) => (
                            <button key={d} type="button" onClick={() => setAvailability(availability.includes(d) ? availability.filter((x) => x !== d) : [...availability, d])}
                                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${availability.includes(d) ? "border-primary2-600 bg-primary2-50 text-primary2-700" : "border-surface-200 text-muted-foreground hover:border-primary2-300"}`}
                            >{d}</button>
                        ))}
                    </div>
                </FormField>

                {/* Certificate upload */}
                <FormField label="Certificates / Documents" hint="Upload up to 5 documents (PDF, images). Required for tutors.">
                    <label className="flex flex-col items-center gap-2 border-2 border-dashed border-surface-300 rounded-xl p-6 cursor-pointer hover:border-primary2-400 transition-colors">
                        <RiUploadLine className="text-2xl text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload files</span>
                        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
                    </label>
                    {certFiles.length > 0 && (
                        <div className="mt-3 space-y-2">
                            {certFiles.map((f, i) => (
                                <div key={i} className="flex items-center justify-between gap-2 bg-surface-50 rounded-xl px-4 py-2 text-sm">
                                    <span className="text-neutral-700 truncate">{f.name}</span>
                                    <button onClick={() => setCertFiles(certFiles.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 flex-shrink-0"><RiCloseLine /></button>
                                </div>
                            ))}
                        </div>
                    )}
                </FormField>

                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !providerType || !bio.trim() || !experience.trim() || !location.trim()}
                    className="w-full px-6 py-3 bg-primary2-700 text-white font-bold rounded-xl hover:bg-primary2-800 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                    {isLoading ? "Submitting…" : <><RiCheckboxCircleLine /> Submit for Review</>}
                </button>
            </div>
        </div>
    );
}
