"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { RiUserAddLine } from "react-icons/ri"
import LoginForm from "./LoginForm"

const RightSection = () => {
    return (
        <section>
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
                className="rounded-3xl border border-surface-400/50 bg-gradient-to-br from-surface to-surface-100 p-6 sm:p-8"
                style={{ boxShadow: "0 24px 65px rgba(5,31,21,0.22)" }}
            >
                <h2 className="text-2xl font-semibold text-primary2-900">
                    Alumni Sign In
                </h2>
                <p className="mt-2 text-sm text-neutral-500">
                    Access your alumni profile, batch updates, and association news.
                </p>

                <LoginForm />

                <p className="mt-6 text-center text-sm text-neutral-500">
                    Not registered yet?{" "}
                    <Link
                        href="/registration"
                        className="inline-flex items-center gap-1 font-semibold text-primary2-700 hover:underline"
                    >
                        Register as alumni <RiUserAddLine />
                    </Link>
                </p>
            </motion.div>
        </section>
    )
}
export default RightSection
