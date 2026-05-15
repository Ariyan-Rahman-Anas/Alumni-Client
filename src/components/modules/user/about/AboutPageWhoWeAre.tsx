import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import PrimaryButton from "@/components/shared/PrimaryButton"
import SectionLabel from "@/components/shared/SectionLabel"
import { RiArrowRightLine, RiGroupLine, RiHandHeartLine, RiHeartLine, RiShieldLine } from "react-icons/ri"

const AboutPageWhoWeAre = () => {
    return (
        <div><section className="bg-surface dark:bg-transparent">
            <div className="three-xl-section-setup">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <FadeUpWrapper>
                        <SectionLabel text="Who We Are" align="left" icon={<RiGroupLine />} className="dark:text-gunmetal-300 dark:border-gunmetal-500" />
                        <h2
                            className="section-heading-text-left mb-3 mt-5 text-primary2-900 dark:text-gunmetal-200 ">
                            Built by Alumni, <span className="text-primary">
                                for Alumni
                            </span>
                        </h2>

                        <p className=" text-base leading-relaxed mb-4 text-gunmetal-400 dark:text-gunmetal-300">
                            This platform was created by former students of Battali Abdul Matin High School
                            who felt the need for a single, warm, digital home — a place to reconnect with
                            old friends, find classmates from across the world, and give back to the school
                            that gave us everything.
                        </p>
                        <p className=" text-base leading-relaxed mb-8 text-gunmetal-400 dark:text-gunmetal-300">
                            We are not a school management system. We are not affiliated with the school
                            administration. We are simply BAMHSians — proud, grateful, and nostalgic —
                            keeping the spirit of our alma mater alive.
                        </p>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {["Alumni Portal", "Community Driven", "Non-Commercial", "Est. 2025"].map(tag => (
                                <p key={tag} className="badge-student dark:bg-gunmetal-600 dark:text-gunmetal-200 dark:border-gunmetal-500">{tag}</p>
                            ))}
                        </div>

                        <PrimaryButton
                            title="Connect with Alumni"
                            icon2={<RiArrowRightLine />}
                            href="/login"
                        />
                    </FadeUpWrapper>

                    {/* Right — quote block */}
                    <FadeUpWrapper delay={0.15}>
                        <div className="relative">
                            <div className="absolute -left-4 top-8 bottom-8 w-1 rounded-full"
                                style={{ background: "linear-gradient(to bottom, var(--color-primary-300), var(--color-primary-500))" }} />
                            <div className="pl-8 space-y-8">
                                {[
                                    { text: "Find your batch-mates from any year since 1966.", icon: <RiGroupLine /> },
                                    { text: "Share memories through the alumni gallery.", icon: <RiHeartLine /> },
                                    { text: "Help current students through scholarships.", icon: <RiHandHeartLine /> },
                                    { text: "Register as a blood donor for the community.", icon: <RiShieldLine /> },
                                ].map(({ text, icon }) => (
                                    <div key={text} className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                                            style={{ background: "var(--color-primary-50)" }}>
                                            <span style={{ color: "var(--color-primary-500)", fontSize: "18px" }}>{icon}</span>
                                        </div>
                                        <p className="text-base pt-2 leading-snug dark:text-gunmetal-300">{text}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeUpWrapper>
                </div>
            </div>
        </section></div>
    )
}
export default AboutPageWhoWeAre