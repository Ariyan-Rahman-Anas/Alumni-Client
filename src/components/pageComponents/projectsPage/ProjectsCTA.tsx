"use client"

import { motion } from "framer-motion"
import { LuLightbulb, LuBug } from "react-icons/lu"
import PrimaryButton from "@/components/shared/PrimaryButton"
import SecondaryButton from "@/components/shared/SecondaryButton"
import SectionLabel from "@/components/shared/SectionLabel"

const ProjectsCTA = () => {
    return (
        <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: false }}
            className="relative text-center"
        >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[400px] h-[180px] bg-brand/10 blur-[80px] rounded-full" />
            </div>

            <div className="relative border border-white/10 bg-white/5 backdrop-blur-sm rounded-3xl px-8 py-14">
                <SectionLabel text="got something in mind? " />

                <h2 className="mt-3 text-3xl md:text-4xl font-bold text-white tracking-tight">
                    Want to Build Something{" "}
                    <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">
                        Together?
                    </span>
                </h2>

                <p className="mt-3 text-text-secondary text-base max-w-lg mx-auto leading-relaxed">
                    Have a project idea or found an issue in one of my projects?
                    I&apos;d love to hear from you.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
                    <PrimaryButton
                        title="Share an Idea"
                        icon={<LuLightbulb size={16} />}
                        isLinked={true}
                        link="/contact"
                    />
                    <SecondaryButton
                        title="Raise an Issue"
                        icon={<LuBug size={16} />}
                        isLinked={true}
                        isNewTab={true}
                        link="https://github.com/Ariyan-Rahman-Anas"
                    />
                </div>
            </div>
        </motion.section>
    )
}
export default ProjectsCTA