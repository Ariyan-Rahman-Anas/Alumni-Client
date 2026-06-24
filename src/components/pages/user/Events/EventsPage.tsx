"use client";

import EventPageEvents from "@/components/modules/user/events/EventPageEvents";
import EventPageStayConnectedCTA from "@/components/modules/user/events/EventPageStayConnectedCTA";
import EventPageHowToParticipate from "@/components/modules/user/events/EventPageHowToParticipate";

const EventsPage = () => {
    return (
        <div>
            {/* ═══ 1. UPCOMING EVENTS  */}
            <EventPageEvents />

            {/* ═══ 2. HOW TO PARTICIPATE */}
            <EventPageHowToParticipate />

            {/* ═══ 3. STAY CONNECTED CTA  */}
            <EventPageStayConnectedCTA />
        </div>
    );
};
export default EventsPage;