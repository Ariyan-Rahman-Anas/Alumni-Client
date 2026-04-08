"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RiLockPasswordLine, RiShieldCheckLine } from "react-icons/ri";

import PasswordField from "@/components/shared/PasswordField";
import PrimaryButton from "@/components/shared/PrimaryButton";

const ProfileChangePasswordPanel = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const isMismatch = confirmPassword.length > 0 && confirmPassword !== newPassword;
    const isValidLength = newPassword.length >= 8;

    const isSubmitDisabled =
        !currentPassword ||
        !newPassword ||
        !confirmPassword ||
        isMismatch ||
        !isValidLength;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-3xl border border-surface-300/50 bg-surface p-6 sm:p-8"
        >
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-primary2-600">Security</p>
                    <h2 className="mt-1 text-xl font-semibold text-primary2-900">Change Password</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Keep your account secure with a strong password and regular updates.
                    </p>
                </div>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary2-100 text-primary2-700 text-xl">
                    <RiLockPasswordLine />
                </span>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <PasswordField
                    label="Current Password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={setCurrentPassword}
                    required
                />

                <PasswordField
                    label="New Password"
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={setNewPassword}
                    helperText="Use 8+ characters with letters, numbers, and symbols."
                    required
                />

                <div className="sm:col-span-2">
                    <PasswordField
                        label="Confirm New Password"
                        placeholder="Re-enter new password"
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                        error={isMismatch ? "Passwords do not match" : undefined}
                        required
                    />
                </div>
            </div>

            <div className="mt-5 rounded-2xl border border-primary2-200 bg-primary2-50/60 px-4 py-3">
                <p className="flex items-start gap-2 text-sm text-primary2-800">
                    <RiShieldCheckLine className="mt-0.5 shrink-0 text-base" />
                    Password update UI is now ready. Connect this form with your password API endpoint to make it fully functional.
                </p>
            </div>

            <div className="mt-6 flex justify-end">
                <PrimaryButton
                    title="Update Password"
                    type="button"
                    isDisabled={isSubmitDisabled}
                    className="min-w-40"
                />
            </div>
        </motion.div>
    );
};

export default ProfileChangePasswordPanel;
