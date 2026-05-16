import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import { useGetWebsiteManagementQuery } from "@/redux/apis/websiteManagementApi"
import Link from "next/link"
import { RiFacebookBoxLine, RiYoutubeLine, RiWhatsappLine } from "react-icons/ri";

const FooterHead = () => {
    const { data: websiteManagement } = useGetWebsiteManagementQuery()
    const { schoolName, area, thana, district, division, postalCode, country, facebook, youtube, whatsappNumber } = websiteManagement?.data || {}

    const schoolAddress = `${postalCode ?? "3582"} - ${area ?? "Battali"}, ${thana ?? "Nangalkot"}, ${district ?? "Cumilla"}, ${division ?? "Chattogram"}, ${country ?? "Bangladesh"}`;

    const socials = [
        { icon: <RiFacebookBoxLine />, href: facebook || "#", label: "Facebook" },
        { icon: <RiYoutubeLine />, href: youtube || "#", label: "YouTube" },
        { icon: <RiWhatsappLine />, href: whatsappNumber ? `https://wa.me/${whatsappNumber}` : "#", label: "WhatsApp" },
    ];

    return (
        <div className="relative py-12 px-3 text-center">
            {/* Emblem */}
            <FadeUpWrapper
                className="flex justify-center mb-5"
            >
                <div
                    className="w-18 h-18 rounded-2xl flex items-center justify-center relative overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #257048 0%, #0A3D2B 100%)",
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
                        className="font-display font-bold text-3xl relative z-10"
                        style={{
                            color: "var(--color-primary-100)",
                            textShadow: "0 0 20px rgba(74,222,128,0.5)",
                        }}
                    >
                        {schoolName?.slice(0, 1)}
                    </span>
                </div>
            </FadeUpWrapper>

            <FadeUpWrapper
                className="font-display font-bold text-2xl md:text-4xl mb-2 tracking-tight"
                style={{
                    background: "linear-gradient(160deg, #f0fdf4 20%, #86efac 60%, #d1fae5 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    filter: "drop-shadow(0 2px 16px rgba(46,139,87,0.4))",
                }}
            >
                <span className="text-xl" >Alumni Association of</span> <br />
                {schoolName || "Battali Abdul Matin High School"}
            </FadeUpWrapper>

            <FadeUpWrapper
                className=" text-xs tracking-[0.22em] mb-4 text-primary2-400 ">
                {schoolAddress}
            </FadeUpWrapper>

            {/* Tagline */}
            <FadeUpWrapper
                className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mx-auto"
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
                    className="font-serif italic text-sm"
                    style={{ color: "rgba(167,243,208,0.80)" }}
                >
                    &quot;Where roots run deep, and bonds last forever&quot;
                </p>
                <span
                    className="w-1 h-1 rounded-full"
                    style={{ background: "#f59e0b" }}
                />
            </FadeUpWrapper>

            {/* Social links */}
            <FadeUpWrapper
                className="flex justify-center gap-3 mt-6"
            >
                {socials.map(({ icon, href, label }) => (
                    <Link
                        key={label}
                        href={href}
                        aria-label={label}
                        className="flex items-center justify-center w-10 h-10 rounded-full border text-lg transition-all duration-300 hover:-translate-y-1"
                        style={{
                            borderColor: "rgba(46,139,87,0.25)",
                            color: "rgba(134,239,172,0.65)",
                            background: "rgba(46,139,87,0.08)",
                            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(74,222,128,0.55)";
                            (e.currentTarget as HTMLElement).style.color = "#f0fdf4";
                            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 16px rgba(46,139,87,0.40), inset 0 1px 0 rgba(255,255,255,0.08)";
                            (e.currentTarget as HTMLElement).style.background = "rgba(46,139,87,0.18)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(46,139,87,0.25)";
                            (e.currentTarget as HTMLElement).style.color = "rgba(134,239,172,0.65)";
                            (e.currentTarget as HTMLElement).style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.05)";
                            (e.currentTarget as HTMLElement).style.background = "rgba(46,139,87,0.08)";
                        }}
                    >
                        {icon}
                    </Link>
                ))}
            </FadeUpWrapper>
        </div>
    )
}
export default FooterHead