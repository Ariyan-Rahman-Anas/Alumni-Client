"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    RiArrowLeftLine,
    RiFileTextLine,
    RiFilePdfLine,
    RiFileImageLine,
    RiFileZipLine,
    RiFileUnknowLine,
    RiAlertLine,
    RiInformationLine,
    RiMegaphoneLine,
    RiCalendarEventLine,
    RiNewspaperLine,
    RiRefreshLine,
} from "react-icons/ri";
import { useGetAnnouncementBySlugQuery } from "@/redux/apis/announcementApi";
import GoBackward from "@/components/shared/GoBackward";
import AnnouncementDetailsSkeleton from "@/components/modules/user/announcements/AnnouncementDetailsSkeleton";
import AnnouncementDetailsPageAside from "@/components/modules/user/announcements/AnnouncementDetailsPageAside";
import AnnouncementDetailsPageArticle from "@/components/modules/user/announcements/AnnouncementDetailsPageArticle";

/* --- Priority config --- */
export const PRIORITY_CONFIG = {
    urgent: {
        bar: "bg-red-500",
        badge: "bg-red-50 text-red-700 ring-1 ring-red-200",
        accent: "text-red-600",
        icon: <RiAlertLine />,
        label: "Urgent",
    },
    high: {
        bar: "bg-amber-500",
        badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        accent: "text-amber-600",
        icon: <RiAlertLine />,
        label: "High Priority",
    },
    normal: {
        bar: "bg-primary2-400",
        badge: "bg-primary2-50 text-primary2-700 ring-1 ring-primary2-200",
        accent: "text-primary2-600",
        icon: <RiInformationLine />,
        label: "Normal",
    },
};

/* --- Type config --- */
export const TYPE_CONFIG: Record<string, { badge: string; icon: React.ReactNode; label: string }> = {
    general: {
        badge: "bg-primary2-50 text-primary2-700 ring-1 ring-primary2-200",
        icon: <RiMegaphoneLine />,
        label: "General",
    },
    notice: {
        badge: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
        icon: <RiInformationLine />,
        label: "Notice",
    },
    event: {
        badge: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
        icon: <RiCalendarEventLine />,
        label: "Event",
    },
    news: {
        badge: "bg-primary2-50 text-primary2-700 ring-1 ring-primary2-200",
        icon: <RiNewspaperLine />,
        label: "News",
    },
    update: {
        badge: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
        icon: <RiRefreshLine />,
        label: "Update",
    },
    alert: {
        badge: "bg-red-50 text-red-700 ring-1 ring-red-200",
        icon: <RiAlertLine />,
        label: "Alert",
    },
};

/* --- File icon helper --- */
export function LocalFileIcon({ fileType }: { fileType: string }) {
    const type = fileType.toLowerCase();
    if (type.includes("pdf")) return <RiFilePdfLine className="text-red-500 text-lg shrink-0" />;
    if (type.includes("image") || type.match(/png|jpg|jpeg|gif|webp/))
        return <RiFileImageLine className="text-violet-500 text-lg shrink-0" />;
    if (type.includes("zip") || type.includes("rar"))
        return <RiFileZipLine className="text-amber-500 text-lg shrink-0" />;
    if (type.includes("text") || type.match(/doc|docx|txt/))
        return <RiFileTextLine className="text-blue-500 text-lg shrink-0" />;
    return <RiFileUnknowLine className="text-gray-400 text-lg shrink-0" />;
}

export function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}


const AnnouncementDetailPage = ({ slug }: { slug: string }) => {
    const router = useRouter();
    const { data, isLoading, isError } = useGetAnnouncementBySlugQuery(slug);
    const announcement = data?.data;

    return (
        <div className="three-xl-section-setup pb-24">
            {/* Back button */}
            <GoBackward text="Announcements" />

            {isLoading ? (
                <AnnouncementDetailsSkeleton />
            ) : isError || !announcement ? (
                <div className="flex flex-col items-center justify-center py-32 text-center">
                    <div className="h-16 w-16 rounded-full bg-surface-100 flex items-center justify-center mb-4">
                        <RiMegaphoneLine className="text-2xl text-muted-foreground" />
                    </div>
                    <h2 className="text-lg font-semibold text-primary2-900 mb-1">
                        Announcement not found
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        This announcement may have been removed or the link is invalid.
                    </p>
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary2-700 hover:bg-primary2-800 text-white px-5 py-2.5 text-sm font-medium transition-colors"
                    >
                        <RiArrowLeftLine /> Go Back
                    </button>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
                    className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 items-start"
                >
                    {/* LEFT — Main content */}
                    <AnnouncementDetailsPageArticle announcement={announcement} />

                    {/* RIGHT — Sticky sidebar */}
                    <AnnouncementDetailsPageAside announcement={announcement} />

                </motion.div>
            )}
        </div>
    );
};
export default AnnouncementDetailPage;
