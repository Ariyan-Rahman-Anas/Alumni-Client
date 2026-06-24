import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import { useGetAllPublishedEventsQuery } from "@/redux/apis/eventApi";

const EventPageStayConnectedCTA = () => {
    const { data: upcomingData } = useGetAllPublishedEventsQuery({ page: 1, limit: 1, status: "UPCOMING" });
    const { data: totalData } = useGetAllPublishedEventsQuery({ page: 1, limit: 1 });

    const upcomingCount = upcomingData?.meta?.total ?? 0;
    const totalCount = totalData?.meta?.total ?? 0;

    return (
        <FadeUpWrapper className="three-xl-section-setup">
            <div
                className="relative overflow-hidden rounded-3xl"
                style={{ background: "linear-gradient(135deg, #041a12 0%, #0c4a34 60%, #1a5436 100%)" }}
            >
                {/* Background grid texture */}
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
                        backgroundSize: "48px 48px",
                    }}
                />

                <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-12">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">

                        {/* ── Left content ── */}
                        <div className="flex-1">
                            <h2 className="mt-5 text-2xl sm:text-3xl font-bold text-white dark:text-gunmetal-200 leading-snug max-w-xl">
                                Events built on{" "}
                                <span className="text-primary2-300 dark:text-primary">Real Alumni bonds</span>
                            </h2>
                            <p className="text-base sm:text-lg leading-relaxed max-w-2xl text-gunmetal-300 mt-5 mb-8">
                                Every gathering here is an opportunity to mentor, to reconnect, and to give back to the school that shaped you.
                            </p>
                        </div>

                        {/* ── Right content ── */}
                        <div className="flex gap-4 items-center justify-center shrink-0">
                            {[
                                { value: totalCount > 0 ? `${totalCount}+` : "—", label: "Events hosted" },
                                { value: upcomingCount > 0 ? `${upcomingCount}` : "—", label: "Upcoming" },
                            ].map(({ value, label }) => (
                                <div
                                    key={label}
                                    className="rounded-2xl min-w-28 border px-5 py-4 text-center"
                                    style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)" }}
                                >
                                    <p className="text-2xl font-bold text-white dark:text-gunmetal-200">{value}</p>
                                    <p className="mt-0.5 text-xs text-gunmetal-200 dark:text-gunmetal-300">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </FadeUpWrapper>
    )
}
export default EventPageStayConnectedCTA