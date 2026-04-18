"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RiCheckboxCircleLine, RiLockPasswordLine, RiShieldCheckLine } from "react-icons/ri";
import { toast } from "sonner";

import PasswordField from "@/components/shared/PasswordField";
import PrimaryButton from "@/components/shared/PrimaryButton";
import { useChangePasswordMutation } from "@/redux/apis/authApi";

const ProfileChangePasswordPanel = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [changePassword, { isLoading }] = useChangePasswordMutation();

    const isMismatch = confirmPassword.length > 0 && confirmPassword !== newPassword;
    const isValidLength = newPassword.length >= 6;

    const isSubmitDisabled =
        !currentPassword ||
        !newPassword ||
        !confirmPassword ||
        isMismatch ||
        !isValidLength ||
        isLoading;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isSubmitDisabled) return;

        try {
            await changePassword({ currentPassword, newPassword }).unwrap();
            toast.success("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: unknown) {
            const msg =
                (err as { data?: { message?: string } })?.data?.message ??
                "Failed to change password. Please try again.";
            toast.error(msg);
        }
    };

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

            <form onSubmit={handleSubmit} className="mt-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <PasswordField
                        label="Current Password"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={setCurrentPassword}
                        required
                    />

                    <PasswordField
                        label="New Password"
                        placeholder="At least 6 characters"
                        value={newPassword}
                        onChange={setNewPassword}
                        helperText="Use 6+ characters with letters, numbers, and symbols."
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
                        Choose a strong password you haven&apos;t used before. You&apos;ll stay logged in on this device.
                    </p>
                </div>

                <div className="mt-6 flex justify-end">
                    <PrimaryButton
                        title="Update Password"
                        loadingTitle="Updating..."
                        type="submit"
                        icon2={<RiCheckboxCircleLine />}
                        iconSide2="right"
                        isLoading={isLoading}
                        isDisabled={isSubmitDisabled}
                        className="min-w-40"
                    />
                </div>
            </form>
        </motion.div>
    );
};

export default ProfileChangePasswordPanel;
