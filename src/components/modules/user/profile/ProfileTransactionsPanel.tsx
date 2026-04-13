"use client";

import { motion } from "framer-motion";
import { RiFolderInfoLine, RiWallet3Line } from "react-icons/ri";

const transactionStats = [
    { label: "Total Transactions", value: "0" },
    { label: "Completed", value: "0" },
    { label: "Pending", value: "0" },
];

const ProfileTransactionsPanel = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-3xl border border-surface-300/50 bg-surface p-6 sm:p-8"
        >
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-primary2-600">Transactions</p>
                    <h2 className="mt-1 text-xl font-semibold text-primary2-900">Payment Overview</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        This section is ready for your upcoming transaction feed and filters.
                    </p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary2-100 text-primary2-700 text-xl">
                    <RiWallet3Line />
                </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {transactionStats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-surface-300/50 bg-primary2-50/40 px-4 py-4">
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                        <p className="mt-1 text-2xl font-bold text-primary2-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="mt-6 rounded-2xl border border-dashed border-surface-400/70 bg-white/30 p-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary2-100 text-primary2-700 text-2xl">
                    <RiFolderInfoLine />
                </span>
                <h3 className="mt-3 text-base font-semibold text-primary2-900">No transactions yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Once transaction data is connected, recent activity and details will appear here.
                </p>
            </div>
        </motion.div>
    );
};

export default ProfileTransactionsPanel;
