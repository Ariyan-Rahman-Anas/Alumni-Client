"use client"

import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import SectionLabel from "@/components/shared/SectionLabel"
import { constantsData } from "@/constants";
import { useGetPublishedAnnouncementsQuery } from "@/redux/apis/announcementApi";
import { RiErrorWarningLine, RiFileListLine, RiMegaphoneLine, RiPushpin2Line } from "react-icons/ri"

//    STATS PILL
function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
    return (
        <div className="flex items-center justify-between gap-2 rounded-xl bg-white dark:bg-gunmetal-500 border border-surface-200 px-4 py-2.5 shadow-sm">
            <div className="flex items-end gap-1">
                <span className="text-primary2-600 text-base">{icon}</span>
                <p className="text-sm font-semibold text-black dark:text-gunmetal-200 leading-none">{label}</p>
            </div>
            <p className="text-sm font-bold text-primary2-900 dark:text-gunmetal-200 leading-tight mt-0.5">{value}</p>
        </div>
    );
}

const AnnouncementsPageHead = () => {
    // Stats query — all published, no filter
    const { data: statsData } = useGetPublishedAnnouncementsQuery({ limit: 100 });
    const allItems = statsData?.data ?? [];
    const urgentCount = allItems.filter((a) => a.priority === constantsData.announcement.priority.URGENT).length;
    const pinnedCount = allItems.filter((a) => a.isPinned).length;
    const totalCount = statsData?.meta?.total ?? 0;

    return (
        <section className="three-xl-section-setup">
            <FadeUpWrapper delay={0.1}
                className="relative overflow-hidden rounded-3xl"
                style={{ background: "linear-gradient(145deg, #041a12 0%, #0c4a34 55%, #062319 100%)" }}
            >
                <div
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
                <div
                    className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-25"
                    style={{ background: "rgba(46,139,87,1)" }}
                />
                <div
                    className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full blur-3xl opacity-20"
                    style={{ background: "rgba(245,158,11,1)" }}
                />

                <div className="relative z-10 three-xl-section-padding ">
                    <FadeUpWrapper
                        delay={0.15}
                    >
                        <SectionLabel text="Announcements & Notices" align="left" icon={<RiMegaphoneLine />}
                            className="text-primary2-300 dark:text-gunmetal-300 border-primary2-600 dark:border-gunmetal-400 " />
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mt-5 text-white dark:text-gunmetal-200 leading-tight max-w-3xl">
                            Signal Center{" "}
                            <span className="text-primary2-300 dark:text-primary">for Alumni Updates</span>
                        </h1>
                        <p className="text-base sm:text-lg leading-relaxed max-w-4xl text-gunmetal-300 mb-12 mt-5">
                            Stay informed with official updates, event notices, and important communications from the alumni board.
                        </p>
                    </FadeUpWrapper>

                    <FadeUpWrapper
                        delay={0.25}
                        className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl"
                    >
                        <StatPill icon={<RiFileListLine />} label="Total" value={totalCount} />
                        {urgentCount > 0 && (
                            <StatPill icon={<RiErrorWarningLine className="text-danger" />} label="Urgent" value={urgentCount} />
                        )}
                        {pinnedCount > 0 && (
                            <StatPill icon={<RiPushpin2Line className="text-warning" />} label="Pinned" value={pinnedCount} />
                        )}
                    </FadeUpWrapper>
                </div>
            </FadeUpWrapper>
        </section>
    )
}
export default AnnouncementsPageHead