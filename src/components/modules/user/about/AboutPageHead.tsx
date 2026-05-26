import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import SectionLabel from "@/components/shared/SectionLabel";
import { useGetWebsiteManagementQuery } from "@/redux/apis/websiteManagementApi";
import { RiSparkling2Line } from "react-icons/ri"

const AboutPageHead = () => {
    const impactStats = [
        { value: "৳8L+", label: "Scholarship fund raised" },
        { value: "200+", label: "Blood donations facilitated" },
        { value: "12", label: "Reunions organized" },
        { value: "50+", label: "Mentorship active" },
    ];

    const { data: websiteManagement } = useGetWebsiteManagementQuery();
    const { schoolName } = websiteManagement?.data || {};
    const schoolShortName = schoolName?.split(" ")?.map((word: string) => word[0]).join("") || "BAMHS";

    return (
        <FadeUpWrapper className="three-xl-section-setup">
            <section className="relative overflow-hidden rounded-3xl"
                style={{
                    background: "linear-gradient(160deg, #093121 0%, #0c412a 35%, #0A3D2B 100%)",
                }}>
                {/* grid */}
                <div className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage: "linear-gradient(rgba(46,139,87,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.07) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }} />
                <div className="absolute top-20 left-1/3 w-96 h-96 rounded-full blur-3xl opacity-20"
                    style={{ background: "var(--color-primary-500)" }} />

                <div className="relative z-10 text-center mx-auto three-xl-section-padding">
                    <SectionLabel text="Our Story" icon={<RiSparkling2Line />} className="text-primary2-300 dark:text-gunmetal-300 border-primary2-600 dark:border-gunmetal-400 " />

                    <h2
                        className="section-heading-text-center mb-3 mt-5 text-white dark:text-gunmetal-200 ">
                        More than a school — <br /> <span className="text-primary2-300 dark:text-primary">
                            a lifelong family
                        </span>
                    </h2>

                    <p className="text-base sm:text-lg leading-relaxed max-w-4xl mx-auto text-gunmetal-300 mb-12"> {schoolShortName} Alumni is not an organization — it is a feeling. The smell of chalk,
                        the echo of the morning assembly, the warmth of a teacher&apos;s words.
                        This portal is our way of keeping that feeling alive, forever.</p>

                    {/* impact stats */}
                    <FadeUpWrapper
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto"
                    >
                        {impactStats.map(({ value, label }) => (
                            <div key={label} className="rounded-xl max-w-48 p-4 text-center border"
                                style={{
                                    background: "rgba(46,139,87,0.10)",
                                    borderColor: "rgba(46,139,87,0.22)",
                                }}>
                                <p className="font-display font-bold text-2xl mb-0.5 text-primary2-100 dark:text-primary">{value}</p>
                                <p className=" text-xs" style={{ color: "rgba(195,232,206,0.60)" }}>{label}</p>
                            </div>
                        ))}
                    </FadeUpWrapper>
                </div>
            </section>
        </FadeUpWrapper>
    )
}
export default AboutPageHead