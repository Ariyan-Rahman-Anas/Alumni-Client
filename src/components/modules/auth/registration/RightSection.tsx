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
                className="rounded-3xl rounded-t-none lg:rounded-tl-none lg:rounded-tr-3xl bg-white dark:bg-gunmetal-600 p-7 sm:p-9"
            >
                <div className="mb-4">
                    <h2 className="text-2xl font-bold leading-tight text-primary2-900 dark:text-gunmetal-100 sm:text-[1.7rem]">
                        Register as BAMHS Alumni
                    </h2>
                    <p className="mt-1 text-sm leading-relaxed text-gunmetal-300">
                        Submit your details once, your profile goes live after email
                        verification and admin approval.
                    </p>
                </div>

                <RegistrationForm />

                <p className="mt-6 text-center text-sm text-gunmetal-300">
                    Already registered?{" "}
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                    >
                        Sign in to your account <RiLoginBoxLine />
                    </Link>
                </p>
            </motion.div>
        </section>
    );
};
export default RightSection;
