"use client"

import Link from "next/link"
import { RiUserAddLine } from "react-icons/ri"
import LoginForm from "./LoginForm"
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"

const RightSection = () => {
    return (
        <FadeUpWrapper delay={0.1}
            className="rounded-b-3xl md:rounded-l-none md:rounded-r-3xl bg-white dark:bg-gunmetal-600 p-6 sm:p-8"
            style={{ boxShadow: "0 24px 65px rgba(5,31,21,0.22)" }}
        >
            <h2 className="text-2xl font-semibold text-primary2-900 dark:text-gunmetal-100">
                Sign in
            </h2>
            <p className="mt-2 text-sm text-gunmetal-300">
                Enter the email and password for your alumni profile.
            </p>

            <LoginForm />

            <p className="mt-6 text-center text-sm text-gunmetal-300">
                Not registered yet?{" "}
                <Link
                    href="/registration"
                    className="inline-flex items-center gap-1 font-semibold text-primary2-600 dark:text-primary hover:underline"
                >
                    Register as alumni <RiUserAddLine />
                </Link>
            </p>
        </FadeUpWrapper>
    )
}
export default RightSection
