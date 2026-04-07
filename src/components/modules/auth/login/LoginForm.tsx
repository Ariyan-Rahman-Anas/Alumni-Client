import { Button } from "@/components/ui/button"
import Link from "next/link"
import { RiArrowRightLine, RiLock2Line, RiMailLine } from "react-icons/ri"

const LoginForm = () => {
    return (
        <form className="mt-7 space-y-5">
            <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.14em]" style={{ color: "var(--color-primary-700)" }}>
                    Email Address
                </label>
                <div className="relative">
                    <RiMailLine className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg" style={{ color: "var(--color-primary-500)" }} />
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
                    Password
                </label>
                <div className="relative">
                    <RiLock2Line className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-lg" style={{ color: "var(--color-primary-500)" }} />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        className="h-12 w-full rounded-xl border bg-white pl-10 pr-4 text-sm outline-none transition focus:ring-2"
                        style={{
                            borderColor: "var(--color-border)",
                            color: "var(--color-text-primary)",
                        }}
                    />
                </div>
            </div>

            <div className="flex items-center justify-between pt-1 text-sm">
                <label className="inline-flex items-center gap-2" style={{ color: "var(--color-text-secondary)" }}>
                    <input type="checkbox" className="h-4 w-4 rounded" />
                    Remember me
                </label>
                <Link href="#" className="font-medium hover:underline" style={{ color: "var(--color-primary-600)" }}>
                    Forgot password?
                </Link>
            </div>

            <Button
                type="submit"
                size="lg"
                className="h-12 w-full rounded-xl text-sm font-medium"
                style={{
                    background: "linear-gradient(135deg, #2e8b57 0%, #155a3e 100%)",
                    color: "#fdfaf2",
                    boxShadow: "0 10px 26px rgba(46,139,87,0.28)",
                }}
            >
                Login to Dashboard <RiArrowRightLine className="ml-1" />
            </Button>
        </form>
    )
}
export default LoginForm