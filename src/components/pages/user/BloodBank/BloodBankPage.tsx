"use client";

import { useState } from "react";
import { RiHeartPulseLine, RiTestTubeLine } from "react-icons/ri";
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
import BloodBankPageHead from "@/components/modules/user/blood-bank/BloodBankPageHead";
import SectionLabel from "@/components/shared/SectionLabel";

const eligibilitySteps = [
    { step: "01", title: "Health Screening", desc: "Basic eligibility check — weight, iron levels, last donation interval." },
    { step: "02", title: "Donation History", desc: "Verify last donation date and frequency compliance." },
    { step: "03", title: "Hospital Coordination", desc: "Match donor with hospital unit, transport, and timing window." },
    { step: "04", title: "Dispatch Confirmation", desc: "Real-time confirmation that the unit was received and logged." },
];

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
        <div className="">
            {/* ═══ HERO  */}
            <BloodBankPageHead />

            {/* ═══ ELIGIBLE DONORS BY BLOOD GROUP  */}
            <EligibleDonorsByBloodGroup />

            {/* ═══ DONOR SEARCH TABLE  */}
            <FadeUpWrapper className="three-xl-section-setup ">
                <FadeUpWrapper delay={0.02} className="text-center mb-4 md:mb-6">
                    <SectionLabel text="Our blood donors" align="center" className="dark:border-gunmetal-400 dark:text-gunmetal-200 " icon={<RiHeartPulseLine />} />

                    <h2
                        className="section-heading-text-center mb-2 mt-5 text-primary2-900 dark:text-gunmetal-200 ">
                        <span className="text-primary">BAMHSian</span>  Blood Bank&apos;s
                        <span className="text-primary"> Heroes</span>
                    </h2>

                    <p className="text-gunmetal-400 dark:text-gunmetal-300 ">
                        A list of dedicated blood donors and volunteers who support the BAMHSian Blood Bank community.
                    </p>
                </FadeUpWrapper>

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                    <div className="flex-1 w-full max-w-2xl">
                        <InputField
                            type="text"
                            label="Search donors"
                            placeholder="Search by name, phone, email & address..."
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
            </FadeUpWrapper>

            {/* ═══ ELIGIBILITY STEPS */}
            <FadeUpWrapper className="three-xl-section-setup">
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
