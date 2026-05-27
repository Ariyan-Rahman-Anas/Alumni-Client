"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
    RiFileTextLine,
    RiUserAddLine,
    RiGroupLine,
    RiProhibitedLine,
    RiCopyrightLine,
    RiImageLine,
    RiAlertLine,
    RiScalesLine,
    RiLogoutCircleRLine,
    RiMailLine,
    RiCalendarLine,
    RiCheckboxCircleLine,
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
    { id: "acceptance", title: "Acceptance of Terms", icon: <RiCheckboxCircleLine /> },
    { id: "account-registration", title: "Account Registration", icon: <RiUserAddLine /> },
    { id: "community-standards", title: "Community Standards", icon: <RiGroupLine /> },
    { id: "prohibited-activities", title: "Prohibited Activities", icon: <RiProhibitedLine /> },
    { id: "intellectual-property", title: "Intellectual Property", icon: <RiCopyrightLine /> },
    { id: "user-content", title: "User Content", icon: <RiImageLine /> },
    { id: "disclaimers", title: "Disclaimers", icon: <RiAlertLine /> },
    { id: "limitation-of-liability", title: "Limitation of Liability", icon: <RiScalesLine /> },
    { id: "termination", title: "Termination", icon: <RiLogoutCircleRLine /> },
    { id: "contact", title: "Contact Us", icon: <RiMailLine /> },
];

/* ── Section wrapper ──────────────────────────────────────── */
function PolicySection({
    id,
    title,
    icon,
    children,
}: {
    id: string;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
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
            className="scroll-mt-24 mb-14"
        >
            <div className="flex items-center gap-3 mb-5">
                <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary2-50 text-primary2-600 text-lg border border-primary2-100 flex-shrink-0">
                    {icon}
                </span>
                <h2 className="text-xl font-bold text-primary2-900">{title}</h2>
            </div>
            <div className="pl-12 space-y-3 text-neutral-700 text-sm leading-relaxed">
                {children}
            </div>
        </motion.section>
    );
}

/* ── Prose helpers ────────────────────────────────────────── */
const P = ({ children }: { children: React.ReactNode }) => (
    <p className="text-neutral-600 leading-relaxed">{children}</p>
);

const UL = ({ items }: { items: string[] }) => (
    <ul className="space-y-2 mt-2">
        {items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-neutral-600">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary2-400 flex-shrink-0" />
                <span>{item}</span>
            </li>
        ))}
    </ul>
);

const SubHeading = ({ children }: { children: React.ReactNode }) => (
    <h3 className="font-semibold text-primary2-800 mt-5 mb-2">{children}</h3>
);

const Highlight = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-100 my-4">
        <RiAlertLine className="text-amber-500 text-lg flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800 leading-relaxed">{children}</p>
    </div>
);

const Divider = () => (<div className="border-t border-gunmetal-100 dark:border-gunmetal-400 mb-14" />
);

/* ── Main component ───────────────────────────────────────── */
export default function TermsPage() {
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
                    style={{ background: "linear-gradient(160deg, #093121 0%, #0c412a 35%, #0A3D2B 100%)" }}
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
                        className="absolute top-0 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-20"
                        style={{ background: "var(--color-primary-500)" }}
                    />

                    <div className="relative z-10 three-xl-section-padding text-center">
                        <SectionLabel text="Legal Terms" icon={<RiFileTextLine />} className="text-primary2-300 dark:text-gunmetal-300 border-primary2-600 dark:border-gunmetal-400 " />
                        <h1 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold text-white dark:text-gunmetal-100 mb-4 leading-tight">
                            Terms of Service
                        </h1>
                        <p className="text-base sm:text-lg leading-relaxed max-w-4xl mx-auto  text-gunmetal-300 mb-8 mt-5">
                            These terms govern your use of the {schoolShortName} Alumni portal. Please read them
                            carefully before creating an account or accessing our services.
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

                        <div className="mt-6 mx-3 p-3 rounded-xl bg-primary2-50 border border-primary2-100">
                            <p className="text-xs text-primary2-700 leading-relaxed">
                                By using this portal, you agree to these terms. Questions?{" "}
                                <a href={`mailto:${email || "info@bamhsian.org.bd"}`} className="font-semibold underline underline-offset-2">
                                    Contact us
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
                                    These Terms of Service constitute a legally binding agreement between you
                                    and the {schoolShortName} Alumni Association. If you do not agree with any part of
                                    these terms, please discontinue use of the portal immediately.
                                </p>
                            </div>
                        </FadeUpWrapper>

                        <PolicySection id="acceptance" title="Acceptance of Terms" icon={<RiCheckboxCircleLine />}>
                            <P>
                                By accessing or using the {schoolShortName} Alumni portal (the &quot;Service&quot;), you confirm
                                that you are at least 16 years of age and agree to be bound by these Terms of
                                Service and our Privacy Policy.
                            </P>
                            <P>
                                The {schoolShortName} Alumni Association reserves the right to modify these terms at any
                                time. Your continued use of the Service after any changes constitutes your
                                acceptance of the new terms. We will notify registered users of material changes.
                            </P>
                            <Highlight>
                                This portal is exclusively for alumni of {schoolName}.
                                Registering with false information or impersonating another person is strictly
                                prohibited and will result in immediate account termination.
                            </Highlight>
                        </PolicySection>

                        <Divider />

                        <PolicySection id="account-registration" title="Account Registration" icon={<RiUserAddLine />}>
                            <P>
                                To access most features of the portal, you must register for an account using
                                accurate and complete information.
                            </P>
                            <SubHeading>Your Responsibilities</SubHeading>
                            <UL items={[
                                "Provide accurate, current, and complete information during registration",
                                "Maintain the security of your password and notify us immediately of any unauthorised access",
                                "Keep your profile information up to date",
                                "Accept responsibility for all activities that occur under your account",
                                "Not share your account credentials with any third party",
                            ]} />
                            <SubHeading>Account Verification</SubHeading>
                            <P>
                                Accounts may be subject to manual verification to confirm alumni status. The
                                Association reserves the right to reject or suspend any account that cannot be
                                verified or that violates these terms.
                            </P>
                        </PolicySection>

                        <Divider />

                        <PolicySection id="community-standards" title="Community Standards" icon={<RiGroupLine />}>
                            <P>
                                The {schoolShortName} Alumni portal is a respectful community built on shared memories and
                                mutual support. All members are expected to uphold the following standards:
                            </P>
                            <UL items={[
                                "Treat all fellow alumni, teachers, and administrators with dignity and respect",
                                "Engage constructively and refrain from personal attacks or harassment",
                                "Share accurate information — misinformation harms the community",
                                "Respect the privacy of other members and do not share their personal information without consent",
                                "Report inappropriate content or behaviour to the moderation team",
                                `Honour the reputation of ${schoolShortName} in all public interactions on the platform`,
                            ]} />
                            <P>
                                Violations of community standards may result in content removal, temporary
                                suspension, or permanent account termination at the discretion of administrators.
                            </P>
                        </PolicySection>

                        <Divider />

                        <PolicySection id="prohibited-activities" title="Prohibited Activities" icon={<RiProhibitedLine />}>
                            <P>
                                The following activities are strictly prohibited on the {schoolShortName} Alumni portal:
                            </P>
                            <SubHeading>Content Violations</SubHeading>
                            <UL items={[
                                "Posting defamatory, harassing, threatening, or abusive content",
                                "Sharing explicit, obscene, or sexually inappropriate material",
                                "Publishing false information or spreading misinformation",
                                "Uploading content that infringes third-party intellectual property rights",
                                `Impersonating any person, organisation, or ${schoolShortName} alumni`,
                            ]} />
                            <SubHeading>Technical Violations</SubHeading>
                            <UL items={[
                                "Attempting to gain unauthorised access to any part of the portal",
                                "Scraping, crawling, or harvesting user data without permission",
                                "Uploading malware, viruses, or any malicious code",
                                "Circumventing authentication, rate limits, or security controls",
                                "Using automated tools or bots to interact with the platform",
                            ]} />
                            <SubHeading>Commercial Violations</SubHeading>
                            <UL items={[
                                "Using the platform for unsolicited commercial advertising or spam",
                                "Promoting external commercial services without prior approval from administrators",
                                "Selling or transferring your account to another person",
                            ]} />
                        </PolicySection>

                        <Divider />

                        <PolicySection id="intellectual-property" title="Intellectual Property" icon={<RiCopyrightLine />}>
                            <P>
                                All original content on the {schoolShortName} Alumni portal — including design, text,
                                graphics, logos, and software — is the intellectual property of the {schoolShortName}
                                Alumni Association or its licensors and is protected by applicable copyright law.
                            </P>
                            <UL items={[
                                "You may not reproduce, distribute, or create derivative works without explicit written permission",
                                `The ${schoolShortName} name and associated marks may not be used without prior authorisation`,
                                "Content you did not create (school photos, third-party media) must be shared with appropriate attribution",
                            ]} />
                            <P>
                                User-submitted content (photos, posts, comments) remains your property. By
                                submitting content, you grant the Association a non-exclusive, royalty-free
                                licence to display and share that content within the portal.
                            </P>
                        </PolicySection>

                        <Divider />

                        <PolicySection id="user-content" title="User Content" icon={<RiImageLine />}>
                            <P>
                                When you submit photos, posts, comments, or any other content to the portal,
                                you represent and warrant that:
                            </P>
                            <UL items={[
                                "You own or have the necessary rights to submit the content",
                                "The content does not violate any third party's rights",
                                "The content complies with these Terms and our Community Standards",
                                "You have obtained consent from any identifiable individuals appearing in photos",
                            ]} />
                            <SubHeading>Gallery Submissions</SubHeading>
                            <P>
                                Photos submitted by regular alumni are held for admin review before being
                                published. The Association reserves the right to reject or remove any content
                                that does not meet community or quality standards, without prior notice.
                            </P>
                            <SubHeading>Content Removal</SubHeading>
                            <P>
                                You may delete your own submitted content at any time. However, content that
                                has been shared or archived may persist in backup systems for a limited period.
                            </P>
                        </PolicySection>

                        <Divider />

                        <PolicySection id="disclaimers" title="Disclaimers" icon={<RiAlertLine />}>
                            <P>
                                The {schoolShortName} Alumni portal is provided on an &quot;as is&quot; and &quot;as available&quot; basis
                                without warranties of any kind, either express or implied, including but not
                                limited to:
                            </P>
                            <UL items={[
                                "Warranties of merchantability, fitness for a particular purpose, or non-infringement",
                                "Guarantees that the Service will be uninterrupted, error-free, or secure at all times",
                                "Accuracy or completeness of any information provided on the platform",
                            ]} />
                            <Highlight>
                                The Blood Bank feature facilitates voluntary connections between donors and
                                recipients. The Association does not provide medical advice and accepts no
                                liability for any outcomes arising from blood donation arrangements made
                                through the portal.
                            </Highlight>
                            <P>
                                The Association is not affiliated with the {schoolShortName} administration.
                                Content on this portal does not represent the official positions of the {schoolShortName}.
                            </P>
                        </PolicySection>

                        <Divider />

                        <PolicySection id="limitation-of-liability" title="Limitation of Liability" icon={<RiScalesLine />}>
                            <P>
                                To the fullest extent permitted by applicable law, the {schoolShortName} Alumni
                                Association and its volunteers, administrators, and developers shall not be
                                liable for any:
                            </P>
                            <UL items={[
                                "Indirect, incidental, special, consequential, or punitive damages",
                                "Loss of data, profits, goodwill, or other intangible losses",
                                "Damages arising from your use or inability to use the Service",
                                "Damages resulting from unauthorised access to or alteration of your account",
                                "Damages resulting from third-party conduct facilitated through the platform",
                            ]} />
                            <P>
                                This limitation applies whether the claim is based on warranty, contract,
                                tort (including negligence), or any other legal theory, even if the
                                Association has been advised of the possibility of such damage.
                            </P>
                        </PolicySection>

                        <Divider />

                        <PolicySection id="termination" title="Termination" icon={<RiLogoutCircleRLine />}>
                            <SubHeading>By the Association</SubHeading>
                            <P>
                                We reserve the right to suspend or permanently terminate your account at our
                                sole discretion, without prior notice or liability, if we determine that you
                                have violated these Terms, engaged in prohibited conduct, or for any other
                                reason we deem appropriate to protect the community.
                            </P>
                            <SubHeading>By You</SubHeading>
                            <P>
                                You may request deletion of your account at any time by contacting us. Upon
                                deletion, your profile and personal data will be removed in accordance with
                                our Privacy Policy. Some anonymised activity records may be retained for
                                community integrity purposes.
                            </P>
                            <SubHeading>Effect of Termination</SubHeading>
                            <UL items={[
                                "Your right to access and use the portal ceases immediately",
                                "Provisions that by their nature should survive termination will remain in effect",
                                "The Association may retain content that was publicly shared prior to termination",
                            ]} />
                        </PolicySection>

                        <Divider />

                        <PolicySection id="contact" title="Contact Us" icon={<RiMailLine />}>
                            <P>
                                For questions, concerns, or legal notices relating to these Terms of Service,
                                please contact:
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
                                    <span>{schoolShortName || "BAMHS"} Alumni Association, {schoolName || "Battali Abdul Matin High School"}, {schoolAddress}</span>
                                </div>
                            </div>
                            <P>We will endeavour to respond to all legal enquiries within 10 business days.</P>
                        </PolicySection>

                        <Divider />

                        {/* Footer nav */}
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <p className="text-xs text-muted-foreground">
                                © {new Date().getFullYear()} {schoolShortName || "BAMHS"} Alumni Association. All rights reserved.
                            </p>
                            <div className="flex gap-4 text-xs">
                                <Link href="/privacy" className="text-primary2-600 hover:underline font-medium">
                                    Privacy Policy →
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
