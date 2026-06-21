"use client";

import {
    RiCalendarCheckLine,
    RiLoginCircleLine,
    RiSearch2Line,
} from "react-icons/ri";
import { FadeUpWrapper } from "../Home/HomePage";
import EventPageEvents from "@/components/modules/user/events/EventPageEvents";
import EventPageStayConnectedCTA from "@/components/modules/user/events/EventPageStayConnectedCTA";

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

    return (
        <div>
            {/* ═══ 1. UPCOMING EVENTS ═════════════════════════════ */}
            <EventPageEvents />

            {/* ═══ 2. HOW TO PARTICIPATE ══════════════════════════ */}
            <FadeUpWrapper className="space-y-8 three-xl-section-setup">
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
            </FadeUpWrapper>

            {/* ═══ 3. STAY CONNECTED CTA  */}
            <EventPageStayConnectedCTA />
        </div>
    );
};
export default EventsPage;
