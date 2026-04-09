"use client";

import { motion } from "framer-motion";
import { RiMailLine } from "react-icons/ri";
import type { UserProfile } from "@/redux/apis/userApi";
import ProfileAvatar from "./ProfileAvatar";

interface ProfileHeroProps {
    user: UserProfile;
    pendingImage: File | null;
    onImageChange: (file: File | null) => void;
}

const ProfileHero = ({ user, pendingImage, onImageChange }: ProfileHeroProps) => {

    return (
        <div
            className="relative overflow-hidden rounded-3xl"
            style={{
                background:
                    "linear-gradient(135deg, #041a12 0%, #0a3d2b 55%, #051f15 100%)",
            }}
        >
            {/* Grid texture */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(46,139,87,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(46,139,87,0.07) 1px, transparent 1px)",
                    backgroundSize: "48px 48px",
                }}
            />

            {/* Glow blobs */}
            <div
                className="absolute -top-16 -left-16 h-60 w-60 rounded-full blur-3xl pointer-events-none"
                style={{ background: "rgba(77,180,114,0.18)" }}
            />
            <div
                className="absolute -bottom-12 -right-8 h-52 w-52 rounded-full blur-3xl pointer-events-none"
                style={{ background: "rgba(245,158,11,0.12)" }}
            />

            <div className="relative z-10 px-6 py-10 sm:px-10 flex flex-col sm:flex-row items-center sm:items-end gap-6">
                {/* Avatar */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                >
                    <ProfileAvatar
                        imageUrl={user.imageUrl}
                        name={user.name}
                        pendingImage={pendingImage}
                        onImageChange={onImageChange}
                    />
                </motion.div>

                {/* Info */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.12, ease: [0.19, 1, 0.22, 1] }}
                    className="flex flex-col items-center sm:items-start gap-2 pb-1"
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                        {user.name}
                    </h1>

                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                        {/* Email */}
                        <span className="flex items-center gap-1.5 text-sm text-white/60">
                            <RiMailLine className="shrink-0" />
                            {user.email}
                        </span>

                        {/* Batch */}
                        {user.batch && (
                            <span className="rounded-full bg-primary2-700/50 border border-primary2-600/40 px-3 py-0.5 text-xs font-medium text-primary2-200">
                                Batch - {user.batch}
                            </span>
                        )}

                        {/* Section */}
                        {user.section && (
                            <span className="rounded-full bg-sky-500/20 border border-sky-500/30 px-3 py-0.5 text-xs font-medium text-sky-200">
                                {user.section}
                            </span>
                        )}
                    </div>

                    <p className="text-xs text-white/40 mt-0.5">
                        Click avatar to change photo
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfileHero;
