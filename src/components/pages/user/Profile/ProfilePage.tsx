"use client";

import { useState } from "react";
import { useSelector } from "react-redux";

import { useGetUserProfileQuery } from "@/redux/apis/userApi";
import ProfileHero from "@/components/modules/user/profile/ProfileHero";
import ProfileForm from "@/components/modules/user/profile/ProfileForm";
import ProfileSidebar, { type ProfileSectionKey } from "@/components/modules/user/profile/ProfileSidebar";
import ProfileTransactionsPanel from "@/components/modules/user/profile/ProfileTransactionsPanel";
import ProfileChangePasswordPanel from "@/components/modules/user/profile/ProfileChangePasswordPanel";
import { selectCurrentUser } from "@/redux/slice/authSlice";

const ProfileSkeleton = () => (
    <div className="flex flex-col gap-5 animate-pulse">
        {/* Hero skeleton */}
        <div className="rounded-3xl h-48 bg-surface-200" />
        {/* Cards skeleton */}
        {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-surface-300/40 bg-surface h-44" />
        ))}
    </div>
);

const ProfilePage = () => {
    const authUser = useSelector(selectCurrentUser);
    const [pendingImage, setPendingImage] = useState<File | null>(null);
    const [activeSection, setActiveSection] = useState<ProfileSectionKey>("profile-info");

    const { data, isLoading, isError } = useGetUserProfileQuery(authUser?._id ?? "", {
        skip: !authUser?._id,
    });

    const user = data?.data;

    if (!authUser || isLoading) return <ProfileSkeleton />;

    if (isError || !user) {
        return (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                <p className="text-lg font-semibold text-primary2-900">
                    Could not load profile
                </p>
                <p className="text-sm text-muted-foreground">
                    Please refresh the page or try again later.
                </p>
            </div>
        );
    }

    const renderActiveSection = () => {
        if (activeSection === "transactions") {
            return <ProfileTransactionsPanel />;
        }

        if (activeSection === "change-password") {
            return <ProfileChangePasswordPanel />;
        }

        return (
            <div className="flex flex-col gap-8">
                <ProfileHero
                    user={user}
                    pendingImage={pendingImage}
                    onImageChange={setPendingImage}
                />

                <ProfileForm user={user} pendingImage={pendingImage} onImageSaved={() => setPendingImage(null)} />
            </div>
        );
    };

    return (
        <section className="sm:py-20 w-full three-xl-section-setup">
            <div className="mt-7 grid grid-cols-1 items-start gap-6 lg:grid-cols-[290px_minmax(0,1fr)]">
                <ProfileSidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                />

                <div>{renderActiveSection()}</div>
            </div>
        </section>
    );
};
export default ProfilePage;
