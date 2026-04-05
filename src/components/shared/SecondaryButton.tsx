"use client"

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

type SecondaryButtonProps = {
    buttonType?: "button" | "submit" | "reset";
    title: string;
    link?: string;
    isLinked?: boolean;
    isNewTab?: boolean;
    icon?: React.ReactNode;
    imgIcon?: string;
    disabled?: boolean;
    onClickFunc?: () => void;
};

const SecondaryButton = ({
    buttonType = "button",
    title,
    link,
    isLinked = false,
    isNewTab = false,
    icon,
    imgIcon,
    disabled,
    onClickFunc,
}: SecondaryButtonProps) => {

    const inner = (
        <motion.button
            type={buttonType}
            disabled={disabled}
            onClick={!isLinked ? onClickFunc : undefined}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="
        group relative flex items-center justify-center gap-2.5
        px-6 py-2.5 rounded-lg
        border border-white/15 hover:border-brand/40
        bg-white/5 hover:bg-brand/8
        text-white/80 hover:text-white
        text-sm font-medium tracking-wide
        backdrop-blur-sm
        transition-all duration-300
        disabled:opacity-40 disabled:cursor-not-allowed
        overflow-hidden
      "
        >
            {/* Shine sweep on hover */}
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12" />

            <span className="relative z-10">{title}</span>

            {icon ? (
                <span className="relative z-10 text-base transition-transform duration-300 group-hover:translate-x-0.5">
                    {icon}
                </span>
            ) : imgIcon ? (
                <Image src={imgIcon} alt="icon" width={18} height={18} className="relative z-10" />
            ) : null}
        </motion.button>
    );

    return isLinked ? (
        <Link href={link || ""} target={isNewTab ? "_blank" : "_self"}>
            {inner}
        </Link>
    ) : inner;
};

export default SecondaryButton;