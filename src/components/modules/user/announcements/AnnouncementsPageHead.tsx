import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import SectionLabel from "@/components/shared/SectionLabel"
import { useGetPublishedAnnouncementsQuery } from "@/redux/apis/announcementApi";
import { RiErrorWarningLine, RiFileListLine, RiMegaphoneLine, RiPushpin2Line } from "react-icons/ri"

//    STATS PILL
function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
    return (
        <div className="flex items-center gap-2 rounded-xl bg-white border border-surface-200 px-4 py-2.5 shadow-sm">
            <span className="text-primary2-600 text-base">{icon}</span>
            <div>
                <p className="text-xs text-muted-foreground leading-none">{label}</p>
                <p className="text-sm font-bold text-primary2-900 leading-tight mt-0.5">{value}</p>
            </div>
        </div>
    );
}

const AnnouncementsPageHead = () => {
    // Stats query â€” all published, no filter
    const { data: statsData } = useGetPublishedAnnouncementsQuery({ limit: 100 });
    const allItems = statsData?.data ?? [];
    const urgentCount = allItems.filter((a) => a.priority === "urgent").length;
    const pinnedCount = allItems.filter((a) => a.isPinned).length;
    const totalCount = statsData?.meta?.total ?? 0;

    return (
        <FadeUpWrapper delay={0.1}>
            <section
                className="relative overflow-hidden rounded-3xl"
                style={{ background: "linear-gradient(145deg, var(--color-primary-950) 0%, var(--color-primary-800) 55%, var(--color-primary-950) 100%)" }}
            >
                <div
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
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

                <div className="relative z-10 px-7 py-12 sm:px-12 sm:py-16">
                    <FadeUpWrapper
                        delay={0.15}
                    >
                        <SectionLabel text="Announcements & Notices" align="left" icon={<RiMegaphoneLine />} className="text-primary2-200 mb-2 capitalize " />
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
                            Signal Center{" "}
                            <span className="text-primary2-300">for Alumni Updates</span>
                        </h1>
                        <p className="mt-5 max-w-2xl text-sm sm:text-lg text-primary2-100/75 leading-relaxed">
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
            </section>
        </FadeUpWrapper>
    )
}
export default AnnouncementsPageHead