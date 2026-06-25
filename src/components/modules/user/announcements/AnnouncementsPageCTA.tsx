import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import { useRouter } from "next/navigation"
import { RiArrowRightLine } from "react-icons/ri"

const AnnouncementsPageCTA = () => {
    const router = useRouter()
    return (
        <FadeUpWrapper delay={0.3} className="three-xl-section-setup">
            <div className="relative rounded-3xl overflow-hidden border border-primary2-200/50 bg-gradient-to-br from-primary2-50 to-white px-7 py-10 sm:px-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="pointer-events-none absolute right-0 top-0 h-full w-1/2 opacity-30"
                    style={{ background: "radial-gradient(ellipse at 100% 50%, rgba(46,139,87,0.25), transparent 70%)" }} />
                <div className="relative z-10">
                    <h3 className="text-xl font-extrabold text-primary2-900">
                        Never miss an update
                    </h3>
                    <p className="mt-1.5 text-sm text-muted-foreground max-w-md">
                        Important notices and time-sensitive alerts are posted here first.
                        Check back regularly or contact the alumni office for direct correspondence.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => router.push("/contact")}
                    className="relative z-10 shrink-0 inline-flex items-center gap-2 rounded-xl bg-primary2-800 hover:bg-primary2-900 text-white px-6 py-3 text-sm font-semibold transition-colors shadow-sm"
                >
                    Contact Us <RiArrowRightLine />
                </button>
            </div>
        </FadeUpWrapper>
    )
}
export default AnnouncementsPageCTA