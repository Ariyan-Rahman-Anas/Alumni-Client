import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"

const EventDetailsEventFlow = ({ flow }: { flow: string[] }) => {
    return (
        <FadeUpWrapper>
            <h1>Program Schedule</h1>
            <div className="relative space-y-0">
                {/* vertical line */}
                <div
                    className="absolute left-[17px] top-4 h-[calc(100%-2rem)] w-px"
                    style={{ background: "linear-gradient(to bottom, var(--color-primary2-300), transparent)" }}
                />
                {flow.map((item, i) => (
                    <FadeUpWrapper
                        key={i}
                        className="relative flex items-start gap-4 pb-5"
                    >
                        {/* dot */}
                        <div
                            className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full shadow text-sm font-extrabold">
                            {i + 1}
                        </div>
                        <div
                            className="flex-1 rounded-2xl p-4 shadow ">
                            <p className="text-sm font-medium leading-snug" style={{ color: "var(--color-primary2-900)" }}>
                                {item}
                            </p>
                        </div>
                    </FadeUpWrapper>
                ))}
            </div>
        </FadeUpWrapper>
    )
}
export default EventDetailsEventFlow