"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import InputField from "@/components/shared/InputField";
import { RiSearchLine, RiUserLine } from "react-icons/ri";
import JobPageCardSkeleton from "./JobPageCardSkeleton";
import JobPageProviderCard from "./JobPageProviderCard";
import Pagination from "@/components/shared/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetApprovedProvidersQuery } from "@/redux/apis/jobs";
import { constantsData } from "@/constants";

const JobPageProviders = () => {
    const router = useRouter();

    const [providerSearch, setProviderSearch] = useState("");
    const [providerPage, setProviderPage] = useState(1);
    const debouncedProviderSearch = useDebounce(providerSearch, 400);

    const { data: providersData, isLoading: providersLoading } = useGetApprovedProvidersQuery({
        page: providerPage,
        limit: constantsData.PAGE_SECTION_SIZE,
        searchTerm: debouncedProviderSearch || undefined,
    });

    const providers = providersData?.data ?? [];
    const providerMeta = providersData?.meta;

    const handleProviderSearchChange = (v: string) => {
        setProviderSearch(v);
        setProviderPage(1);
    };

    return (
        <div className="space-y-5">
            {/* Provider Search */}
            <InputField
                placeholder="Search providers by name or skill..."
                value={providerSearch}
                icon={<RiSearchLine />}
                onChange={(e) => handleProviderSearchChange(e.target.value)}
                containerClassName="max-w-md"
            />

            {/* Providers Grid */}
            <FadeUpWrapper key="providers-grid" delay={0.05} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {providersLoading
                    ? Array.from({ length: 6 }).map((_, i) => <JobPageCardSkeleton key={i} />)
                    : providers.length === 0
                        ? (
                            <div className="col-span-full flex flex-col items-center gap-3 py-24 text-center">
                                <div className="h-16 w-16 rounded-full bg-surface-100 dark:bg-gunmetal-700 flex items-center justify-center">
                                    <RiUserLine className="text-2xl text-muted-foreground" />
                                </div>
                                <p className="text-base font-semibold text-primary2-900 dark:text-gunmetal-100">No providers found</p>
                                <p className="text-sm text-muted-foreground">Try a different search</p>
                            </div>
                        )
                        : providers.map((p) => (
                            <JobPageProviderCard
                                key={p._id}
                                provider={p}
                                onClick={() => router.push(`/jobs/providers/${p._id}`)}
                            />
                        ))
                }
            </FadeUpWrapper>

            {/* Providers Pagination */}
            {providerMeta && providerMeta.totalPage > 1 && (
                <Pagination
                    page={providerPage}
                    totalPages={providerMeta.totalPage}
                    total={providerMeta.total}
                    pageSize={constantsData.PAGE_SECTION_SIZE}
                    dataCount={providers.length}
                    onPageChange={setProviderPage}
                />
            )}
        </div>
    );
};

export default JobPageProviders;