import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import SectionLabel from "@/components/shared/SectionLabel";
import { RiGroupLine } from "react-icons/ri";

const AboutPageAlumniCommittee = () => {
    const team = [
        { name: "Jahangir Alam Jony", role: "President, Alumni Association", batch: "Batch 2001" },
        { name: "Nasrin Sultana", role: "General Secretary", batch: "Batch 1995" },
        { name: "Rafiqul Islam", role: "Treasurer", batch: "Batch 1992" },
        { name: "Sadia Akter", role: "Digital & Communications", batch: "Batch 2008" },
        { name: "Karim Hossain", role: "Events & Reunions", batch: "Batch 2001" },
        { name: "Tania Rahman", role: "Scholarship Committee Head", batch: "Batch 2004" },
    ];

    return (
        <div className="three-xl-section-setup">
            <FadeUpWrapper className="text-center mb-14">
                <SectionLabel text="Alumni Committee" icon={<RiGroupLine />} className="dark:text-gunmetal-300 dark:border-gunmetal-500" />
                <h2
                    className="section-heading-text-center mb-3 mt-5 text-primary2-900 dark:text-gunmetal-200 ">
                    The People Behind It <span className="text-primary">
                        Behind It
                    </span>
                </h2>
                <p className="dark:text-gunmetal-300">
                    Volunteers from different batches keeping the BAMHSian spirit alive.
                </p>
            </FadeUpWrapper>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {team.map(({ name, role, batch }, i) => (
                    <FadeUpWrapper key={name} delay={i * 0.07}>
                        <div className="flex items-center gap-4 p-5 rounded-2xl borde shadow  hover:-translate-y-1 transition-all duration-300">
                            {/* Avatar */}
                            <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg shrink-0"
                                style={{
                                    background: "linear-gradient(135deg, var(--color-primary-100), var(--color-primary-200))",
                                    color: "var(--color-primary-700)",
                                }}>
                                {name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                                <p className=" font-semibold text-sm"
                                    style={{ color: "var(--color-text-primary)" }}>{name}</p>
                                <p className="text-xs dark:text-gunmetal-300">{role}</p>
                                <span className=" text-[10px] tracking-wider mt-1 block"
                                    style={{ color: "var(--color-primary-500)" }}>{batch}</span>
                            </div>
                        </div>
                    </FadeUpWrapper>
                ))}
            </div>
        </div>
    )
}
export default AboutPageAlumniCommittee