"use client";

import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { useSchoolInfo } from "@/hooks/useSchoolInfo";
import {
    RiMailLine,
    RiPhoneLine,
    RiFacebookBoxLine,
    RiYoutubeLine,
    RiWhatsappLine,
} from "react-icons/ri";

const AnnouncementsPageCTA = () => {
    const { email, contactNumber, whatsappNumber, facebook, youtube } = useSchoolInfo();

    return (
        <FadeUpWrapper delay={0.3} className="three-xl-section-setup">
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
                                Never miss an Update,{" "}
                                <span className="text-primary2-300 dark:text-primary">to Stay Informed</span>
                            </h2>
                            <p className="text-base sm:text-lg leading-relaxed max-w-2xl text-gunmetal-300 mt-5 mb-8">
                                Important notices and time-sensitive alerts are posted here first.
                                Check back regularly or contact the alumni office for direct correspondence.
                            </p>
                        </div>

                        {/* ── Right — Contact card ── */}
                        <div className="lg:shrink-0 lg:w-72">
                            <div className="rounded-2xl bg-white/10 border border-white/15 p-5 space-y-4 backdrop-blur-sm">
                                <p className="text-sm font-semibold text-white dark:text-gunmetal-200 tracking-widest">
                                    Contact Alumni Office
                                </p>
                                <div className="space-y-3">
                                    <a
                                        href={`mailto:${email}`}
                                        className="flex items-center gap-3 text-sm text-white/75 dark:text-gunmetal-200 hover:text-white dark:hover:text-gunmetal-100 transition-colors group"
                                    >
                                        <RiMailLine />
                                        <span className="truncate">{email}</span>
                                    </a>
                                    <a
                                        href={`tel:${contactNumber}`}
                                        className="flex items-center gap-3 text-sm text-white/75 dark:text-gunmetal-200 hover:text-white dark:hover:text-gunmetal-100 transition-colors group"
                                    >
                                        <RiPhoneLine />
                                        {contactNumber}
                                    </a>
                                    {facebook && (
                                        <a
                                            href={facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 text-sm text-white/75 dark:text-gunmetal-200 hover:text-white dark:hover:text-gunmetal-100 transition-colors group"
                                        >
                                            <RiFacebookBoxLine />
                                            Follow on Facebook
                                        </a>
                                    )}
                                    {youtube && (
                                        <a
                                            href={youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 text-sm text-white/75 dark:text-gunmetal-200 hover:text-white dark:hover:text-gunmetal-100 transition-colors group"
                                        >
                                            <RiYoutubeLine />
                                            Subscribe on YouTube
                                        </a>
                                    )}
                                </div>

                                <PrimaryButton
                                    title="Message on WhatsApp"
                                    icon={<RiWhatsappLine />}
                                    href={`https://wa.me/${whatsappNumber.replace(/\D/g, "")}`}
                                    isNewTab={true}
                                    isFullWidth={true}
                                    className="mt-2 bg-transparent dark:bg-transparent border border-white/20 hover:border-white/45 text-white/75 hover:text-white dark:text-gunmetal-200 dark:hover:text-gunmetal-100 transition-colors"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </FadeUpWrapper>
    );
};
export default AnnouncementsPageCTA;