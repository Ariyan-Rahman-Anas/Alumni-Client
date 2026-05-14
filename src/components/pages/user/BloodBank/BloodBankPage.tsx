"use client";

import {  useState } from "react";
import { motion } from "framer-motion";
import {
    RiHeartPulseLine,
    RiTestTubeLine,
} from "react-icons/ri";
import { Badge } from "@/components/ui/badge";
import BloodBankPageDonorsTable from "@/components/modules/user/blood-bank/BloodBankPageDonorsTable";
import EligibleDonorsByBloodGroup from "@/components/modules/user/blood-bank/EligibleDonorsByBloodGroup";
import { constantsData } from "@/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { IBatchUserFilterValues } from "@/types/user/batch/batch.types";
import { Controller, useForm } from "react-hook-form";
import SingleSelect from "@/components/shared/SingleSelect";
import InputField from "@/components/shared/InputField";
import { useGetActiveBatchesQuery } from "@/redux/apis/batchApi";
import { FadeUpWrapper } from "../Home/HomePage";

const eligibilitySteps = [
    { step: "01", title: "Health Screening", desc: "Basic eligibility check — weight, iron levels, last donation interval." },
    { step: "02", title: "Donation History", desc: "Verify last donation date and frequency compliance." },
    { step: "03", title: "Hospital Coordination", desc: "Match donor with hospital unit, transport, and timing window." },
    { step: "04", title: "Dispatch Confirmation", desc: "Real-time confirmation that the unit was received and logged." },
];

/* ── Page ─────────────────────────────────────────────────── */
const BloodBankPage = () => {

    const [page, setPage] = useState(1);
    const limit = constantsData.TABLE_PAGE_SIZE;
    const [searchInput, setSearchInput] = useState("");
    const debouncedSearch = useDebounce(searchInput, 400);
    const [filters, setFilters] = useState<IBatchUserFilterValues>({
        search: undefined,
        bloodGroup: undefined,
        section: undefined,
        batch: undefined,
    });

    const { control } = useForm();

    const emptyMessage = debouncedSearch
        ? `No users matching "${debouncedSearch}"`
        : Object.values(filters).some(Boolean)
            ? "No users match the selected filters"
            : "No users found";

    const { data: allActiveBatchesData } = useGetActiveBatchesQuery();
    const batches = allActiveBatchesData?.data?.map(b => ({ label: b.year.toString(), value: b.year.toString() })) ?? [];
    const batchOptions = [{ label: "All batches", value: "" }, ...batches];

    const sections = Object.values(constantsData.SECTIONS).map(section => ({ label: section, value: section }));
    const sectionOptions = [{ label: "All sections", value: "" }, ...sections];

    const bloodGroups = constantsData.BLOOD_GROUPS.map(bg => ({ label: bg, value: bg }));
    const bloodGroupOptions = [{ label: "All blood groups", value: "" }, ...bloodGroups];

    // if(isLoadingBatches) return 

    return (
        <div className="three-xl-section-setup pb-20 space-y-16">

            {/* ═══ 1. HERO ════════════════════════════════════════ */}
            <section className="relative overflow-hidden rounded-3xl"
                style={{ background: "linear-gradient(145deg, #2d0a0a 0%, #7f1d1d 50%, #1c0708 100%)" }}>
                <div className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-30"
                    style={{ background: "#dc2626" }} />
                <div className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full blur-3xl opacity-20"
                    style={{ background: "#f87171" }} />

                <div className="relative z-10 px-7 py-12 sm:px-12 sm:py-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                        <Badge className="mb-5 bg-white/10 text-rose-200 border-rose-400/30 hover:bg-white/10">
                            <RiHeartPulseLine className="mr-1.5" /> Blood Bank Network
                        </Badge>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
                            Emergency support,{" "}
                            <span className="text-rose-300">coordinated with precision</span>
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm sm:text-lg text-rose-100/75 leading-relaxed">
                            A rapid-response coordination hub for donor matching, urgent notices, and life-saving alumni action — all in one place.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ═══ 2. ELIGIBLE DONORS BY BLOOD GROUP ══════════════ */}
            <EligibleDonorsByBloodGroup />

            {/* ═══ 3. DONOR SEARCH TABLE ══════════════════════════ */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div className="flex-1 w-full max-w-2xl">
                    <InputField
                        type="text"
                        label="Search alumni"
                        placeholder="Search by name, phone, email, profession & address..."
                        value={searchInput}
                        onChange={(e) => {
                            setSearchInput(e.target.value);
                            setPage(1);
                        }}
                    />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <Controller
                        name="batch"
                        control={control}
                        render={({ field }) => (
                            <SingleSelect
                                id="reg-batch"
                                label="Batch"
                                value={field.value || ""}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    setFilters((prev) => ({ ...prev, batch: value || undefined }));
                                    setPage(1);
                                }}
                                options={batchOptions}
                                placeholder="Select batch"
                                searchable={false}
                            />
                        )}
                    />
                    <Controller
                        name="section"
                        control={control}
                        render={({ field }) => (
                            <SingleSelect
                                id="reg-section"
                                label="Section"
                                value={field.value || ""}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    setFilters((prev) => ({ ...prev, section: value || undefined }));
                                    setPage(1);
                                }}
                                options={sectionOptions}
                                placeholder="Select section"
                                searchable={false}
                            />
                        )}
                    />
                    <Controller
                        name="bloodGroup"
                        control={control}
                        render={({ field }) => (
                            <SingleSelect
                                id="reg-blood-group"
                                label="Blood Group"
                                value={field.value || ""}
                                onValueChange={(value) => {
                                    field.onChange(value);
                                    setFilters((prev) => ({ ...prev, bloodGroup: value || undefined }));
                                    setPage(1);
                                }}
                                options={bloodGroupOptions}
                                placeholder="Select blood group"
                                searchable={false}
                            />
                        )}
                    />
                </div>
            </div>

            <BloodBankPageDonorsTable
                page={page}
                limit={limit}
                onPageChange={setPage}
                emptyMessage={emptyMessage}
                search={debouncedSearch || undefined}
                bloodGroup={filters.bloodGroup}
                section={filters.section}
                batch={filters.batch}
            />

            {/* ═══ ELIGIBILITY STEPS ═══════════════════════════ */}
            <FadeUpWrapper className="p-6sm:p-8">
                <h3 className="text-xl font-bold text-rose-900">Donor Eligibility Flow</h3>
                <p className="mt-2 text-sm text-muted-foreground">A transparent, step-by-step pipeline from volunteer registration to confirmed dispatch.</p>
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {eligibilitySteps.map(({ step, title, desc }) => (
                        <div key={step} className="rounded-xl border border-rose-200 bg-rose-50/60 p-4">
                            <p className="text-3xl font-black text-rose-200">{step}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <RiTestTubeLine className="text-rose-700 text-base shrink-0" />
                                <p className="text-sm font-semibold text-rose-900">{title}</p>
                            </div>
                            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </FadeUpWrapper>
        </div>
    );
};
export default BloodBankPage;
