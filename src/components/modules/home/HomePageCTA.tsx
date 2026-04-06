import { FadeUpWrapper } from "@/components/Pages/Home/HomePage"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { RiArrowRightLine, RiHandHeartLine } from "react-icons/ri"

const HomePageCTA = () => {
    return (
        <section className="relative three-xl-section-setup overflow-hidden md:rounded-3xl"
            style={{ background: "linear-gradient(160deg, #051F15 0%, #0A3D2B 100%)" }}>
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(46,139,87,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.06) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                }} />
            <div className="relative z-10 text-center ">
                <FadeUpWrapper>
                    <RiHandHeartLine className="text-5xl mx-auto mb-6"
                        style={{ color: "var(--color-primary-400)" }} />
                    <h2 className="font-display font-bold mb-5"
                        style={{
                            fontSize: "clamp(2.2rem, 5vw, 3.8rem)",
                            color: "var(--color-primary-50)",
                            letterSpacing: "-0.025em",
                        }}
                    >
                        You&apos;re always{" "}
                        <span className="font-serif italic" style={{ color: "var(--color-primary-300)" }}>
                            home
                        </span>{" "}
                        here
                    </h2>
                    <p className=" text-lg mb-10" style={{ color: "rgba(195,232,206,0.70)" }}>
                        Whether you graduated last year or three decades ago — BAMHS remembers you.
                        Join thousands of alumni and stay connected with your roots.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild size="lg"
                            className="rounded-xl font-medium px-10 py-6 text-base"
                            style={{
                                background: "linear-gradient(135deg, #2E8B57 0%, #155A3E 100%)",
                                color: "#FDFAF2",
                                boxShadow: "0 0 28px rgba(46,139,87,0.40)",
                            }}>
                            <Link href="/login">Join BAMHS Alumni <RiArrowRightLine className="ml-1" /></Link>
                        </Button>
                        <Button asChild variant="outline" size="lg"
                            className="rounded-xl font-medium px-10 py-6 text-base"
                            style={{ borderColor: "rgba(46,139,87,0.40)", color: "var(--color-primary-200)" }}>
                            <Link href="/request">Request for Alumni</Link>
                        </Button>
                    </div>
                </FadeUpWrapper>
            </div>
        </section>
    )
}
export default HomePageCTA