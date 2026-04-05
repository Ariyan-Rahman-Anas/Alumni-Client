"use client"

import { motion } from "framer-motion";
import Image from "next/image"
import Link from "next/link"

const PrimaryButton = ({
    buttonType, title, link, isLinked = false,
    isNewTab = false, icon, imgIcon, disabled, onClickFunc
}: {
    buttonType?: "button" | "submit" | "reset"
    title: string
    link?: string
    isLinked?: boolean
    isNewTab?: boolean
    icon?: React.ReactNode
    imgIcon?: string
    disabled?: boolean
    onClickFunc?: () => void
}) => {

    const inner = (
        <motion.div
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="relative group p-[1px] rounded-lg bg-gradient-to-r from-brand to-accent shadow-brand-sm hover:shadow-brand-md transition-shadow duration-300"
        >
            {/* glow layer behind button */}
            <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-brand to-accent opacity-0 group-hover:opacity-30 blur-md transition-opacity duration-300 pointer-events-none" />

            <button
                type={buttonType}
                disabled={disabled}
                onClick={!isLinked ? onClickFunc : undefined}
                className="
          relative z-10 w-full h-full
          bg-gradient-to-r from-brand to-accent
          hover:from-brand-dark hover:to-accent-dark
          text-white font-semibold text-sm tracking-wide
          py-2.5 px-7 rounded-lg
          flex items-center justify-center gap-2.5
          transition-all duration-300
          disabled:opacity-40 disabled:cursor-not-allowed
        "
            >
                <span>{title}</span>
                {icon
                    ? <span className="text-base">{icon}</span>
                    : imgIcon
                        ? <Image src={imgIcon} alt="Icon" width={18} height={18} />
                        : null}
            </button>
        </motion.div>
    );

    return isLinked
        ? <Link href={link || ""} target={isNewTab ? "_blank" : "_self"}>{inner}</Link>
        : inner;
};

export default PrimaryButton;