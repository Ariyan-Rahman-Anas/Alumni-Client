import { FadeUpWrapper } from "@/components/Pages/Home/HomePage"
import { Button } from "@/components/ui/button"
import { Badge } from "lucide-react"
import Link from "next/link"
import { RiBookLine } from "react-icons/ri"

const BloodSection = () => {
    return (
        <section className="section-warm">
            <div className="three-xl-section-setup">
                <FadeUpWrapper>
                    <div className="relative rounded-3xl overflow-hidden p-10 md:p-16 flex flex-col md:flex-row items-center gap-10"
                        style={{
                            background: "linear-gradient(135deg, #7B0D1E 0%, #A31C30 100%)",
                            boxShadow: "0 24px 64px rgba(123,13,30,0.30)",
                        }}
                    >
                        {/* bg pattern */}
                        <div className="absolute inset-0 pointer-events-none"
                            style={{
                                backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
                                backgroundSize: "40px 40px",
                            }} />
                        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-20 bg-red-300" />

                        <div className="relative z-10 flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <RiBookLine className="text-3xl text-red-200" />
                                <Badge className=" text-[10px] tracking-wider uppercase bg-white/10 text-red-100 border-white/20">
                                    Community Service
                                </Badge>
                            </div>
                            <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-3"
                                style={{ letterSpacing: "-0.02em" }}>
                                Blood Bank Initiative
                            </h2>
                            <p className=" text-base text-red-100/80 leading-relaxed max-w-lg">
                                BAMHSians saving lives. Our alumni blood bank connects donors and
                                recipients across Bangladesh. Register as a donor today.
                            </p>
                        </div>
                        <div className="relative z-10 flex flex-col gap-3 shrink-0">
                            <Button asChild size="lg"
                                className="rounded-xl font-medium text-base px-8 py-6 bg-white text-red-700 hover:bg-red-50 shadow-xl">
                                <Link href="/bloodbank">Register as Donor</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg"
                                className="rounded-xl font-medium text-base px-8 py-6 border-white/30 text-white hover:bg-white/10">
                                <Link href="/bloodbank">Find a Donor</Link>
                            </Button>
                        </div>
                    </div>
                </FadeUpWrapper>
            </div>
        </section>
    )
}

export default BloodSection