"use client";

import { useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { motion, useInView } from "framer-motion";
import {
    RiGroupLine,
    RiMedalLine,
    RiStackLine,
    RiTeamLine,
    RiTrophyLine,
} from "react-icons/ri";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import HorizontalSnapCarousel from "@/components/shared/HorizontalSnapCarousel";
import BatchPageUsersTable from "@/components/modules/user/batches/BatchPageUsersTable";
import InputField from "@/components/shared/InputField";
import { Controller, useForm } from "react-hook-form";
import SingleSelect from "@/components/shared/SingleSelect";
import { constantsData } from "@/constants";
import { useGetActiveBatchesQuery } from "@/redux/apis/batchApi";
import { IBatchUserFilterValues } from "@/types/user/batch/batch.types";

/* ── FadeUp ─────────────────────────────────────────────── */
const FadeUp = ({
    children,
    delay = 0,
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay, ease: [0.19, 1, 0.22, 1] }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

/* ── Data ─────────────────────────────────────────────────── */
const decadeCards = [
    { era: "1966–1979", count: "Pioneering batches", note: "Founders who built the school culture from day one." },
    { era: "1980–1989", count: "Growth decade", note: "Science branch opens, enrollment triples." },
    { era: "1990–1999", count: "Alumni surge", note: "Professionals spread across Bangladesh and abroad." },
    { era: "2000–2009", count: "Digital generation", note: "First tech-savvy batch, early social media adopters." },
    { era: "2010–2019", count: "Scholarship era", note: "Alumni associations fund first university grants." },
    { era: "2020–now", count: "Portal generation", note: "This very platform launched for their engagement." },
];

const leadershipPods = [
    { title: "Batch Captains", detail: "Lead communication and coordinated reunion planning per batch year." },
    { title: "Mentorship Leads", detail: "Bridge senior alumni with fresh graduates in career and life." },
    { title: "Community Champions", detail: "Coordinate blood, emergency, and rapid support requests fast." },
    { title: "Scholarship Contacts", detail: "Drive student sponsorship pipelines and impact audit cycles." },
];

const leaderboardItems = [
    { rank: "01", title: "Most active batch", note: "Highest reunion attendance and event participation rate." },
    { rank: "02", title: "Highest donor batch", note: "Top contributor in blood and emergency relief fund." },
    { rank: "03", title: "Mentorship leader", note: "Most active cross-batch career guidance and job referrals." },
];

/* ── Page ─────────────────────────────────────────────────── */
const BatchesPage = () => {
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

    const bloodGroups = constantsData.BLOOD_GROUPS.map(bg => ({ label: bg, value: bg }));
    const bloodGroupOptions = [{ label: "All blood groups", value: "" }, ...bloodGroups];

    const batches = allActiveBatchesData?.data?.map(b => ({ label: b.year.toString(), value: b.year.toString() })) ?? [];
    const batchOptions = [{ label: "All batches", value: "" }, ...batches];

    const sections = constantsData.SECTIONS.map(s => ({ label: s.label, value: s.value }));
    const sectionOptions = [{ label: "All sections", value: "" }, ...sections];

    return (
        <div className="three-xl-section-setup pb-20 space-y-16">

            {/* ═══ 1. HERO ════════════════════════════════════════ */}
            <section className="relative overflow-hidden rounded-3xl"
                style={{ background: "linear-gradient(145deg, #041a12 0%, #0a3d2b 55%, #062319 100%)" }}>
                <div className="absolute inset-0 pointer-events-none opacity-25"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-25"
                    style={{ background: "rgba(46,139,87,1)" }} />
                <div className="absolute -bottom-12 left-1/3 h-48 w-48 rounded-full blur-3xl opacity-15"
                    style={{ background: "rgba(245,158,11,1)" }} />

                <div className="relative z-10 px-7 py-12 sm:px-12 sm:py-16">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
                        <Badge className="mb-5 bg-white/10 text-primary2-100 border-primary2-300/35 hover:bg-white/10">
                            <RiGroupLine className="mr-1.5" /> Batch Universe
                        </Badge>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
                            Every batch,{" "}
                            <span className="text-primary2-300">one connected ecosystem</span>
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm sm:text-lg text-primary2-100/75 leading-relaxed">
                            Map alumni by era, enable batch-led initiatives, and unlock collaboration patterns spanning six decades of graduating classes.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary2-900 mb-5">Batch Directory</h2>
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
            </div>


            {/* ═══ 2. DECADE NAVIGATOR (shadcn Carousel) ══════════ */}
            <FadeUp>
                <div className="mb-5">
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary2-900">Decade Navigator</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Jump across six graduation eras with smooth swipe navigation.</p>
                </div>
                <HorizontalSnapCarousel>
                    {decadeCards.map((card) => (
                        <Card key={card.era} className="h-full border-surface-300/60 hover:-translate-y-1 transition-transform duration-200">
                            <CardContent className="p-6">
                                <div className="h-12 w-12 rounded-2xl bg-primary2-100 flex items-center justify-center text-primary2-700 text-2xl">
                                    <RiStackLine />
                                </div>
                                <h3 className="mt-5 text-lg font-bold text-primary2-900">{card.era}</h3>
                                <p className="mt-1 text-xs font-medium text-primary2-600 uppercase tracking-[0.1em]">{card.count}</p>
                                <Separator className="my-3" />
                                <p className="text-sm text-muted-foreground leading-relaxed">{card.note}</p>
                            </CardContent>
                        </Card>
                    ))}
                </HorizontalSnapCarousel>
            </FadeUp>

            {/* ═══ 3. LEADERBOARD ════════════════════════════════ */}
            <FadeUp>
                <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-primary2-900">Batch Leaderboards</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Dynamic ranking widgets ready for live data injection.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {leaderboardItems.map((item, idx) => (
                        <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.08 }}>
                            <Card className="h-full border-surface-300/60 hover:-translate-y-1 transition-transform duration-200">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-3">
                                        <span className="text-4xl font-black text-primary2-100">{item.rank}</span>
                                        <RiTrophyLine className="text-xl text-primary2-700" />
                                    </div>
                                    <h3 className="mt-3 text-base font-semibold text-primary2-900">{item.title}</h3>
                                    <p className="mt-2 text-sm text-muted-foreground">{item.note}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </FadeUp>

            {/* ═══ 4. LEADERSHIP PODS + REUNION ENGINE ════════════ */}
            <FadeUp>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <Card className="border-surface-300/60">
                        <CardContent className="p-6 sm:p-8">
                            <h3 className="text-xl font-bold text-primary2-900">Batch Leadership Pods</h3>
                            <p className="mt-2 text-sm text-muted-foreground">Dedicated role definitions for alumni who lead from the front.</p>
                            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {leadershipPods.map(({ title, detail }) => (
                                    <div key={title} className="rounded-xl border border-surface-300/60 bg-primary2-50/50 p-4">
                                        <p className="text-sm font-semibold text-primary2-900">{title}</p>
                                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">{detail}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-surface-300/60">
                        <CardContent className="p-6 sm:p-8 flex flex-col">
                            <h3 className="text-xl font-bold text-primary2-900">Reunion Engine</h3>
                            <p className="mt-2 text-sm text-muted-foreground flex-1">
                                Plan year-wise reunions with budget lanes, stage slots, and memory booth scheduling built in.
                            </p>
                            <div className="mt-5 rounded-xl border border-primary2-200 bg-primary2-50 p-4 flex items-start gap-2 text-sm text-primary2-900">
                                <RiTeamLine className="text-lg mt-0.5 shrink-0 text-primary2-700" />
                                Reunion lifecycle modules — proposal to post-event archive — can be plugged in seamlessly.
                            </div>
                            <Button className="mt-5 w-full bg-primary2-700 hover:bg-primary2-800 text-white">
                                Open Batch Workspace
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </FadeUp>

            {/* ═══ 5. UPGRADE BANNER ═══════════════════════════════ */}
            <FadeUp>
                <div className="rounded-3xl border border-primary2-200/60 px-6 py-5 flex flex-wrap items-center gap-3"
                    style={{ background: "linear-gradient(135deg, rgba(46,139,87,0.07) 0%, rgba(126,158,37,0.05) 100%)" }}>
                    <RiMedalLine className="text-primary2-700 text-xl shrink-0" />
                    <p className="text-sm text-primary2-900 flex-1 min-w-0">
                        <strong>Next upgrade-ready:</strong> batch directory search, verified alumni lists, cross-batch collaboration rooms, and decade-wise impact reports.
                    </p>
                </div>
            </FadeUp>
        </div>
    );
};

export default BatchesPage;
