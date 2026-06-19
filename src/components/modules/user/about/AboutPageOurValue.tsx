import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import SectionLabel from "@/components/shared/SectionLabel";
import { useSchoolInfo } from "@/hooks/useSchoolInfo";
import { RiGroupLine, RiHeartLine, RiLeafLine, RiLightbulbLine, RiMedalLine, RiShieldLine } from "react-icons/ri";

const AboutPageOurValue = () => {
    const { alumniName, addresses } = useSchoolInfo();

    const values = [
        { icon: <RiHeartLine />, title: `Nostalgia & Belonging`, desc: `We preserve the shared memories that make every ${alumniName} feel at home, wherever they are in the world.` },
        { icon: <RiGroupLine />, title: "Community First", desc: "Alumni helping alumni — whether it's a job referral, blood donation, or simply a reunion hug." },
        { icon: <RiShieldLine />, title: "Trust & Respect", desc: "We honor the teachers, the institution, and the values that shaped us into who we are today." },
        { icon: <RiLightbulbLine />, title: "Giving Back", desc: "Scholarships, mentorship, and infrastructure support — successful alumni lighting the path for the next generation." },
        { icon: <RiLeafLine />, title: "Roots & Growth", desc: `Like the trees of ${addresses.area}, we grow outward but remain rooted in the soil of our shared origin.` },
        { icon: <RiMedalLine />, title: "Pride & Excellence", desc: `We celebrate every ${alumniName}'s achievement as a collective victory for the entire school family.` },
    ];

    return (
        <div><section className="">
            <div className="three-xl-section-setup">
                <FadeUpWrapper className="text-center mb-8">
                    <SectionLabel text="Our Values" icon={<RiHeartLine />} className="dark:text-gunmetal-300 dark:border-gunmetal-500" />
                    <h2
                        className="section-heading-text-center mb-3 mt-5 text-primary2-900 dark:text-gunmetal-200 ">
                        What we <span className="text-primary">
                            Stand for
                        </span>
                    </h2>
                    <p className="text-gunmetal-400 dark:text-gunmetal-300">
                        The principles that guide every {alumniName}, in school and in life.
                    </p>
                </FadeUpWrapper>

                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {values.map(({ icon, title, desc }, i) => (
                        <FadeUpWrapper key={title} delay={i * 0.07}>
                            <div className="h-full shadow rounded-3xl hover:-translate-y-1 transition-all duration-300">
                                <div className="p-6">
                                    <div className="w-11 h-11 rounded-full flex items-center justify-center mb-4"
                                        style={{ background: "var(--color-primary-50)" }}>
                                        <span style={{ color: "var(--color-primary-500)", fontSize: "20px" }}>{icon}</span>
                                    </div>
                                    <h3 className="font-semibold text-lg text-primary2-900 dark:text-gunmetal-200 mb-2">{title}</h3>
                                    <p className=" text-sm leading-relaxed text-gunmetal-400 dark:text-gunmetal-300">{desc}</p>
                                </div>
                            </div>
                        </FadeUpWrapper>
                    ))}
                </div>
            </div>
        </section></div>
    )
}
export default AboutPageOurValue