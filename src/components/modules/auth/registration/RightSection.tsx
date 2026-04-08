"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RiLoginBoxLine } from "react-icons/ri";
import RegistrationForm from "./RegistrationForm";

const RightSection = () => {
    return (
        <section>
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.12, ease: [0.19, 1, 0.22, 1] }}
                className="rounded-3xl border border-surface-400/50 bg-gradient-to-br from-surface to-surface-100 p-7 sm:p-9"
                style={{ boxShadow: "0 24px 65px rgba(5,31,21,0.20)" }}
            >
                <div className="mb-6 border-b border-surface-300/35 pb-6">
                    <h2 className="text-2xl font-bold leading-tight text-primary2-900 sm:text-[1.7rem]">
                        Register as BAMHS Alumni
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                        Submit your details once, your profile goes live after email
                        verification and admin approval.
                    </p>
                </div>

                <RegistrationForm />

                <p className="mt-6 text-center text-sm text-neutral-500">
                    Already registered?{" "}
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1 font-semibold text-primary2-700 hover:underline"
                    >
                        Sign in to your account <RiLoginBoxLine />
                    </Link>
                </p>
            </motion.div>
        </section>
    );
};

export default RightSection;
