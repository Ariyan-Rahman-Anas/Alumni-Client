import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"

const EventDetailsRegistrationRules = ({ description }: { description: string }) => {
    // Extract bullet-like rules from Bengali description
    const lines = description
        .split(/[*\n]/)
        .map((l) => l.trim())
        .filter((l) => l.length > 10);

    if (lines.length <= 1) {

        return (
            <FadeUpWrapper>
                <h1>About This Event</h1>
                <div
                    className="rounded-2xl p-6 text-sm leading-relaxed"
                    style={{
                        background: "var(--color-surface-100)",
                        border: "1px solid var(--color-border)",
                        color: "var(--color-text-secondary)",
                    }}
                >
                    {description}
                </div>
            </FadeUpWrapper>
        )
    }
}

export default EventDetailsRegistrationRules