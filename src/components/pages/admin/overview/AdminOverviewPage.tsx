"use client";

import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import {
    RiGroupLine, RiCheckLine, RiCalendarLine, RiCheckboxCircleLine,
    RiBriefcaseLine, RiChat3Line, RiMailLine, RiGlobalLine, RiArrowRightLine,
    RiMegaphoneLine, RiImageLine, RiHeartPulseLine, RiMapPinLine,
} from "react-icons/ri";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip,
    Legend, ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart,
} from "recharts";

import AdminPageHead from "@/components/shared/admin/AdminPageHead";
import StatCard from "@/components/shared/admin/StatCard";
import { useGetAdminStatsQuery } from "@/redux/apis/statsApi";

/* ---------------------------------------------------------- */
/*  Palette                                                   */
/* ---------------------------------------------------------- */
const PIE_COLORS_USER = ["#f59e0b", "#10b981", "#ef4444"];
const PIE_COLORS_JOB = ["#f59e0b", "#3b82f6", "#ef4444", "#6b7280"];
const BAR_COLORS = { Science: "#3b82f6", Commerce: "#10b981", Arts: "#f59e0b" };

/* ---------------------------------------------------------- */
/*  Sub-components                                            */
/* ---------------------------------------------------------- */

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">{children}</h2>;
}

function Card({ className = "", children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={`bg-white dark:bg-gunmetal-800 rounded-2xl border border-surface-200 dark:border-gunmetal-700 p-5 ${className}`}>
            {children}
        </div>
    );
}

function SkeletonBlock({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
    return <div className={`rounded-xl bg-surface-100 dark:bg-gunmetal-700 animate-pulse ${className}`} style={style} />;
}

/* Action Card --------------------------------------------- */
function ActionCard({ label, count, icon, href, color, textColor }: {
    label: string; count?: number; icon: React.ReactNode;
    href: string; color: string; textColor: string;
}) {
    return (
        <Link href={href} className="flex items-center justify-between gap-3 p-4 rounded-2xl border border-surface-200 dark:border-gunmetal-700 bg-white dark:bg-gunmetal-800 hover:shadow-md transition-all group">
            <div className="flex items-center gap-3">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
                <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium leading-none mb-1">{label}</p>
                    <p className={`text-2xl font-bold ${textColor}`}>{count ?? 0}</p>
                </div>
            </div>
            <RiArrowRightLine className="text-muted-foreground group-hover:translate-x-1 transition-transform shrink-0" />
        </Link>
    );
}

/* Custom Recharts Tooltip --------------------------------- */
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; fill: string; color: string }[]; label?: string }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white dark:bg-gunmetal-700 border border-surface-200 dark:border-gunmetal-600 rounded-xl shadow-xl p-3 text-sm min-w-[130px]">
            {label && <p className="font-semibold text-gray-800 dark:text-white mb-2 text-xs uppercase tracking-wide">{label}</p>}
            {payload.map((p) => (
                <div key={p.name} className="flex items-center justify-between gap-4">
                    <span className="flex items-center gap-1.5" style={{ color: p.fill ?? p.color }}>
                        <span className="w-2 h-2 rounded-full inline-block" style={{ background: p.fill ?? p.color }} />
                        {p.name}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">{p.value}</span>
                </div>
            ))}
        </div>
    );
}

/* Donut legend item --------------------------------------- */
function DonutLegend({ items }: { items: { name: string; value: number; color: string }[] }) {
    const total = items.reduce((s, i) => s + i.value, 0);
    return (
        <ul className="space-y-2 mt-4">
            {items.map((item) => (
                <li key={item.name} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: item.color }} />
                        <span className="text-gray-600 dark:text-gunmetal-200">{item.name}</span>
                    </span>
                    <span className="font-semibold text-gray-800 dark:text-white tabular-nums">
                        {item.value}
                        <span className="ml-1 text-xs text-muted-foreground font-normal">
                            ({total ? Math.round((item.value / total) * 100) : 0}%)
                        </span>
                    </span>
                </li>
            ))}
        </ul>
    );
}

/* ---------------------------------------------------------- */
/*  Main Page                                                 */
/* ---------------------------------------------------------- */
const AdminOverviewPage = () => {
    const { data: statsResponse, isLoading } = useGetAdminStatsQuery();
    const s = statsResponse?.data;

    /* Stat cards */
    const statCards = [
        { label: "Total Users", value: s?.users.total, icon: <RiGroupLine className="text-xl text-blue-600" />, color: "bg-blue-50" },
        { label: "Approved Members", value: s?.users.approved, icon: <RiCheckLine className="text-xl text-emerald-600" />, color: "bg-emerald-50" },
        { label: "Email Verified", value: s?.users.verified, icon: <RiCheckboxCircleLine className="text-xl text-violet-600" />, color: "bg-violet-50" },
        { label: "Total Batches", value: s?.batches.total, icon: <RiCalendarLine className="text-xl text-sky-600" />, color: "bg-sky-50" },
        { label: "Total Events", value: s?.events?.total, icon: <RiCalendarLine className="text-xl text-teal-600" />, color: "bg-teal-50" },
        { label: "Announcements", value: s?.announcements?.total, icon: <RiMegaphoneLine className="text-xl text-orange-500" />, color: "bg-orange-50" },
        { label: "Gallery Photos", value: s?.gallery?.total, icon: <RiImageLine className="text-xl text-pink-600" />, color: "bg-pink-50" },
        { label: "Blood Donors", value: s?.bloodDonors?.total, icon: <RiHeartPulseLine className="text-xl text-red-600" />, color: "bg-red-50" },
    ];

    /* Donut data */
    const userPie = [
        { name: "Pending", value: s?.users.pending ?? 0, color: PIE_COLORS_USER[0] },
        { name: "Approved", value: s?.users.approved ?? 0, color: PIE_COLORS_USER[1] },
        { name: "Rejected", value: s?.users.rejected ?? 0, color: PIE_COLORS_USER[2] },
    ];
    const jobPie = [
        { name: "Pending", value: s?.jobs?.pending ?? 0, color: PIE_COLORS_JOB[0] },
        { name: "Approved", value: s?.jobs?.approved ?? 0, color: PIE_COLORS_JOB[1] },
        { name: "Rejected", value: s?.jobs?.rejected ?? 0, color: PIE_COLORS_JOB[2] },
        { name: "Closed", value: s?.jobs?.closed ?? 0, color: PIE_COLORS_JOB[3] },
    ];

    /* Batch bar chart */
    const batchData = (s?.batchesSection ?? []).slice().reverse().map((b) => ({
        year: String(b.year),
        Science: b.scienceCount,
        Commerce: b.commerceCount,
        Arts: b.artsCount,
    }));

    /* Monthly trend */
    const trend = s?.monthlyRegistrations ?? [];
    const topCountries = (s?.countries ?? []).slice(0, 10);
    const upcomingEvents = s?.events?.upcoming ?? [];

    return (
        <div>
            <AdminPageHead title="Overview" description="Application statistics at a glance." />

            <div className="admin-page-setup space-y-8">
                {/* -- Stat Cards ------------------------------------ */}
                <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-4 gap-4">
                    {statCards.map((card) => (
                        <StatCard key={card.label} {...card} isLoading={isLoading} />
                    ))}
                </div>

                {/* -- Pending Actions ------------------------------- */}
                <div>
                    <SectionTitle>Pending Actions</SectionTitle>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <ActionCard label="Users" count={s?.users.pending} icon={<RiGroupLine className="text-amber-600 text-lg" />} href="/admin/users?status=PENDING" color="bg-amber-50" textColor="text-amber-600" />
                        <ActionCard label="Job Posts" count={s?.jobs?.pending} icon={<RiBriefcaseLine className="text-blue-600 text-lg" />} href="/admin/jobs" color="bg-blue-50" textColor="text-blue-600" />
                        <ActionCard label="Testimonials" count={s?.testimonials?.pending} icon={<RiChat3Line className="text-violet-600 text-lg" />} href="/admin/testimonials" color="bg-violet-50" textColor="text-violet-600" />
                        <ActionCard label="Requests" count={s?.requests?.pending} icon={<RiMailLine className="text-rose-600 text-lg" />} href="/admin/requests" color="bg-rose-50" textColor="text-rose-600" />
                    </div>
                </div>

                {/* -- Row: Registration Trend + User Donut + Job Donut -- */}
                <div>
                    <SectionTitle>Distribution & Trends</SectionTitle>
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px_240px] gap-5">
                        {/* Monthly registrations area chart */}
                        <Card>
                            <p className="text-sm font-semibold text-gray-700 dark:text-white mb-4">New Registrations (Last 6 Months)</p>
                            {isLoading ? <SkeletonBlock className="h-52" /> : (
                                <ResponsiveContainer width="100%" height={200}>
                                    <AreaChart data={trend} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.18} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                                        <RTooltip content={<ChartTooltip />} />
                                        <Area type="monotone" dataKey="count" name="Registrations" stroke="#3b82f6" strokeWidth={2} fill="url(#regGrad)" dot={{ r: 4, fill: "#3b82f6" }} activeDot={{ r: 6 }} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </Card>

                        {/* User status donut */}
                        <Card className="flex flex-col">
                            <p className="text-sm font-semibold text-gray-700 dark:text-white mb-1">User Status</p>
                            {isLoading ? <SkeletonBlock className="h-40 mt-2" /> : (
                                <>
                                    <ResponsiveContainer width="100%" height={140}>
                                        <PieChart>
                                            <Pie data={userPie} cx="50%" cy="50%" innerRadius={42} outerRadius={62} dataKey="value" paddingAngle={3}>
                                                {userPie.map((e) => <Cell key={e.name} fill={e.color} />)}
                                            </Pie>
                                            <RTooltip content={<ChartTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <DonutLegend items={userPie} />
                                </>
                            )}
                        </Card>

                        {/* Job status donut */}
                        <Card className="flex flex-col">
                            <p className="text-sm font-semibold text-gray-700 dark:text-white mb-1">Job Status</p>
                            {isLoading ? <SkeletonBlock className="h-40 mt-2" /> : (
                                <>
                                    <ResponsiveContainer width="100%" height={140}>
                                        <PieChart>
                                            <Pie data={jobPie} cx="50%" cy="50%" innerRadius={42} outerRadius={62} dataKey="value" paddingAngle={3}>
                                                {jobPie.map((e) => <Cell key={e.name} fill={e.color} />)}
                                            </Pie>
                                            <RTooltip content={<ChartTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <DonutLegend items={jobPie} />
                                </>
                            )}
                        </Card>
                    </div>
                </div>

                {/* -- Row: Batch Chart + Countries + Upcoming Events -- */}
                <div>
                    <SectionTitle>Members, Geography & Events</SectionTitle>
                    <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px_280px] gap-5">
                        {/* Batch breakdown bar chart */}
                        <Card>
                            <p className="text-sm font-semibold text-gray-700 dark:text-white mb-4">Alumni by Batch & Section</p>
                            {isLoading ? <SkeletonBlock className="h-64" /> : batchData.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-16">No batch data</p>
                            ) : (
                                <ResponsiveContainer width="100%" height={260}>
                                    <BarChart data={batchData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                        <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 11 }} />
                                        <RTooltip content={<ChartTooltip />} />
                                        <Legend wrapperStyle={{ fontSize: 12 }} />
                                        <Bar dataKey="Science" fill={BAR_COLORS.Science} radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Commerce" fill={BAR_COLORS.Commerce} radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="Arts" fill={BAR_COLORS.Arts} radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </Card>

                        {/* Top countries */}
                        <Card>
                            <p className="text-sm font-semibold text-gray-700 dark:text-white mb-4 flex items-center gap-2">
                                <RiGlobalLine className="text-primary2-500" /> Top Countries
                            </p>
                            {isLoading ? (
                                <div className="space-y-3">
                                    {Array.from({ length: 8 }).map((_, i) => (
                                        <SkeletonBlock key={i} className="h-3.5" style={{ width: `${85 - i * 7}%` } as React.CSSProperties} />
                                    ))}
                                </div>
                            ) : topCountries.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">No data</p>
                            ) : (
                                <ol className="space-y-2.5">
                                    {topCountries.map((c, i) => (
                                        <li key={c.country} className="flex items-center gap-2 text-sm">
                                            <span className="text-xs text-muted-foreground w-4 text-right shrink-0">{i + 1}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-0.5">
                                                    <span className="text-gray-700 dark:text-gunmetal-100 truncate text-xs font-medium">{c.country}</span>
                                                    <span className="font-bold text-primary2-700 dark:text-primary2-400 tabular-nums text-xs ml-2">{c.count}</span>
                                                </div>
                                                <div className="h-1 rounded-full bg-surface-100 dark:bg-gunmetal-700 overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full bg-primary2-400"
                                                        style={{ width: `${Math.round((c.count / (topCountries[0]?.count || 1)) * 100)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </Card>

                        {/* Upcoming events */}
                        <Card>
                            <p className="text-sm font-semibold text-gray-700 dark:text-white mb-4 flex items-center gap-2">
                                <RiCalendarLine className="text-teal-500" /> Upcoming Events
                            </p>
                            {isLoading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => <SkeletonBlock key={i} className="h-16" />)}
                                </div>
                            ) : upcomingEvents.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-8">No upcoming events</p>
                            ) : (
                                <div className="space-y-3">
                                    {upcomingEvents.map((ev) => (
                                        <div key={ev._id} className="flex gap-3 items-start p-3 rounded-xl border border-surface-100 dark:border-gunmetal-700 bg-surface-50/50 dark:bg-gunmetal-700/30">
                                            {ev.coverImage ? (
                                                <Image src={ev.coverImage} alt={ev.title} width={44} height={44} className="rounded-lg object-cover shrink-0 w-11 h-11" />
                                            ) : (
                                                <div className="w-11 h-11 rounded-lg bg-teal-100 flex items-center justify-center shrink-0">
                                                    <RiCalendarLine className="text-teal-600 text-lg" />
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="text-sm font-semibold text-gray-800 dark:text-white line-clamp-1">{ev.title}</p>
                                                <p className="text-xs text-primary2-600 dark:text-primary2-400 font-medium mt-0.5">
                                                    {format(new Date(ev.startDateTime), "dd MMM yyyy, hh:mm a")}
                                                </p>
                                                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                    <RiMapPinLine /> {ev.venue}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default AdminOverviewPage;