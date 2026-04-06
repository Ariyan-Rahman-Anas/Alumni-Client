import { FadeUpWrapper } from "@/components/Pages/Home/HomePage";
import { RiCalendarEventLine, RiGroupLine, RiMapPin2Line, RiSparkling2Line } from "react-icons/ri";

const StatsSection = () => {

    /* ── Data ─────────────────────────────────────────────────── */
    const stats = [
        { value: "3,200+", label: "Alumni Worldwide", icon: <RiGroupLine /> },
        { value: "57", label: "Years of Excellence", icon: <RiSparkling2Line /> },
        { value: "120+", label: "Batches & Generations", icon: <RiCalendarEventLine /> },
        { value: "18+", label: "Countries Represented", icon: <RiMapPin2Line /> },
    ];

    return (
        <section className="relative section-warm"
            style={{
                // background: "var(--color-surface-100)",
                borderColor: "var(--color-border)",
            }}
        >
            <div className="three-xl-section-setup grid grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map(({ value, label, icon }, i) => (
                    <FadeUpWrapper key={label} delay={i * 0.08}>
                        <div className="flex flex-col items-center text-center p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1"
                            style={{
                                background: "var(--color-surface)",
                                borderColor: "var(--color-border)",
                                boxShadow: "var(--shadow-sm)",
                            }}
                        >
                            <span className="text-2xl mb-3" style={{ color: "var(--color-primary-500)" }}>
                                {icon}
                            </span>
                            <span className="font-display font-bold text-3xl md:text-4xl mb-1"
                                style={{ color: "var(--color-primary-800)" }}>
                                {value}
                            </span>
                            <span className=" text-sm" style={{ color: "var(--color-text-secondary)" }}>
                                {label}
                            </span>
                        </div>
                    </FadeUpWrapper>
                ))}
            </div>
        </section>
    )
}
export default StatsSection