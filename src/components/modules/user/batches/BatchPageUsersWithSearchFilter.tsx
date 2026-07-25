"use client";

import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import InputField from "@/components/shared/InputField";
import SingleSelect from "@/components/shared/SingleSelect";
import { Controller, useForm } from "react-hook-form";
import BatchPageUsersTable from "./BatchPageUsersTable";
import { useState } from "react";
import { constantsData } from "@/constants";
import { useDebounce } from "@/hooks/useDebounce";
import { IBatchUserFilterValues } from "@/types/user/batch/batch.types";
import { useGetActiveBatchesQuery } from "@/redux/apis/batchApi";

const BatchPageUsersWithSearchFilter = () => {
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

    const emptyMessage = debouncedSearch
        ? `No users matching "${debouncedSearch}"`
        : Object.values(filters).some(Boolean)
            ? "No users match the selected filters"
            : "No users found";

    const { data: allActiveBatchesData } = useGetActiveBatchesQuery();

    const { control } = useForm();

    const batches = allActiveBatchesData?.data?.map(b => ({ label: b.year.toString(), value: b.year.toString() })) ?? [];
    const batchOptions = [{ label: "All batches", value: "" }, ...batches];

    const sections = Object.values(constantsData.SECTIONS).map(section => ({ label: section, value: section }));
    const sectionOptions = [{ label: "All sections", value: "" }, ...sections];

    const bloodGroups = constantsData.BLOOD_GROUPS.map(bg => ({ label: bg, value: bg }));
    const bloodGroupOptions = [{ label: "All blood groups", value: "" }, ...bloodGroups];

    return (
        <FadeUpWrapper className="three-xl-section-setup ">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary2-900 mb-1">Batch Directory</h2>
            <p className="mb-5 text-sm text-muted-foreground">Comprehensive alumni directory with batch, contact, and professional details.</p>
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

            <BatchPageUsersTable
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
    )
}
export default BatchPageUsersWithSearchFilter