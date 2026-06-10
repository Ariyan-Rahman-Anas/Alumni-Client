"use client";

import { useSelector } from "react-redux";
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import PrimaryButton from "@/components/shared/PrimaryButton"
import SectionLabel from "@/components/shared/SectionLabel"
import { useGetWebsiteManagementQuery } from "@/redux/apis/websiteManagementApi"
import { useGetMyProviderProfileQuery } from "@/redux/apis/jobApi"
import { selectIsLoggedIn } from "@/redux/slice/authSlice"
import {
    RiAddLine,
    RiBriefcaseLine,
    RiCheckboxCircleLine,
    RiHourglassLine,
    RiStarLine,
    RiErrorWarningLine,
} from "react-icons/ri"

const JobPageHead = () => {
    const { data: websiteManagement } = useGetWebsiteManagementQuery();
    const { schoolName } = websiteManagement?.data || {};
    const schoolShortName = schoolName?.split(" ")?.map((word: string) => word[0]).join("") || "BAMHS";

    const isLoggedIn = useSelector(selectIsLoggedIn);
    const { data: providerData, isError: noProfile } = useGetMyProviderProfileQuery(undefined, {
        skip: !isLoggedIn,
    });

    const providerProfile = providerData?.data;
    const providerStatus = providerProfile?.status;

    const providerBtn = (() => {
        if (!isLoggedIn || noProfile || !providerProfile) {
            return { title: "Register as Provider", icon: <RiStarLine />, href: "/jobs/register-provider", isDisabled: false, className: "bg-transparent text-white py-[19px] rounded-full border border-surface-100/60 font-semibold" };
        }
        if (providerStatus === "PENDING") {
            return { title: "Profile Under Review", icon: <RiHourglassLine />, href: undefined, isDisabled: true, className: "bg-amber-500/20 text-amber-200 py-[19px] rounded-full border border-amber-400/30 font-semibold opacity-80 cursor-not-allowed" };
        }
        if (providerStatus === "APPROVED") {
            return { title: "My Provider Profile", icon: <RiCheckboxCircleLine />, href: `/jobs/providers/${providerProfile._id}`, isDisabled: false, className: "bg-primary2-400/20 text-primary2-200 py-[19px] rounded-full border border-primary2-300/40 font-semibold" };
        }
        if (providerStatus === "REJECTED") {
            return { title: "Reapply as Provider", icon: <RiErrorWarningLine />, href: "/jobs/register-provider", isDisabled: false, className: "bg-red-500/20 text-red-200 py-[19px] rounded-full border border-red-400/30 font-semibold" };
        }
        return { title: "Register as Provider", icon: <RiStarLine />, href: "/jobs/register-provider", isDisabled: false, className: "bg-transparent text-white py-[19px] rounded-full border border-surface-100/60 font-semibold" };
    })();

    return (
        <FadeUpWrapper delay={0.1}>
            <section
                className="relative overflow-hidden rounded-3xl"
                style={{ background: "linear-gradient(145deg, var(--color-primary-950) 0%, var(--color-primary-800) 55%, var(--color-primary-950) 100%)" }}
            >
                <div
                    className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
                <div
                    className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl opacity-25"
                    style={{ background: "rgba(46,139,87,1)" }}
                />
                <div
                    className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full blur-3xl opacity-20"
                    style={{ background: "rgba(245,158,11,1)" }}
                />

                <div className="relative z-10 px-7 py-12 sm:px-12 sm:py-16 space-y-8">
                    <FadeUpWrapper
                        delay={0.15}
                    >
                        <SectionLabel text="Alumni Network · Job Board" align="left" icon={<RiBriefcaseLine />} className="text-primary2-200 capitalize mb-2" />
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight max-w-3xl">
                            Opportunities{" "}
                            <span className="text-primary2-300">& Services Hub</span>
                        </h1>

                        <p className="text-base sm:text-lg leading-relaxed max-w-4xl text-gunmetal-300 mb-12 mt-5">
                            Discover career openings, find tutors, hire skilled workers ” or post your own. All within the {schoolShortName} alumni community.
                        </p>
                    </FadeUpWrapper>


                    {/* Actions */}
                    <FadeUpWrapper delay={0.25}>
                        <div className="flex flex-wrap gap-3 tracking-wide">
                            <PrimaryButton
                                title="Post a Job"
                                icon={<RiAddLine />}
                                href="/jobs/post"
                                className="bg-white text-primary2-700 py-[19px] rounded-full font-semibold"
                            />
                            <PrimaryButton
                                title={providerBtn.title}
                                icon={providerBtn.icon}
                                href={providerBtn.href}
                                isDisabled={providerBtn.isDisabled}
                                className={providerBtn.className}
                            />
                        </div>
                    </FadeUpWrapper>
                </div>
            </section>
        </FadeUpWrapper>
    )
}
export default JobPageHead