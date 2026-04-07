"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { RiUser3Line } from "react-icons/ri";
import RegistrationForm from "./RegistrationForm";

const RightSection = () => {
    return (
        <section>
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
                className="rounded-3xl border p-6 sm:p-8"
                style={{
                    background: "linear-gradient(140deg, #fffef8 0%, #f7f3e8 100%)",
                    borderColor: "rgba(200,188,160,0.56)",
                    boxShadow: "0 24px 65px rgba(5,31,21,0.22)",
                }}
            >
                <h2 className="text-2xl font-semibold" style={{ color: "var(--color-primary-900)" }}>
                    Create your account
                </h2>
                <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    Enter your details to register as a BAMHS alumni member.
                </p>

                <RegistrationForm />

                <p className="mt-6 text-center text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    Already have an account?{" "}
                    <Link href="/login" className="inline-flex items-center gap-1 font-semibold hover:underline" style={{ color: "var(--color-primary-700)" }}>
                        Login now <RiUser3Line />
                    </Link>
                </p>
            </motion.div>
        </section>
    );
};

export default RightSection;
