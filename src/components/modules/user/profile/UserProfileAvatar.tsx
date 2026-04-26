"use client";

import Image from "next/image";
import { useRef } from "react";
import { RiCameraLine, RiUserLine } from "react-icons/ri";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface UserProfileAvatarProps {
    imageUrl?: string;
    name: string;
    pendingImage: File | null;
    onImageChange: (file: File | null) => void;
    size?: "md" | "lg";
}

const getInitials = (name: string) =>
    name
        .trim()
        .split(" ")
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase() ?? "")
        .join("");

const UserProfileAvatar = ({
    imageUrl,
    name,
    pendingImage,
    onImageChange,
    size = "lg",
}: UserProfileAvatarProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const previewSrc = pendingImage ? URL.createObjectURL(pendingImage) : imageUrl;
    const initials = getInitials(name);
    const dim = size === "lg" ? 120 : 80;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        if (file) onImageChange(file);
        // reset so same file can be re-selected
        e.target.value = "";
    };

    return (
        <motion.div
            className="relative shrink-0 cursor-pointer group"
            style={{ width: dim, height: dim }}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => inputRef.current?.click()}
        >
            {/* Avatar circle */}
            <div
                className={cn(
                    "rounded-full overflow-hidden ring-4 ring-white/30 bg-primary2-800 flex items-center justify-center text-white font-bold select-none",
                    size === "lg" ? "text-3xl" : "text-xl"
                )}
                style={{ width: dim, height: dim }}
            >
                {previewSrc ? (
                    <Image
                        src={previewSrc}
                        alt={name}
                        width={800}
                        height={800}
                        className="object-cover w-full h-full"
                        unoptimized={Boolean(pendingImage)}
                    />
                ) : initials ? (
                    <span>{initials}</span>
                ) : (
                    <RiUserLine className="text-4xl opacity-70" />
                )}
            </div>

            {/* Camera overlay */}
            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <RiCameraLine className="text-white text-2xl" />
            </div>

            {/* Pending indicator dot */}
            {pendingImage && (
                <span className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-amber-400 ring-2 ring-white" />
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
            />
        </motion.div>
    );
};
export default UserProfileAvatar;