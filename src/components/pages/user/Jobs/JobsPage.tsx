"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
    RiBriefcaseLine,
    RiSearchLine,
    RiCloseLine,
    RiMapPinLine,
    RiMoneyDollarCircleLine,
    RiUserLine,
    RiCheckboxCircleLine,
    RiArrowRightLine,
    RiArrowLeftSLine,
    RiArrowRightSLine,
    RiBookOpenLine,
    RiToolsLine,
    RiAddLine,
    RiSparkling2Line,
    RiHeartLine,
    RiFilterLine,
    RiStarLine,
    RiFileListLine,
} from "react-icons/ri";
import {  formatDistanceToNow } from "date-fns";
import { useDebounce } from "@/hooks/useDebounce";
import {
    useGetApprovedJobsQuery,
    useGetApprovedProvidersQuery,
    type JobPost,
    type JobPostType,
    type ServiceProvider,
} from "@/redux/apis/jobApi";


const TYPE_CONFIG: Record<JobPostType, { label: string; color: string; icon: React.ReactNode }> = {
    OFFICIAL: {
        label: "Official Job",
        color: "bg-blue-50 text-blue-700 border border-blue-200",
        icon: <RiBriefcaseLine />,
    },
    TUITION: {
        label: "Tuition Seek",
        color: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        icon: <RiBookOpenLine />,
    },
    PERSONAL: {
        label: "Service Seek",
        color: "bg-violet-50 text-violet-700 border border-violet-200",
        icon: <RiToolsLine />,
    },
};

function FadeUp({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay, ease: "easeOut" }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

function JobCard({ job, index }: { job: JobPost; index: number }) {
    const router = useRouter();
    const cfg = TYPE_CONFIG[job.type];
    const postedAgo = formatDistanceToNow(new Date(job.createdAt), { addSuffix: true });

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, delay: index * 0.04 }}
            onClick={() => router.push(`/jobs/${job._id}`)}
            className="group relative bg-white rounded-2xl border border-surface-200 p-5 hover:shadow-md hover:border-primary2-300 cursor-pointer transition-all duration-300 flex flex-col"
        >
            {/* Type badge */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg?.color}`}>
                    {cfg?.icon} {cfg?.label}
                </span>
                <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">{postedAgo}</span>
            </div>

            <h3 className="font-bold text-primary2-900 text-base leading-snug mb-1 group-hover:text-primary2-700 transition-colors line-clamp-2">
                {job.title}
            </h3>

            {/* Meta info by type */}
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                {job.type === "OFFICIAL" && job.company && (
                    <span className="flex items-center gap-1"><RiBriefcaseLine /> {job.company}</span>
                )}
                {job.type === "OFFICIAL" && job.location && (
                    <span className="flex items-center gap-1"><RiMapPinLine /> {job.location}</span>
                )}
                {job.type === "OFFICIAL" && (job.salaryMin || job.salaryMax) && (
                    <span className="flex items-center gap-1">
                        <RiMoneyDollarCircleLine />
                        {job.salaryNegotiable ? "Negotiable" : `${job.salaryMin ?? "?"} – ${job.salaryMax ?? "?"} ${job.salaryCurrency ?? "BDT"}`}
                    </span>
                )}
                {job.type === "TUITION" && job.studentClass && (
                    <span className="flex items-center gap-1"><RiBookOpenLine /> Class {job.studentClass}</span>
                )}
                {job.type === "TUITION" && job.subjects?.length && (
                    <span className="flex items-center gap-1"><RiCheckboxCircleLine /> {job.subjects.slice(0, 2).join(", ")}{job.subjects.length > 2 ? "…" : ""}</span>
                )}
                {job.type === "PERSONAL" && job.serviceCategory && (
                    <span className="flex items-center gap-1"><RiToolsLine /> {job.serviceCategory}</span>
                )}
                {(job.type === "TUITION" || job.type === "PERSONAL") && job.seekLocation && (
                    <span className="flex items-center gap-1"><RiMapPinLine /> {job.seekLocation}</span>
                )}
            </div>

            <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">{job.description}</p>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-surface-100">
                <div className="flex items-center gap-2">
                    {job.postedBy.imageUrl ? (
                        <Image src={job.postedBy.imageUrl} alt={job.postedBy.name} width={24} height={24} className="rounded-full object-cover" />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-primary2-100 flex items-center justify-center text-xs font-bold text-primary2-700">
                            {job.postedBy.name[0]}
                        </div>
                    )}
                    <span className="text-xs text-muted-foreground">{job.postedBy.name}</span>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <RiHeartLine /> {job.likes.length}
                </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary2-500 to-accent2-500 rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        </motion.div>
    );
}

function ProviderCard({ provider, onClick }: { provider: ServiceProvider; onClick: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={onClick}
            className="group bg-white rounded-2xl border border-surface-200 p-4 hover:shadow-md hover:border-primary2-300 cursor-pointer transition-all duration-300 flex gap-4 items-start"
        >
            {provider.user.imageUrl ? (
                <Image src={provider.user.imageUrl} alt={provider.user.name} width={52} height={52} className="rounded-xl object-cover flex-shrink-0" />
            ) : (
                <div className="rounded-xl bg-primary2-100 flex items-center justify-center text-xl font-bold text-primary2-700 flex-shrink-0 w-[52px] h-[52px]">
                    {provider.user.name[0]}
                </div>
            )}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-primary2-900 text-sm group-hover:text-primary2-700 transition-colors">{provider.user.name}</h4>
                    <span className="text-xs bg-primary2-50 text-primary2-700 border border-primary2-200 px-2 py-0.5 rounded-full capitalize flex-shrink-0">{provider.providerType}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><RiMapPinLine className="flex-shrink-0" /> {provider.location}</p>
                <p className="text-xs text-neutral-600 mt-1.5 line-clamp-2">{provider.bio}</p>
                {(provider.hourlyRate || provider.monthlyRate) && (
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <RiMoneyDollarCircleLine />
                        {provider.hourlyRate ? `${provider.hourlyRate} BDT/hr` : ""}
                        {provider.hourlyRate && provider.monthlyRate ? " Â· " : ""}
                        {provider.monthlyRate ? `${provider.monthlyRate} BDT/mo` : ""}
                    </p>
                )}
            </div>
        </motion.div>
    );
}

function CardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-surface-200 p-5 animate-pulse">
            <div className="flex justify-between mb-3"><div className="h-5 w-28 rounded-full bg-surface-200" /><div className="h-4 w-16 rounded bg-surface-200" /></div>
            <div className="h-5 w-3/4 rounded bg-surface-200 mb-2" />
            <div className="h-4 w-full rounded bg-surface-200 mb-1" />
            <div className="h-4 w-2/3 rounded bg-surface-200 mb-4" />
            <div className="flex gap-2"><div className="h-5 w-5 rounded-full bg-surface-200" /><div className="h-4 w-24 rounded bg-surface-200" /></div>
        </div>
    );
}

type Tab = "all" | JobPostType | "providers";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "all", label: "All Posts", icon: <RiFilterLine /> },
    { key: "OFFICIAL", label: "Official Jobs", icon: <RiBriefcaseLine /> },
    { key: "TUITION", label: "Tuition Seek", icon: <RiBookOpenLine /> },
    { key: "PERSONAL", label: "Service Seek", icon: <RiToolsLine /> },
    { key: "providers", label: "Browse Providers", icon: <RiStarLine /> },
];

export default function JobsPage() {
    const router = useRouter();
    const [tab, setTab] = useState<Tab>("all");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [providerPage, setProviderPage] = useState(1);
    const debouncedSearch = useDebounce(search, 400);

    const isProviderTab = tab === "providers";

    const { data: jobsData, isLoading: jobsLoading } = useGetApprovedJobsQuery(
        {
            page,
            limit: 9,
            searchTerm: debouncedSearch || undefined,
            type: tab !== "all" && tab !== "providers" ? (tab as JobPostType) : undefined,
        },
        { skip: isProviderTab },
    );

    const { data: providersData, isLoading: providersLoading } = useGetApprovedProvidersQuery(
        { page: providerPage, limit: 9, searchTerm: debouncedSearch || undefined },
        { skip: !isProviderTab },
    );

    const jobs = jobsData?.data ?? [];
    const meta = jobsData?.meta;
    const providers = providersData?.data ?? [];
    const providerMeta = providersData?.meta;

    const handleTabChange = (t: Tab) => {
        setTab(t);
        setPage(1);
        setProviderPage(1);
    };

    return (
        <div>
            {/* â”€â”€ Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <section
                className="relative overflow-hidden text-white"
                style={{ background: "linear-gradient(145deg, #041a12 0%, #0c4a34 55%, #062319 100%)" }}
            >
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-25" style={{ background: "rgba(46,139,87,1)" }} />
                <div className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full blur-3xl opacity-20" style={{ background: "rgba(245,158,11,1)" }} />

                <div className="relative z-10 three-xl-section-setup py-16 sm:py-24">
                    <FadeUp>
                        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-sm font-medium mb-5 text-primary2-200">
                            <RiSparkling2Line className="text-gold-300" />
                            Alumni Network Â· Job Board
                        </div>
                    </FadeUp>
                    <FadeUp delay={0.08}>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-4 text-white">
                            Opportunities &{" "}
                            <span className="text-primary2-300">Services Hub</span>
                        </h1>
                    </FadeUp>
                    <FadeUp delay={0.14}>
                        <p className="text-lg text-primary2-100/80 max-w-2xl mb-10">
                            Discover career openings, find tutors, hire skilled workers â€” or post your own. All within the BAMHS alumni community.
                        </p>
                    </FadeUp>

                    {/* Stats */}
                    <FadeUp delay={0.2}>
                        <div className="flex flex-wrap gap-3 mb-10">
                            {[
                                { icon: <RiFileListLine />, label: "Job Posts", value: meta?.total ?? "--" },
                                { icon: <RiBookOpenLine />, label: "Tutors", value: "--" },
                                { icon: <RiToolsLine />, label: "Service Workers", value: "--" },
                            ].map(({ icon, label, value }) => (
                                <div key={label} className="flex items-center gap-2 bg-white border border-surface-200 rounded-xl px-4 py-2.5 shadow-sm">
                                    <span className="text-primary2-600 text-base">{icon}</span>
                                    <div>
                                        <p className="text-xs text-muted-foreground leading-none">{label}</p>
                                        <p className="text-sm font-bold text-primary2-900 leading-tight mt-0.5">{value}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FadeUp>

                    {/* Actions */}
                    <FadeUp delay={0.26}>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => router.push("/jobs/post")}
                                className="inline-flex items-center gap-2 bg-white text-primary2-900 font-bold px-6 py-3 rounded-full hover:bg-surface-100 transition-colors text-sm"
                            >
                                <RiAddLine /> Post a Job
                            </button>
                            <button
                                onClick={() => router.push("/jobs/register-provider")}
                                className="inline-flex items-center gap-2 border border-white/40 bg-white/10 backdrop-blur-sm font-semibold px-6 py-3 rounded-full hover:bg-white/20 transition-colors text-sm"
                            >
                                <RiStarLine /> Register as Provider
                            </button>
                        </div>
                    </FadeUp>
                </div>
            </section>

            {/* â”€â”€ Content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
            <div className="three-xl-section-setup pb-24 space-y-8 pt-10">
                {/* Search + Tabs */}
                <FadeUp>
                    <div className="rounded-2xl border border-surface-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
                        {/* Search */}
                        <div className="relative">
                            <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-base pointer-events-none" />
                            <input
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                placeholder="Search posts, subjects, companies..."
                                className="w-full rounded-xl border border-surface-200 bg-surface-50 pl-10 pr-10 py-2.5 text-sm text-primary2-900 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary2-300 focus:border-primary2-300 transition-all"
                            />
                            {search && (
                                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary2-700 transition-colors">
                                    <RiCloseLine />
                                </button>
                            )}
                        </div>

                        {/* Tab Pills */}
                        <div className="flex flex-wrap gap-2">
                            {TABS.map((t) => (
                                <button
                                    key={t.key}
                                    onClick={() => handleTabChange(t.key)}
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all border ${tab === t.key
                                        ? "bg-primary2-800 text-white border-primary2-800 shadow-sm"
                                        : "border-surface-200 text-primary2-700 hover:border-primary2-300 hover:bg-primary2-50"
                                        }`}
                                >
                                    {t.icon} {t?.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </FadeUp>

                {/* Job Posts Grid */}
                {!isProviderTab && (
                    <>
                        <AnimatePresence mode="wait" key={`${tab}-${page}-${debouncedSearch}`}>
                            <motion.div
                                key="jobs-grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                            >
                                {jobsLoading
                                    ? Array.from({ length: 9 }).map((_, i) => <CardSkeleton key={i} />)
                                    : jobs.length === 0
                                        ? (
                                            <div className="col-span-full flex flex-col items-center gap-3 py-24 text-center">
                                                <div className="h-16 w-16 rounded-full bg-surface-100 flex items-center justify-center">
                                                    <RiBriefcaseLine className="text-2xl text-muted-foreground" />
                                                </div>
                                                <p className="text-base font-semibold text-primary2-900">No posts found</p>
                                                <p className="text-sm text-muted-foreground">Try a different search or tab</p>
                                            </div>
                                        )
                                        : jobs.map((job, i) => <JobCard key={job._id} job={job} index={i} />)
                                }
                            </motion.div>
                        </AnimatePresence>

                        {/* Pagination */}
                        {meta && meta.totalPage > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-1.5">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-surface-200 text-primary2-700 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <RiArrowLeftSLine className="text-lg" />
                                </button>
                                <span className="text-sm text-muted-foreground px-3">
                                    Page {page} of {meta.totalPage}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(meta.totalPage, p + 1))}
                                    disabled={page === meta.totalPage}
                                    className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-surface-200 text-primary2-700 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                >
                                    <RiArrowRightSLine className="text-lg" />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* Providers Grid */}
                {isProviderTab && (
                    <>
                        <AnimatePresence mode="wait" key={`providers-${providerPage}-${debouncedSearch}`}>
                            <motion.div
                                key="providers-grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                {providersLoading
                                    ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
                                    : providers.length === 0
                                        ? (
                                            <div className="col-span-full flex flex-col items-center gap-3 py-24 text-center">
                                                <div className="h-16 w-16 rounded-full bg-surface-100 flex items-center justify-center">
                                                    <RiUserLine className="text-2xl text-muted-foreground" />
                                                </div>
                                                <p className="text-base font-semibold text-primary2-900">No providers found</p>
                                                <p className="text-sm text-muted-foreground">Try a different search</p>
                                            </div>
                                        )
                                        : providers.map((p) => (
                                            <ProviderCard
                                                key={p._id}
                                                provider={p}
                                                onClick={() => router.push(`/jobs/providers/${p._id}`)}
                                            />
                                        ))
                                }
                            </motion.div>
                        </AnimatePresence>

                        {providerMeta && providerMeta.totalPage > 1 && (
                            <div className="mt-10 flex items-center justify-center gap-1.5">
                                <button onClick={() => setProviderPage((p) => Math.max(1, p - 1))} disabled={providerPage === 1} className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-surface-200 text-primary2-700 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                    <RiArrowLeftSLine className="text-lg" />
                                </button>
                                <span className="text-sm text-muted-foreground px-3">Page {providerPage} of {providerMeta.totalPage}</span>
                                <button onClick={() => setProviderPage((p) => Math.min(providerMeta.totalPage, p + 1))} disabled={providerPage === providerMeta.totalPage} className="inline-flex items-center justify-center h-9 w-9 rounded-xl border border-surface-200 text-primary2-700 hover:bg-surface-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                                    <RiArrowRightSLine className="text-lg" />
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* CTA Banner */}
                <FadeUp>
                    <div
                        className="relative overflow-hidden rounded-3xl p-8 text-white text-center"
                        style={{ background: "linear-gradient(145deg, #041a12 0%, #0c4a34 60%, #062319 100%)" }}
                    >
                        <div
                            className="absolute inset-0 pointer-events-none opacity-20"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                                backgroundSize: "40px 40px",
                            }}
                        />
                        <div className="absolute -top-12 right-12 h-32 w-32 rounded-full blur-2xl opacity-25" style={{ background: "rgba(245,158,11,1)" }} />
                        <div className="relative z-10">
                            <RiSparkling2Line className="text-3xl text-gold-300 mx-auto mb-3" />
                            <h3 className="text-xl font-bold mb-2">Are you a skilled alumni?</h3>
                            <p className="text-primary2-100/80 mb-6 max-w-xl mx-auto text-sm">
                                Register as a tutor or service provider and connect with alumni who need your expertise.
                            </p>
                            <button
                                onClick={() => router.push("/jobs/register-provider")}
                                className="inline-flex items-center gap-2 bg-white text-primary2-900 font-bold px-6 py-2.5 rounded-full hover:bg-surface-100 transition-colors text-sm"
                            >
                                Get Started <RiArrowRightLine />
                            </button>
                        </div>
                    </div>
                </FadeUp>
            </div>
        </div>
    );
}

