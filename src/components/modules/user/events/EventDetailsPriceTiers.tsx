import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import { PriceTier } from "@/types/common/events.types";
import { RiInformationLine } from "react-icons/ri"

const EventDetailsPriceTiers = ({ tiers, guestFee, allowGuests }: { tiers: PriceTier[]; guestFee?: number; allowGuests?: boolean }) => {
    const TIER_GRADIENTS = [
        "from-primary2-400 to-primary2-600",
        "from-amber-400 to-amber-600",
        "from-violet-400 to-violet-600",
        "from-pink-400 to-pink-600",
        "from-sky-400 to-sky-600",
    ];
    return (
        <FadeUpWrapper>
            <h2 className="text-2xl font-bold">Registration Fees</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tiers.map((tier, i) => (
                    <div
                        key={tier.label}
                        className="relative overflow-hidden rounded-2xl p-5"
                        style={{ background: "var(--color-surface-100)", border: "1px solid var(--color-border)" }}
                    >
                        {/* colour bar */}
                        <div className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b ${TIER_GRADIENTS[i % TIER_GRADIENTS.length]}`} />
                        <div className="pl-3">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-sm font-bold" style={{ color: "var(--color-primary2-900)" }}>
                                        {tier.label}
                                    </p>
                                    {tier.batchFrom && tier.batchTo && (
                                        <p className="mt-0.5 text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                                            Batch {tier.batchFrom}“{tier.batchTo}
                                        </p>
                                    )}
                                </div>
                                <p
                                    className="text-xl font-extrabold tabular-nums"
                                    style={{ color: "var(--color-primary2-800)" }}
                                >
                                    {tier.fee.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Guest tier */}
                {allowGuests && guestFee !== undefined && (
                    <div
                        className="relative overflow-hidden rounded-2xl p-5"
                        style={{ background: "var(--color-gold-50)", border: "1px solid var(--color-gold-200)" }}
                    >
                        <div className="absolute left-0 top-0 h-full w-1 rounded-l-2xl bg-gradient-to-b from-amber-400 to-amber-600" />
                        <div className="pl-3 flex items-start justify-between">
                            <div>
                                <p className="text-sm font-bold" style={{ color: "#78350F" }}>Guest</p>
                                <p className="mt-0.5 text-[11px]" style={{ color: "#92400E" }}>Per accompanying guest</p>
                            </div>
                            <p className="text-xl font-extrabold tabular-nums" style={{ color: "#78350F" }}>
                                {guestFee.toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Bkash fee note */}
            <p
                className="mt-3 flex items-start gap-1.5 text-xs leading-snug"
                style={{ color: "var(--color-text-muted)" }}
            >
                <RiInformationLine className="mt-0.5 flex-shrink-0" />
                Bkash payments incur an additional 15 charge per 1,000. Bank transfer: deposit first, then register with the slip.
            </p>
        </FadeUpWrapper>
    )
}
export default EventDetailsPriceTiers