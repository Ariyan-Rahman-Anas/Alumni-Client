const EventDetailsMetaChip = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
}) => {
    return (
        <div
            className="flex items-start gap-3 rounded-2xl p-4 shadow hover:-translate-y-1 transition-all duration-300"
        >
            <div
                className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-base shadow">
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