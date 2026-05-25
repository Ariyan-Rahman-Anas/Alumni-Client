"use client";

import { useState } from "react";
import { RiHeartPulseLine } from "react-icons/ri";
import BloodBankPageDonorsTable from "@/components/modules/user/blood-bank/BloodBankPageDonorsTable";
import EligibleDonorsByBloodGroup from "@/components/modules/user/blood-bank/EligibleDonorsByBloodGroup";
import BloodDonationCriteria from "@/components/modules/user/blood-bank/BloodDonationCriteria";
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
        <div>
            {/* ═══ HERO  */}
            <BloodBankPageHead />

            {/* ═══ ELIGIBLE DONORS BY BLOOD GROUP  */}
            <EligibleDonorsByBloodGroup />

            {/* ═══ DONOR SEARCH TABLE  */}
            <FadeUpWrapper className="three-xl-section-setup ">
                <FadeUpWrapper delay={0.02} className="text-center mb-4 md:mb-6">
                    <SectionLabel text="Our blood donors" align="center" className="text-danger-dark border-danger-dark/30" icon={<RiHeartPulseLine />} />

                    <h2
                        className="section-heading-text-center mb-2 mt-5 text-primary2-900 dark:text-gunmetal-200 ">
                        <span className="text-danger-dark">BAMHSian</span>  Blood Bank&apos;s
                        <span className="text-danger-dark"> Heroes</span>
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

            {/* ═══ ELIGIBILITY CRITERIA  */}
            <BloodDonationCriteria />
        </div>
    );
};
export default BloodBankPage;
