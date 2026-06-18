"use client"

import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import SectionLabel from "@/components/shared/SectionLabel"
import { useGetWebsiteManagementQuery } from "@/redux/apis/websiteManagementApi"
import { RiLock2Line } from "react-icons/ri"

const LeftSection = () => {
    const { data: websiteManagement } = useGetWebsiteManagementQuery();
    const { schoolName } = websiteManagement?.data || {};

    const schoolShortName = schoolName?.split(" ")?.map((word: string) => word[0]).join("") || "BAMHS";
    const alumniName = `${schoolShortName}ian`;

    return (
        <FadeUpWrapper delay={0.1} className="p-6 sm:p-8 w-full">
            <SectionLabel text="Alumni Portal" icon={<RiLock2Line />} align="left" className="text-primary2-200 dark:text-gunmetal-300 border-primary2-600 dark:border-gunmetal-500 capitalize" />

            <h1 className="mb-5 mt-3 text-4xl font-semibold leading-tight text-white dark:text-gunmetal-100 sm:text-5xl">
                Welcome Back!
                <br />
                <span className="text-gold-300 dark:text-gold-500">{alumniName}</span>
            </h1>

            <p className="max-w-md text-base leading-relaxed text-gunmetal-200 dark:text-gunmetal-300">
                Sign in to your alumni account to connect with your batch, stay updated on association events, and engage with the {schoolShortName} alumni community.
            </p>

            <div className="mt-8 space-y-3">
                {[
                    "Access your batch directory and classmate profiles",
                    "Stay informed about reunion events and association notices",
                    "Participate in alumni welfare and mentorship programmes",
                ].map((point) => (
                    <div key={point} className="flex items-center gap-3">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-gunmetal-200 dark:bg-gunmetal-300 " />
                        <p className="text-sm text-gunmetal-200 dark:text-gunmetal-300 ">{point}</p>
                    </div>
                ))}
            </div>
        </FadeUpWrapper>
    )
}
export default LeftSection
