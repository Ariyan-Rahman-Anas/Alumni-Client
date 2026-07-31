"use client";

import { motion } from "framer-motion";
import UserProfileAvatar from "./UserProfileAvatar";
import { IUserProfile } from "./user-profile.types";
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";

interface ProfileHeroProps {
    user: IUserProfile;
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
                    <UserProfileAvatar
                        imageUrl={user.imageUrl}
                        name={user.name}
                        pendingImage={pendingImage}
                        onImageChange={onImageChange}
                    />
                </motion.div>

                {/* Info */}
                <FadeUpWrapper
                    delay={0.12}
                    className="flex flex-col items-center sm:items-start gap-2 pb-1"
                >
                    <h1 className="text-2xl sm:text-3xl font-bold text-white dark:text-gunmetal-200 leading-tight">
                        {user.name}
                    </h1>

                    {/* Email */}
                    <span className="text-white/60">
                        {user.email}
                    </span>

                    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2">
                        {/* Batch */}
                        {user.section && (
                            <span className="rounded-full bg-sky-500/20 border border-sky-500/30 px-3 py-0.5 text-xs font-medium text-sky-200">
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
                </FadeUpWrapper>
            </div>
        </div>
    );
};

export default ProfileHero;
