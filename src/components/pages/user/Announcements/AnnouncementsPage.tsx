"use client";

import {
    RiMegaphoneLine,
    RiAlertLine,
    RiInformationLine,
    RiCalendarEventLine,
    RiNewspaperLine,
    RiRefreshLine,
    RiErrorWarningLine,
    RiCheckboxCircleLine,
} from "react-icons/ri";
import AnnouncementsPageHead from "@/components/modules/user/announcements/AnnouncementsPageHead";
import AnnouncementsPageCTA from "@/components/modules/user/announcements/AnnouncementsPageCTA";
import AnnouncementsPageAnnouncements from "@/components/modules/user/announcements/AnnouncementsPageAnnouncements";
import { constantsData } from "@/constants";

export const announcementPriorityStyle = {
    urgent: {
        bar: "bg-red-500",
        soft: "bg-red-50 text-red-700 ring-1 ring-red-200",
        icon: <RiErrorWarningLine />,
        label: "Urgent",
    },
    high: {
        bar: "bg-amber-400",
        soft: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
        icon: <RiAlertLine />,
        label: "High",
    },
    normal: {
        bar: "bg-primary2-400",
        soft: "bg-primary2-50 text-primary2-700 ring-1 ring-primary2-200",
        icon: <RiCheckboxCircleLine />,
        label: "Info",
    },
};

export const announcementTypeStyle: Record<string, { soft: string; icon: React.ReactNode; label: string }> = {
    general: { soft: "bg-primary2-50 text-primary2-700", icon: <RiMegaphoneLine />, label: "General" },
    notice: { soft: "bg-sky-50 text-sky-700", icon: <RiInformationLine />, label: "Notice" },
    event: { soft: "bg-violet-50 text-violet-700", icon: <RiCalendarEventLine />, label: "Event" },
    news: { soft: "bg-teal-50 text-teal-700", icon: <RiNewspaperLine />, label: "News" },
    update: { soft: "bg-indigo-50 text-indigo-700", icon: <RiRefreshLine />, label: "Update" },
    alert: { soft: "bg-red-50 text-red-700", icon: <RiAlertLine />, label: "Alert" },
};

export const announcementTypeFilterStyle0: { label: string; value: keyof typeof announcementTypeStyle | "all"; icon?: React.ReactNode }[] = [
    { label: "All", value: "all" },
    { label: "General", value: "GEN", icon: <RiMegaphoneLine /> },
    { label: "Notice", value: "NOTICE", icon: <RiInformationLine /> },
    { label: "Event", value: "EVENT", icon: <RiCalendarEventLine /> },
    { label: "News", value: "NEWS", icon: <RiNewspaperLine /> },
    { label: "Update", value: "UPDATE", icon: <RiRefreshLine /> },
    { label: "Alert", value: "ALERT", icon: <RiAlertLine /> },
];

export const announcementTypeFilterStyle = Object.values(constantsData.announcement.type).map((type) => ({
    label: type.charAt(0).toUpperCase() + type.slice(1),
    value: type,
    icon: announcementTypeStyle[type.toLowerCase()]?.icon,
}));

const AnnouncementsPage = () => {
    return (
        <div className="">
            <AnnouncementsPageHead />

            <AnnouncementsPageAnnouncements />

            <AnnouncementsPageCTA />
        </div>
    );
};
export default AnnouncementsPage;