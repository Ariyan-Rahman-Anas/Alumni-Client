import { Button } from "@/components/ui/button";
import { RiArrowRightLine, RiLock2Line, RiMailLine, RiPhoneLine, RiUser3Line } from "react-icons/ri";

const RegistrationForm = () => {
    return (
        <form className="mt-7 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.14em]" style={{ color: "var(--color-primary-700)" }}>
                        Full Name
                    </label>
                    <div className="relative">
                        <RiUser3Line
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg"
                            style={{ color: "var(--color-primary-500)" }}
                        />
                        <input
                            type="text"
                            placeholder="Your full name"
                            className="h-12 w-full rounded-xl border bg-white pl-10 pr-4 text-sm outline-none transition focus:ring-2"
                            style={{
                                borderColor: "var(--color-border)",
                                color: "var(--color-text-primary)",
                            }}
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.14em]" style={{ color: "var(--color-primary-700)" }}>
                        Batch Year
                    </label>
                    <input
                        type="number"
                        placeholder="e.g. 2014"
                        className="h-12 w-full rounded-xl border bg-white px-4 text-sm outline-none transition focus:ring-2"
                        style={{
                            borderColor: "var(--color-border)",
                            color: "var(--color-text-primary)",
                        }}
                    />
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.14em]" style={{ color: "var(--color-primary-700)" }}>
                        Email Address
                    </label>
                    <div className="relative">
                        <RiMailLine
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg"
                            style={{ color: "var(--color-primary-500)" }}
                        />
                        <input
                            type="email"
                            placeholder="you@bamhs.org"
                            className="h-12 w-full rounded-xl border bg-white pl-10 pr-4 text-sm outline-none transition focus:ring-2"
                            style={{
                                borderColor: "var(--color-border)",
                                color: "var(--color-text-primary)",
                            }}
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.14em]" style={{ color: "var(--color-primary-700)" }}>
                        Phone Number
                    </label>
                    <div className="relative">
                        <RiPhoneLine
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg"
                            style={{ color: "var(--color-primary-500)" }}
                        />
                        <input
                            type="tel"
                            placeholder="01XXXXXXXXX"
                            className="h-12 w-full rounded-xl border bg-white pl-10 pr-4 text-sm outline-none transition focus:ring-2"
                            style={{
                                borderColor: "var(--color-border)",
                                color: "var(--color-text-primary)",
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.14em]" style={{ color: "var(--color-primary-700)" }}>
                        Password
                    </label>
                    <div className="relative">
                        <RiLock2Line
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg"
                            style={{ color: "var(--color-primary-500)" }}
                        />
                        <input
                            type="password"
                            placeholder="Create password"
                            className="h-12 w-full rounded-xl border bg-white pl-10 pr-4 text-sm outline-none transition focus:ring-2"
                            style={{
                                borderColor: "var(--color-border)",
                                color: "var(--color-text-primary)",
                            }}
                        />
                    </div>
                </div>

                <div>
                    <label className="mb-2 block text-xs uppercase tracking-[0.14em]" style={{ color: "var(--color-primary-700)" }}>
                        Confirm Password
                    </label>
                    <div className="relative">
                        <RiLock2Line
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg"
                            style={{ color: "var(--color-primary-500)" }}
                        />
                        <input
                            type="password"
                            placeholder="Repeat password"
                            className="h-12 w-full rounded-xl border bg-white pl-10 pr-4 text-sm outline-none transition focus:ring-2"
                            style={{
                                borderColor: "var(--color-border)",
                                color: "var(--color-text-primary)",
                            }}
                        />
                    </div>
                </div>
            </div>

            <Button
                type="submit"
                size="lg"
                className="mt-2 h-12 w-full rounded-xl text-sm font-medium"
                style={{
                    background: "linear-gradient(135deg, #2e8b57 0%, #155a3e 100%)",
                    color: "#fdfaf2",
                    boxShadow: "0 10px 26px rgba(46,139,87,0.28)",
                }}
            >
                Complete Registration <RiArrowRightLine className="ml-1" />
            </Button>
        </form>
    );
};

export default RegistrationForm;
