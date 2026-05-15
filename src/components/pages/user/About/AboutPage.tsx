"use client";

import AboutPageHead from "@/components/modules/user/about/AboutPageHead";
import AboutPageWhoWeAre from "@/components/modules/user/about/AboutPageWhoWeAre";
import AboutPageOurValue from "@/components/modules/user/about/AboutPageOurValue";
import AboutPageAlumniCommittee from "@/components/modules/user/about/AboutPageAlumniCommittee";
import AboutPageCTA from "@/components/modules/user/about/AboutPageCTA";

export default function AboutPage() {
    return (
        <div>
            {/* ══  HERO  */}
            <AboutPageHead />

            {/* ══ WHAT IS THIS PORTAL */}
            <AboutPageWhoWeAre />

            {/* ══ VALUES  */}
            <AboutPageOurValue />

            {/* ══ TEAM */}
            <AboutPageAlumniCommittee />

            {/* ══ CTA */}
            <AboutPageCTA />
        </div>
    );
}