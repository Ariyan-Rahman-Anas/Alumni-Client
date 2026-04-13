"use client";

import { useEffect, useRef, useState } from "react";
import { RiSearchLine } from "react-icons/ri";

import InputField from "@/components/shared/InputField";
import SingleSelect from "@/components/shared/SingleSelect";
import { constantsData } from "@/constants";
import PrimaryButton from "@/components/shared/PrimaryButton";

export type FilterTab = "ALL" | "PENDING" | "APPROVED";

export interface UserFilterValues {
    approvalStatus: string | undefined;
    search: string | undefined;
    bloodGroup: string | undefined;
    section: string | undefined;
    dobYear: number | undefined;
    dobMonth: number | undefined;
    dobDay: number | undefined;
    isVerified: boolean | undefined;
}

interface AdminUsersSearchFilterProps {
    onChange: (filters: UserFilterValues) => void;
    onPageReset: () => void;
}

const TABS: { label: string; value: FilterTab }[] = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Approved", value: "APPROVED" },
];

const BLOOD_GROUP_OPTIONS = constantsData.BLOOD_GROUPS.map((bg) => ({ label: bg, value: bg }));

const SECTION_OPTIONS = constantsData.SECTIONS;

const MONTH_OPTIONS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
].map((m, i) => ({ label: m, value: String(i + 1) }));

const AdminUsersSearchFilter = ({ onChange, onPageReset }: AdminUsersSearchFilterProps) => {
    const [tab, setTab] = useState<FilterTab>("PENDING");
    const [inputFilters, setInputFilters] = useState({ search: "", dobYear: "", dobDay: "" });
    const [bloodGroup, setBloodGroup] = useState("");
    const [section, setSection] = useState("");
    const [dobMonth, setDobMonth] = useState("");
    const [isVerified, setIsVerified] = useState("");
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const resolvedIsVerified = isVerified === "true" ? true : isVerified === "false" ? false : undefined;

    const hasActiveFilter =
        !!inputFilters.search || !!inputFilters.dobYear || !!inputFilters.dobDay ||
        !!bloodGroup || !!section || !!dobMonth || !!isVerified;

    // Debounce text inputs → emit
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onPageReset();
            onChange({
                approvalStatus: tab === "ALL" ? undefined : tab,
                search: inputFilters.search || undefined,
                bloodGroup: bloodGroup || undefined,
                section: section || undefined,
                dobYear: inputFilters.dobYear ? Number(inputFilters.dobYear) : undefined,
                dobMonth: dobMonth ? Number(dobMonth) : undefined,
                dobDay: inputFilters.dobDay ? Number(inputFilters.dobDay) : undefined,
                isVerified: resolvedIsVerified,
            });
        }, 400);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [inputFilters]);

    // Immediate selects → emit right away
    useEffect(() => {
        onPageReset();
        onChange({
            approvalStatus: tab === "ALL" ? undefined : tab,
            search: inputFilters.search || undefined,
            bloodGroup: bloodGroup || undefined,
            section: section || undefined,
            dobYear: inputFilters.dobYear ? Number(inputFilters.dobYear) : undefined,
            dobMonth: dobMonth ? Number(dobMonth) : undefined,
            dobDay: inputFilters.dobDay ? Number(inputFilters.dobDay) : undefined,
            isVerified: resolvedIsVerified,
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tab, bloodGroup, section, dobMonth, isVerified]);

    const resetFilters = () => {
        setInputFilters({ search: "", dobYear: "", dobDay: "" });
        setBloodGroup("");
        setSection("");
        setDobMonth("");
        setIsVerified("");
        setTab("PENDING");
        onPageReset();
    };

    return (
        //Row 1 — Search + Status tabs 
        <div className="flex flex-col gap-4 mb-3" >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 " >
                <div className="w-full md:max-w-sm">
                    <InputField
                        icon={<RiSearchLine />}
                        placeholder="Search by name, email, phone..."
                        value={inputFilters.search}
                        onChange={(e) => setInputFilters((p) => ({ ...p, search: e.target.value }))}
                        className="text-sm"
                    />
                </div>

                <div className="flex items-center gap-0 border border-gray-200 rounded-lg p-0.5 w-fit h-10">
                    {TABS.map((t) => (
                        <PrimaryButton
                            key={t.value}
                            type="button"
                            onClick={() => setTab(t.value)}
                            title={t.label} variant={tab === t.value ? "default" : "ghost"}
                        />
                    ))}
                </div>
            </div>

            {/* Row 2 — Extra filters */}
            <div className="flex items-center lg:justify-end" >
                <div className="max-w-[57rem] grid grid-cols-3 items-end md:grid-cols-7 gap-x-1 gap-y-2 ">
                    <SingleSelect
                        options={BLOOD_GROUP_OPTIONS}
                        value={bloodGroup}
                        onValueChange={setBloodGroup}
                        placeholder="Blood group"
                        searchable={false}
                        allowDeselect
                        width="w-28"
                        label="Blood"
                    />
                    <SingleSelect
                        options={SECTION_OPTIONS}
                        value={section}
                        onValueChange={setSection}
                        placeholder="Section"
                        searchable={false}
                        allowDeselect
                        width="w-28"
                        label="Section"
                    />
                    <InputField
                        label="Year"
                        type="number"
                        placeholder="e.g. 1995"
                        min={1900}
                        max={2099}
                        value={inputFilters.dobYear}
                        onChange={(e) => setInputFilters((p) => ({ ...p, dobYear: e.target.value }))}
                        className="text-sm w-28"
                    />
                    <SingleSelect
                        options={MONTH_OPTIONS}
                        value={dobMonth}
                        onValueChange={setDobMonth}
                        placeholder="Month"
                        searchable={false}
                        allowDeselect
                        width="w-28"
                        label="Month"
                    />
                    <InputField
                        label="Day"
                        type="number"
                        placeholder="e.g. 14"
                        min={1}
                        max={31}
                        value={inputFilters.dobDay}
                        onChange={(e) => setInputFilters((p) => ({ ...p, dobDay: e.target.value }))}
                        className="text-sm w-28"
                    />
                    <SingleSelect
                        options={[
                            { label: "Verified", value: "true" },
                            { label: "Unverified", value: "false" },
                        ]}
                        value={isVerified}
                        onValueChange={setIsVerified}
                        placeholder="Any"
                        searchable={false}
                        allowDeselect
                        width="w-28"
                        label="Email"
                    />
                    <PrimaryButton
                        type="button" onClick={resetFilters}
                        title="Clear Filters" variant="destructive" className="py-[19px] px-4 "
                        isDisabled={!hasActiveFilter}
                    />
                </div>
            </div>
        </div >
    );
};

export default AdminUsersSearchFilter;