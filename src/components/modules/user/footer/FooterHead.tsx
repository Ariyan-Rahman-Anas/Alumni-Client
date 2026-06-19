import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import { useSchoolInfo } from "@/hooks/useSchoolInfo";
import Link from "next/link";
import { RiFacebookBoxLine, RiYoutubeLine, RiWhatsappLine } from "react-icons/ri";

const FooterHead = () => {
    const { name, facebook, youtube, whatsappNumber } = useSchoolInfo();

    const socials = [
        facebook
            ? {
                icon: <RiFacebookBoxLine />,
                href: facebook,
                label: "Facebook",
            }
            : null,
        youtube
            ? {
                icon: <RiYoutubeLine />,
                href: youtube,
                label: "YouTube",
            }
            : null,
        whatsappNumber
            ? {
                icon: <RiWhatsappLine />,
                href: `https://wa.me/${whatsappNumber}`,
                label: "WhatsApp",
            }
            : null,
    ].filter(item => item !== null) as Array<{ icon: JSX.Element; href: string; label: string }>;

    return (
        <div className="relative py-12 px-3 text-center">
            {/* Emblem */}
            <FadeUpWrapper className="flex justify-center mb-5">
                <div
                    className="w-18 h-18 rounded-2xl flex items-center justify-center relative overflow-hidden"
                    style={{
                        background:
                            "linear-gradient(135deg, #257048 0%, #0A3D2B 100%)",
                        border: "1px solid rgba(74,222,128,0.30)",
                        boxShadow:
                            "0 0 40px rgba(46,139,87,0.40), 0 0 80px rgba(46,139,87,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
                    }}
                >
                    <div
                        className="absolute -top-2 -right-2 w-10 h-10 rounded-full opacity-20"
                        style={{ background: "var(--color-primary-300)" }}
                    />
                    <span
                        className="text-white dark:text-gunmetal-200 font-bold text-3xl relative z-10"
                        style={{
                            textShadow:
                                "0 0 20px rgba(74,222,128,0.5)",
                        }}
                    >
                        {name?.slice(0, 1)}
                    </span>
                </div>
            </FadeUpWrapper>

            <FadeUpWrapper
                className="text-gunmetal-100 dark:text-gunmetal-200 primary2-200 font-bold text-2xl md:text-4xl mb-2 tracking-tight">
                <h2 className="text-xl mb-1 text-white dark:text-gunmetal-100 ">Alumni Association of</h2>
                <p>{name || "Battali Abdul Matin High School"}</p>
            </FadeUpWrapper>

            {/* Tagline */}
            <FadeUpWrapper
                className="inline-flex items-center gap-3 mt-3 px-5 py-2.5 rounded-full mx-auto"
                style={{
                    background: "rgba(46,139,87,0.10)",
                    border: "1px solid rgba(46,139,87,0.20)",
                }}
            >
                <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: "#f59e0b" }}
                />
                <p
                    className="italic text-sm"
                    style={{
                        color: "rgba(167,243,208,0.80)",
                    }}
                >
                    &quot;Where roots run deep, and bonds last forever&quot;
                </p>
                <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: "#f59e0b" }}
                />
            </FadeUpWrapper>

            {/* Social links */}
            {socials.length > 0 && (
                <FadeUpWrapper className="flex justify-center gap-3 mt-6">
                    {socials.map(({ icon, href, label }) => (
                        <Link
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={label}
                            className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-gunmetal-400 hover:border-gunmetal-200 text-lg transition-all duration-300 hover:-translate-y-1 text-gunmetal-200 hover:text-white ">
                            {icon}
                        </Link>
                    ))}
                </FadeUpWrapper>
            )}
        </div>
    );
};
export default FooterHead;