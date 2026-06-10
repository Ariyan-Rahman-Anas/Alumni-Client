"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
    RiShieldCheckLine,
    RiUserLine,
    RiDatabase2Line,
    RiShareLine,
    RiLockLine,
    RiSettings3Line,
    RiUserSettingsLine,
    RiShieldUserLine,
    RiRefreshLine,
    RiMailLine,
    RiCalendarLine,
} from "react-icons/ri";
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import GoBackward from "@/components/shared/GoBackward";
import SectionLabel from "@/components/shared/SectionLabel";
import { useGetWebsiteManagementQuery } from "@/redux/apis/websiteManagementApi";

/* ── Types ───────────────────────────────────────────────── */
interface Section {
    id: string;
    title: string;
    icon: React.ReactNode;
}

/* ── TOC data ─────────────────────────────────────────────── */
const sections: Section[] = [
    { id: "information-we-collect", title: "Information We Collect", icon: <RiDatabase2Line /> },
    { id: "how-we-use", title: "How We Use Your Information", icon: <RiUserLine /> },
    { id: "information-sharing", title: "Information Sharing", icon: <RiShareLine /> },
    { id: "data-security", title: "Data Security", icon: <RiLockLine /> },
    { id: "cookies", title: "Cookies & Tracking", icon: <RiSettings3Line /> },
    { id: "your-rights", title: "Your Rights", icon: <RiUserSettingsLine /> },
    { id: "childrens-privacy", title: "Children's Privacy", icon: <RiShieldUserLine /> },
    { id: "policy-changes", title: "Changes to This Policy", icon: <RiRefreshLine /> },
    { id: "contact", title: "Contact Us", icon: <RiMailLine /> },
];

/* ── Section wrapper ──────────────────────────────────────── */
function PolicySection({
    id,
    title,
    icon,
    children,
    className = "",
}: {
    id: string;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: "-100px" });
    return (
        <motion.section
            id={id}
            ref={ref}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
            className={`scroll-mt-24 mb-14 text-gunmetal-300 ${className}`}
        >
            <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary2-50 text-primary2-600 text-lg border border-primary2-100 flex-shrink-0">
                    {icon}
                </span>
                <h2 className="text-xl font-bold text-primary2-900 dark:text-gunmetal-200">{title}</h2>
            </div>
            <div className={`pl-12 space-y3 text-sm leading-relaxed ${className}`}>
                {children}
            </div>
        </motion.section>
    );
}

/* ── Prose helpers ────────────────────────────────────────── */
const P = ({ children, className }: { children: React.ReactNode; className?: string }) => (
    <p className={`font-semibold leading-relaxed ${className ?? ""}`}>{children}</p>
);

const UL = ({ items }: { items: string[] }) => (
    <ul className="space-y-2 mt-2">
        {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-gunmetal-300">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary2-400 flex-shrink-0" />
                <span>{item}</span>
            </li>
        ))}
    </ul>
);

const Divider = () => (<div className="border-t border-gunmetal-100 dark:border-gunmetal-400 mb-14" />
);

const SubHeading = ({ children }: { children: React.ReactNode }) => (
    <h3 className="font-semibold text-primary2-800 mt-5 mb-2">{children}</h3>
);

/* ── Main component ───────────────────────────────────────── */
export default function PrivacyPage() {
    const { data: websiteManagement } = useGetWebsiteManagementQuery();

    const { schoolName, postalCode, area, thana, district, division, country, email } =
        websiteManagement?.data || {};
    const schoolShortName = schoolName?.split(" ")?.map((word: string) => word[0]).join("") || "BAMHS";

    const schoolAddress = `${postalCode ?? "3582"} - ${area ?? "Battali"}, ${thana ?? "Nangalkot"}, ${district ?? "Cumilla"}, ${division ?? "Chattogram"}, ${country ?? "Bangladesh"}`;

    const [activeSection, setActiveSection] = useState<string>(sections[0].id);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];
        sections.forEach(({ id }) => {
            const el = document.getElementById(id);
            if (!el) return;
            const obs = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting) setActiveSection(id);
                },
                { rootMargin: "-30% 0px -60% 0px" }
            );
            obs.observe(el);
            observers.push(obs);
        });
        return () => observers.forEach((o) => o.disconnect());
    }, []);

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <div>
            {/* ── Hero ────────────────────────────────────────── */}
            <FadeUpWrapper className="three-xl-section-setup">
                <section
                    className="relative overflow-hidden rounded-3xl"
                    // style={{ background: "linear-gradient(160deg, #093121 0%, #0c412a 35%, #0A3D2B 100%)" }}

                    style={{ background: "linear-gradient(145deg, #041a12 0%, #0c4a34 55%, #062319 100%)" }}

                >
                    {/* Grid overlay */}
                    <div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(46,139,87,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.07) 1px, transparent 1px)",
                            backgroundSize: "60px 60px",
                        }}
                    />
                    <div
                        className="absolute top-0 right-1/4 w-80 h-80 rounded-full blur-3xl opacity-20"
                        style={{ background: "var(--color-primary-500)" }}
                    />

                    <div className="relative z-10 three-xl-section-padding text-center">
                        <SectionLabel text="Legal Privacy" icon={<RiShieldCheckLine />} className="text-primary2-300 dark:text-gunmetal-300 border-primary2-600 dark:border-gunmetal-400 " />
                        <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-white dark:text-gunmetal-100 mb-4 leading-tight">
                            Privacy Policy
                        </h1>
                        <p className="text-base sm:text-lg leading-relaxed max-w-4xl mx-auto  text-gunmetal-300 mb-8 mt-5"
                        >
                            We value the trust you place in us. This policy explains how {schoolShortName} Alumni
                            Association collects, uses, and safeguards your personal information.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-sm text-gunmetal-200">
                            <RiCalendarLine />
                            <span>Last updated: May 27, 2026</span>
                        </div>
                    </div>
                </section>
            </FadeUpWrapper>

            {/* ── Content ──────────────────────────────────────── */}
            <div className="three-xl-section-setup">
                <div className="flex gap-12 items-start">

                    {/* Sticky TOC sidebar */}
                    <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 px-3">
                            Contents
                        </p>
                        <nav className="flex flex-col gap-0.5">
                            {sections.map(({ id, title, icon }) => {
                                const isActive = activeSection === id;
                                return (
                                    <button
                                        key={id}
                                        onClick={() => scrollTo(id)}
                                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-all duration-200 w-full group ${isActive
                                            ? "bg-primary2-50 text-primary2-700 font-semibold border border-primary2-100"
                                            : "text-neutral-500 hover:text-primary2-700 hover:bg-surface-100"
                                            }`}
                                    >
                                        <span className={`text-base flex-shrink-0 transition-colors ${isActive ? "text-primary2-600" : "text-neutral-400 group-hover:text-primary2-500"}`}>
                                            {icon}
                                        </span>
                                        <span className="leading-snug">{title}</span>
                                        {isActive && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary2-500 flex-shrink-0" />
                                        )}
                                    </button>
                                );
                            })}
                        </nav>

                        <div className="mt-6 mx-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                            <p className="text-xs text-amber-700 leading-relaxed">
                                Questions about your data? Email us at{" "}
                                <a href={`mailto:${email || "info@bamhsian.org.bd"}`} className="font-semibold underline underline-offset-2">
                                    {email || "info@bamhsian.org.bd"}
                                </a>
                            </p>
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="flex-1 min-w-0">

                        {/* Back link */}
                        <GoBackward text="Home" />

                        {/* Intro banner */}
                        <FadeUpWrapper>
                            <div className="mb-12 p-5 rounded-2xl bg-primary2-50 border border-primary2-100">
                                <p className="text-sm text-primary2-800 leading-relaxed">
                                    By using the {schoolShortName} Alumni portal, you agree to the collection and use of
                                    information in accordance with this policy. We are committed to protecting
                                    your privacy and ensuring your data is handled responsibly.
                                </p>
                            </div>
                        </FadeUpWrapper>

                        <PolicySection id="information-we-collect" title="Information We Collect" icon={<RiDatabase2Line />}>
                            <P>
                                We collect information you provide directly to us when you create an account,
                                update your profile, or interact with community features. This includes:
                            </P>
                            <SubHeading>Account Information</SubHeading>
                            <UL items={[
                                "Full name, email address, and password (stored encrypted)",
                                "Batch year, student ID, and section",
                                "Profile photo and biographical information",
                                "Blood group (only if voluntarily provided for the Blood Bank feature)",
                            ]} />
                            <SubHeading>Usage Data</SubHeading>
                            <UL items={[
                                "Pages you visit and features you interact with",
                                "Time and date of visits and session duration",
                                "Device type, operating system, and browser information",
                                "IP address (anonymised for analytics)",
                            ]} />
                            <SubHeading>Content You Submit</SubHeading>
                            <UL items={[
                                "Gallery photos, event registrations, and job board posts",
                                "Comments, reactions, and messages sent through the platform",
                                "Blood donation records you enter voluntarily",
                            ]} />
                        </PolicySection>

                        <Divider />

                        <PolicySection id="how-we-use" title="How We Use Your Information" icon={<RiUserLine />}>
                            <P>We use the information we collect solely to operate and improve the {schoolShortName} Alumni portal:</P>
                            <UL items={[
                                "Creating and managing your alumni account and profile",
                                "Facilitating connections between alumni through the directory and batch rooms",
                                "Sending important notifications about events, announcements, and community updates",
                                "Enabling the Blood Bank feature to match donors with recipients",
                                "Processing event registrations and associated payments",
                                "Displaying your contributions in the gallery (subject to your consent)",
                                "Improving platform performance, resolving bugs, and adding new features",
                                "Detecting and preventing fraudulent or abusive activity",
                            ]} />
                            <P>
                                We do <strong>not</strong> use your data for advertising, and we do{" "}
                                <strong>not</strong> sell, rent, or trade your personal information to any
                                third party for commercial purposes.
                            </P>
                        </PolicySection>

                        <Divider />

                        <PolicySection id="information-sharing" title="Information Sharing" icon={<RiShareLine />}>
                            <P>
                                Your information is never sold or rented. We only share data in the following
                                limited circumstances:
                            </P>
                            <SubHeading>Visible to Other Alumni</SubHeading>
                            <UL items={[
                                "Your name, batch year, and profile photo in the alumni directory",
                                "Gallery photos you have submitted and approved",
                                "Blood group and contact (only visible to registered alumni for donation requests)",
                            ]} />
                            <SubHeading>Third-Party Service Providers</SubHeading>
                            <UL items={[
                                "Cloudinary — for secure image hosting and delivery",
                                "MongoDB Atlas — for database storage (data encrypted at rest)",
                                "Railway & Vercel — for application hosting (no access to personal data)",
                            ]} />
                            <SubHeading>Legal Requirements</SubHeading>
                            <P>
                                We may disclose information if required by applicable law or a valid legal
                                process, or to protect the rights, property, or safety of our community.
                            </P>
                        </PolicySection>

                        <Divider />

                        <PolicySection id="data-security" title="Data Security" icon={<RiLockLine />}>
                            <P>
                                We implement industry-standard security measures to protect your information:
                            </P>
                            <UL items={[
                                "Passwords are hashed using bcrypt — we never store plaintext passwords",
                                "All data transmission is encrypted using HTTPS/TLS",
                                "Authentication is managed via JWT tokens with expiry and rotation",
                                "Access to production databases is restricted by IP allowlisting",
                                "File uploads are validated and sandboxed before processing",
                            ]} />
                            <P>
                                While we take every reasonable precaution, no method of internet transmission
                                is 100% secure. If you suspect unauthorised access to your account, please
                                contact us immediately.
                            </P>
                        </PolicySection>

                        <Divider />

                        <PolicySection id="cookies" title="Cookies & Tracking" icon={<RiSettings3Line />}>
                            <P>
                                We use cookies and similar technologies to maintain your login session and
                                improve your experience:
                            </P>
                            <SubHeading>Essential Cookies</SubHeading>
                            <UL items={[
                                "Session tokens to keep you logged in across page visits",
                                "Theme preference (light/dark mode) stored locally",
                                "CSRF protection tokens for form security",
                            ]} />
                            <SubHeading>Analytics</SubHeading>
                            <P>
                                We may collect anonymised usage statistics to understand how the platform is
                                used. No personally identifiable information is included in analytics data.
                            </P>
                            <P>
                                You can clear cookies at any time through your browser settings. Disabling
                                essential cookies will prevent you from staying logged in.
                            </P>
                        </PolicySection>

                        <Divider />

                        <PolicySection id="your-rights" title="Your Rights" icon={<RiUserSettingsLine />}>
                            <P>You have the following rights regarding your personal data:</P>
                            <UL items={[
                                "Access — request a copy of the personal data we hold about you",
                                "Correction — update or correct inaccurate information via your profile settings",
                                "Deletion — request deletion of your account and associated data",
                                "Portability — receive your data in a machine-readable format upon request",
                                "Withdrawal — remove voluntarily provided data such as gallery photos or blood bank records",
                            ]} />
                            <P>
                                To exercise any of these rights, please email us at{" "}
                                <a href={`mailto:${email || "info@bamhsian.org.bd"}`} className="text-primary2-600 underline underline-offset-2 hover:text-primary2-700">
                                    {email || "info@bamhsian.org.bd"}
                                </a>
                                . We will respond within 30 days.
                            </P>
                        </PolicySection>

                        <Divider />

                        <PolicySection id="childrens-privacy" title="Children's Privacy" icon={<RiShieldUserLine />}>
                            <P>
                                The {schoolShortName} Alumni portal is intended solely for alumni who are at least 16
                                years of age. We do not knowingly collect personal information from children
                                under 16.
                            </P>
                            <P>
                                If you believe a minor has created an account, please contact us immediately
                                and we will take prompt action to remove the account and associated data.
                            </P>
                        </PolicySection>

                        <Divider />

                        <PolicySection id="policy-changes" title="Changes to This Policy" icon={<RiRefreshLine />}>
                            <P>
                                We may update this Privacy Policy periodically to reflect changes in our
                                practices or applicable law. When we make significant changes:
                            </P>
                            <UL items={[
                                "The \"Last updated\" date at the top of this page will be revised",
                                "Registered users will receive an in-app notification",
                                "Continued use of the portal after changes constitutes acceptance of the updated policy",
                            ]} />
                            <P>
                                We encourage you to review this policy periodically to stay informed about
                                how we protect your information.
                            </P>
                        </PolicySection>

                        <Divider />

                        <PolicySection id="contact" title="Contact Us" icon={<RiMailLine />}>
                            <P>
                                If you have any questions, concerns, or requests regarding this Privacy
                                Policy or our data practices, please reach out:
                            </P>
                            <div className="mt-4 p-5 rounded-2xl bg-surface-50 border border-surface-200 space-y-3 not-prose">
                                <div className="flex items-center gap-3 text-sm">
                                    <RiMailLine className="text-primary2-500 text-lg flex-shrink-0" />
                                    <a href={`mailto:${email || "info@bamhsian.org.bd"}`} className="text-primary2-700 font-medium hover:underline">
                                        {email || "info@bamhsian.org.bd"}
                                    </a>
                                </div>
                                <div className="flex items-start gap-3 text-sm text-neutral-600">
                                    <span className="text-primary2-500 text-lg flex-shrink-0 mt-0.5">🏫</span>
                                    <span> {schoolShortName || "BAMHS"} Alumni Association, {schoolName || "Battali Abdul Matin High School"}, {schoolAddress}</span>
                                </div>
                            </div>
                            <P>We aim to respond to all privacy-related enquiries within 5–10 business days.</P>
                        </PolicySection>

                        <Divider />

                        {/* Footer nav */}
                        <div className="mt-16pt-border-tborder-surface-100 flex flex-wrap items-center justify-between gap-4">
                            <p className="text-xs text-muted-foreground">
                                © {new Date().getFullYear()} {schoolShortName || " Alumni Association"}. All rights reserved.
                            </p>
                            <div className="flex gap-4 text-xs">
                                <Link href="/terms" className="text-primary2-600 hover:underline font-medium">
                                    Terms of Service →
                                </Link>
                                <Link href="/about" className="text-muted-foreground hover:text-primary2-600">
                                    About Us
                                </Link>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
