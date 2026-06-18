"use client";

import {
    RiCalendarCheckLine,
    RiLoginCircleLine,
    RiSearch2Line,
    RiArrowRightLine,
} from "react-icons/ri";
import { FadeUpWrapper } from "../Home/HomePage";
import EventPageEvents from "@/components/modules/user/events/EventPageEvents";
import { useGetAllPublishedEventsQuery } from "@/redux/apis/eventApi";

const HOW_IT_WORKS = [
    {
        step: "01",
        icon: <RiSearch2Line />,
        title: "Browse & Filter",
        desc: "Explore upcoming reunions, career fairs, cultural nights, and community drives — filtered by category, format, or status.",
    },
    {
        step: "02",
        icon: <RiCalendarCheckLine />,
        title: "Register Your Spot",
        desc: "Secure your place with a single click. Registered events appear in your profile dashboard for easy tracking.",
    },
    {
        step: "03",
        icon: <RiLoginCircleLine />,
        title: "Show Up & Connect",
        desc: "Attend in-person or join online. Reconnect with batchmates, build new bridges, and carry the BAMHS spirit forward.",
    },
];

/* ── Page ─────────────────────────────────────────────────── */
const EventsPage = () => {
    const { data: upcomingData } = useGetAllPublishedEventsQuery({ page: 1, limit: 1, status: "UPCOMING" });
    const { data: totalData } = useGetAllPublishedEventsQuery({ page: 1, limit: 1 });

    const upcomingCount = upcomingData?.meta?.total ?? 0;
    const totalCount = totalData?.meta?.total ?? 0;

    return (
        <div className="three-xl-section-setup pb-20 space-y-16">

            {/* ═══ 1. UPCOMING EVENTS ═════════════════════════════ */}
            <EventPageEvents />

            {/* ═══ 2. HOW TO PARTICIPATE ══════════════════════════ */}
            <FadeUpWrapper>
                <div className="space-y-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-primary2-900 dark:text-gunmetal-100">
                            How to Participate
                        </h2>
                        <p className="mt-1.5 text-muted-foreground">
                            Three simple steps to go from discovering an event to being part of the memory.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {HOW_IT_WORKS.map(({ step, icon, title, desc }) => (
                            <div
                                key={step}
                                className="relative rounded-2xl shadow p-6 flex flex-col gap-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="w-11 h-11 rounded-xl bg-primary2-50 dark:bg-primary2-900/40 flex items-center justify-center text-primary2-600 dark:text-primary2-400 text-xl">
                                        {icon}
                                    </div>
                                    <span className="text-4xl font-black text-primary2-100 dark:text-gunmetal-600 leading-none select-none">
                                        {step}
                                    </span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-primary2-900 dark:text-gunmetal-100">{title}</h3>
                                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </FadeUpWrapper>

            {/* ═══ 3. STAY CONNECTED CTA ══════════════════════════ */}
            <FadeUpWrapper>
                <div
                    className="relative overflow-hidden rounded-3xl px-8 py-10 sm:px-12 sm:py-12"
                    style={{ background: "linear-gradient(135deg, #041a12 0%, #0c4a34 60%, #1a5436 100%)" }}
                >
                    {/* Background texture */}
                    <div
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
                            backgroundSize: "48px 48px",
                        }}
                    />
                    <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl opacity-15" style={{ background: "rgba(46,139,87,1)" }} />

                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                        {/* Left */}
                        <div className="max-w-lg">
                            <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug">
                                Events built on{" "}
                                <span className="text-primary2-300">real alumni bonds</span>
                            </h2>
                            <p className="mt-3 text-sm text-gunmetal-300 leading-relaxed">
                                Every gathering here is an opportunity to mentor, to reconnect, and to give back to the school that shaped you.
                            </p>
                        </div>

                        {/* Right — live stats */}
                        <div className="flex gap-4 shrink-0">
                            {[
                                { value: totalCount > 0 ? `${totalCount}+` : "—", label: "Events hosted" },
                                { value: upcomingCount > 0 ? `${upcomingCount}` : "—", label: "Upcoming" },
                            ].map(({ value, label }) => (
                                <div
                                    key={label}
                                    className="rounded-2xl min-w-28 border px-5 py-4 text-center"
                                    style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)" }}
                                >
                                    <p className="text-2xl font-bold text-white">{value}</p>
                                    <p className="mt-0.5 text-xs text-gunmetal-300">{label}</p>
                                </div>
                            ))}
                            <div
                                className="hidden sm:flex rounded-2xl min-w-28 border px-5 py-4 text-center items-center justify-center"
                                style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)" }}
                            >
                                <RiArrowRightLine className="text-2xl text-primary2-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </FadeUpWrapper>

        </div>
    );
};
export default EventsPage;
