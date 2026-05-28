const EventDetailsMetaChip = ({
    icon,
    label,
    value,
    accent = false,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    accent?: boolean;
}) => {
    return (
        <div
            className="flex items-start gap-3 rounded-2xl p-4"
            style={{
                background: accent ? "var(--color-primary2-50)" : "var(--color-surface-100)",
                border: `1px solid ${accent ? "var(--color-primary2-200)" : "var(--color-border)"}`,
            }}
        >
            <div
                className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl text-base"
                style={{
                    background: accent ? "var(--color-primary2-100)" : "var(--color-surface-200)",
                    color: accent ? "var(--color-primary2-700)" : "var(--color-text-secondary)",
                }}
            >
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--color-text-muted)" }}>
                    {label}
                </p>
                <p className="mt-0.5 text-sm font-semibold leading-snug" style={{ color: "var(--color-primary2-900)" }}>
                    {value}
                </p>
            </div>
        </div>
    )
}
export default EventDetailsMetaChip