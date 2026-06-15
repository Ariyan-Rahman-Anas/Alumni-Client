import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"

const EventDetailsRegistrationRules = ({ description }: { description: string }) => {
    return (
        <FadeUpWrapper>
            <h1>About This Event</h1>
            <div
                className="rounded-2xl p-6 text-sm leading-relaxed shadow">
                {description}
            </div>
        </FadeUpWrapper>
    )
}
export default EventDetailsRegistrationRules