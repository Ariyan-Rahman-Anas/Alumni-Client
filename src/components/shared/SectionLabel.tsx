"use client"

import { cn } from "@/lib/utils"
import { ReactNode } from "react"

type SectionLabelProps = {
    text: string
    icon?: ReactNode
    variant?: "pill"
    align?: "left" | "center" | "right"
    className?: string
}

const alignMap = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
}

// ── Variant — Pill (bordered badge) 
const PillLabel = ({
    text,
    icon,
    classname,
}: {
    text: string
    icon?: ReactNode
    classname: string
}) => {
    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase border border-primary2-100 bg-primary2-100/20 text-primary2-600",
            classname
        )}
        >
            {icon && <span className="text-sm leading-none">{icon}</span>}
            {text}
        </span>
    )
}

// ── Main export ───────────────────────────────────────────────
const SectionLabel = ({
    text,
    icon,
    variant = "pill",
    align = "center",
    className = "mb-2",
}: SectionLabelProps) => {
    return (
        <div className={`flex ${alignMap[align]} ${className}`}>
            {variant === "pill" && <PillLabel classname={className} text={text} icon={icon} />}
        </div>
    )
}
export default SectionLabel