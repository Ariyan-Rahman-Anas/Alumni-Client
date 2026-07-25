"use client";

import JobPageHead from "@/components/modules/user/job/JobPageHead"
import { FadeUpWrapper } from "../Home/HomePage"
import JobPageJobs from "@/components/modules/user/job/JobPageJobs"
import JobPageProviders from "@/components/modules/user/job/JobPageProviders"
import JobPageProviderRegCTA from "@/components/modules/user/job/JobPageProviderRegCTA"
import { useState } from "react"
import { RiAddLine, RiBriefcaseLine, RiStarLine } from "react-icons/ri"
import PrimaryButton from "@/components/shared/PrimaryButton";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import {
//     RiBriefcaseLine,
//     RiUserLine,
//     RiStarLine,
//     RiSearchLine,
// } from "react-icons/ri";
// import { useDebounce } from "@/hooks/useDebounce";
// import JobPageHead from "@/components/modules/user/job/JobPageHead";
// import { useGetApprovedJobsQuery, useGetApprovedProvidersQuery } from "@/redux/apis/jobs";
// import JobPageJobCard from "@/components/modules/user/job/JobPageJobCard";
// import { TJobPostType } from "@/components/modules/user/job/job.types";
// import JobPageProviderCard from "@/components/modules/user/job/JobPageProviderCard";
// import JobPageCardSkeleton from "@/components/modules/user/job/JobPageCardSkeleton";
// import JobPageProviderRegCTA from "@/components/modules/user/job/JobPageProviderRegCTA";
// import { FadeUpWrapper } from "../Home/HomePage";
// import InputField from "@/components/shared/InputField";
// import SingleSelect from "@/components/shared/SingleSelect";
// import Pagination from "@/components/shared/Pagination";
// import { constantsData } from "@/constants";

// type TMainTab = "jobs" | "providers";
// type TJobTypeTab = "all" | TJobPostType;

// const JOB_TYPE_OPTIONS = [
//     { label: "All Types Jobs", value: "all" },
//     { label: "Official", value: "OFFICIAL" },
//     { label: "Tuition", value: "TUITION" },
//     { label: "Service", value: "PERSONAL" },
// ];

// const MAIN_TABS: { key: TMainTab; label: string; icon: React.ReactNode }[] = [
//     { key: "jobs", label: "Job Posts", icon: <RiBriefcaseLine /> },
//     { key: "providers", label: "Browse Providers", icon: <RiStarLine /> },
// ];

// export default function JobsPage() {
//     const router = useRouter();

//     const [mainTab, setMainTab] = useState<TMainTab>("jobs");

//     // Jobs state
//     const [jobTypeTab, setJobTypeTab] = useState<TJobTypeTab>("all");
//     const [jobSearch, setJobSearch] = useState("");
//     const [page, setPage] = useState(1);
//     const debouncedJobSearch = useDebounce(jobSearch, 400);

//     // Providers state
//     const [providerSearch, setProviderSearch] = useState("");
//     const [providerPage, setProviderPage] = useState(1);
//     const debouncedProviderSearch = useDebounce(providerSearch, 400);

//     const isJobs = mainTab === "jobs";

//     const { data: jobsData, isLoading: jobsLoading } = useGetApprovedJobsQuery(
//         { page, limit: constantsData.PAGE_SECTION_SIZE, searchTerm: debouncedJobSearch || undefined, type: jobTypeTab !== "all" ? (jobTypeTab as TJobPostType) : undefined },
//         { skip: !isJobs },
//     );

//     const { data: providersData, isLoading: providersLoading } = useGetApprovedProvidersQuery(
//         { page: providerPage, limit: constantsData.PAGE_SECTION_SIZE, searchTerm: debouncedProviderSearch || undefined },
//         { skip: isJobs },
//     );

//     const jobs = jobsData?.data ?? [];
//     const meta = jobsData?.meta;
//     const providers = providersData?.data ?? [];
//     const providerMeta = providersData?.meta;

//     const handleMainTabChange = (t: TMainTab) => {
//         setMainTab(t);
//         setPage(1);
//         setProviderPage(1);
//     };

//     const handleJobTypeChange = (t: TJobTypeTab) => {
//         setJobTypeTab(t);
//         setPage(1);
//     };

//     return (
//         <div className="">
//             <JobPageHead />

//             <FadeUpWrapper delay={0.1} className="space-y-6 three-xl-section-setup">
//                 {/* -- Main Tab Switcher  */}
//                 <div className="flex items-center gap-2 p-1 rounded-2xl bg-surface-100 dark:bg-gunmetal-800 border border-surface-200 dark:border-gunmetal-700 w-fit">
//                     {MAIN_TABS.map((t) => (
//                         <button
//                             key={t.key}
//                             onClick={() => handleMainTabChange(t.key)}
//                             className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${mainTab === t.key
//                                 ? "bg-white dark:bg-gunmetal-700 text-primary2-900 dark:text-white shadow-sm"
//                                 : "text-gray-500 dark:text-gunmetal-400 hover:text-gray-800 dark:hover:text-gunmetal-200"
//                                 }`}
//                         >
//                             {t.icon} {t.label}
//                         </button>
//                     ))}
//                 </div>

//                 {/* -- Jobs Panel  */}
//                 {isJobs && <JobPageJobs /> }

//                 {/* -- Providers Panel  */}
//                 {!isJobs && <JobPageProviders /> }
//             </FadeUpWrapper>

//             <JobPageProviderRegCTA />
//         </div>
//     );
// }





type TMainTab = "jobs" | "providers";

const MAIN_TABS: { key: TMainTab; label: string; icon: React.ReactNode }[] = [
    { key: "jobs", label: "Job Posts", icon: <RiBriefcaseLine /> },
    { key: "providers", label: "Browse Providers", icon: <RiStarLine /> },
];

const JobsPage = () => {
    const [mainTab, setMainTab] = useState<TMainTab>("jobs");
    const isJobs = mainTab === "jobs";

    return (
        <div className="">
            <JobPageHead />

            {/* Actions */}
            <FadeUpWrapper delay={0.25} className="three-xl-section-setup py-0 " >
                <div className="flex flex-wrap gap-3 tracking-wide">
                    <PrimaryButton
                        title="Post a Job"
                        icon={<RiAddLine />}
                        href="/jobs/post"
                        className="bg-white text-primary2-700 py-[19px] rounded-full font-semibold"
                    />
                    {/* <PrimaryButton
                        title={providerBtn.title}
                        icon={providerBtn.icon}
                        href={providerBtn.href}
                        isDisabled={providerBtn.isDisabled}
                        className={providerBtn.className}
                    /> */}
                </div>
            </FadeUpWrapper>

            <FadeUpWrapper delay={0.1} className="space-y-6 three-xl-section-setup">
                <div className="flex items-center gap-2 p-1 rounded-2xl bg-surface-100 dark:bg-gunmetal-800 border border-surface-200 dark:border-gunmetal-700 w-fit">
                    {MAIN_TABS.map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setMainTab(t.key)}
                            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${mainTab === t.key
                                ? "bg-white dark:bg-gunmetal-700 text-primary2-900 dark:text-white shadow-sm"
                                : "text-gray-500 dark:text-gunmetal-400 hover:text-gray-800 dark:hover:text-gunmetal-200"
                                }`}
                        >
                            {t.icon} {t.label}
                        </button>
                    ))}
                </div>

                {isJobs ? <JobPageJobs /> : <JobPageProviders />}
            </FadeUpWrapper>

            <JobPageProviderRegCTA />
        </div>
    )
}
export default JobsPage