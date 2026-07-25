"use client";

import { useSelector } from "react-redux";
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage"
import PrimaryButton from "@/components/shared/PrimaryButton"
import { selectIsLoggedIn } from "@/redux/slice/authSlice"
import { useGetMyProviderProfileQuery } from "@/redux/apis/jobApi"
import {
    RiArrowRightLine,
    RiSparkling2Line,
    RiHourglassLine,
    RiCheckboxCircleLine,
    RiErrorWarningLine,
    RiUserStarLine,
} from "react-icons/ri"
import Link from "next/link";

const JobPageProviderRegCTA = () => {
    const isLoggedIn = useSelector(selectIsLoggedIn);
    const { data: providerData,
        // isError: noProfile
    } = useGetMyProviderProfileQuery(undefined, {
        skip: !isLoggedIn,
    });

    const profile = providerData?.data;
    const status = profile?.status;

    /* ── Already PENDING ─────────────────────────────────── */
    if (isLoggedIn && profile && status === "PENDING") {
        return (
            <section className="three-xl-section-setup">
                <FadeUpWrapper
                    delay={0.5}
                    className="relative overflow-hidden rounded-3xl p-8 text-white text-center"
                    style={{ background: "linear-gradient(145deg, #2d1a00 0%, #5c3a00 60%, #3d2500 100%)" }}
                >
                    <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                    <div className="absolute -top-12 right-12 h-32 w-32 rounded-full blur-2xl opacity-20" style={{ background: "rgba(245,158,11,1)" }} />
                    <div className="relative z-10">
                        <RiHourglassLine className="text-3xl text-amber-300 mx-auto mb-3" />
                        <h3 className="text-xl font-bold mb-2">Your provider profile is under review</h3>
                        <p className="text-amber-100/80 mb-2 max-w-xl mx-auto text-sm">
                            An admin is reviewing your submission. You&apos;ll be able to receive contacts once approved.
                        </p>
                        <span className="inline-block mt-2 text-xs bg-amber-500/20 text-amber-200 border border-amber-400/30 rounded-full px-4 py-1.5 font-medium">
                            Status: Pending Review
                        </span>
                    </div>
                </FadeUpWrapper>
            </section>
        );
    }

    /* ── Already APPROVED ────────────────────────────────── */
    if (isLoggedIn && profile && status === "APPROVED") {
        return (
            <section className="three-xl-section-setup">
                <FadeUpWrapper
                    delay={0.5}
                    className="relative overflow-hidden rounded-3xl p-8 text-white"
                    style={{ background: "linear-gradient(145deg, #041a12 0%, #0c4a34 60%, #062319 100%)" }}
                >
                    <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                    <div className="absolute -top-12 right-12 h-32 w-32 rounded-full blur-2xl opacity-20" style={{ background: "rgba(46,139,87,1)" }} />
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                                <RiCheckboxCircleLine className="text-2xl text-emerald-400" />
                                <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full px-3 py-1 font-medium">Active Provider</span>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Your provider profile is live</h3>
                            <p className="text-primary2-100/80 text-sm max-w-xl">
                                Alumni can find you in the providers directory and contact you directly. Keep your profile updated to attract more opportunities.
                            </p>
                        </div>
                        <Link
                            href={`/jobs/providers/${profile._id}`}
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold transition-colors shrink-0"
                        >
                            <RiUserStarLine /> View My Profile <RiArrowRightLine />
                        </Link>
                    </div>
                </FadeUpWrapper>
            </section>
        );
    }

    /* ── REJECTED ────────────────────────────────────────── */
    if (isLoggedIn && profile && status === "REJECTED") {
        return (
            <section className="three-xl-section-setup">
                <FadeUpWrapper
                    delay={0.5}
                    className="relative overflow-hidden rounded-3xl p-8 text-white text-center"
                    style={{ background: "linear-gradient(145deg, #1a0404 0%, #4a0c0c 60%, #1a0404 100%)" }}
                >
                    <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                    <div className="relative z-10">
                        <RiErrorWarningLine className="text-3xl text-red-400 mx-auto mb-3" />
                        <h3 className="text-xl font-bold mb-2">Provider application was rejected</h3>
                        <p className="text-red-100/70 mb-5 max-w-xl mx-auto text-sm">
                            Your previous application was not approved. Contact an admin for clarification, then you may reapply.
                        </p>
                        <PrimaryButton
                            title="Contact Admin"
                            href="/contact"
                            icon2={<RiArrowRightLine />}
                            className="py-[19px] rounded-full bg-white/10 border border-white/20 text-white font-semibold"
                        />
                    </div>
                </FadeUpWrapper>
            </section>
        );
    }

    /* ── Default: no profile → register CTA ─────────────── */
    return (
        <section className="three-xl-section-setup">
            <FadeUpWrapper
                delay={0.5}
                className="relative overflow-hidden rounded-3xl p-8 text-white text-center"
                style={{ background: "linear-gradient(145deg, #041a12 0%, #0c4a34 60%, #062319 100%)" }}
            >
                <div
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
                <div className="absolute -top-12 right-12 h-32 w-32 rounded-full blur-2xl opacity-25" style={{ background: "rgba(245,158,11,1)" }} />
                <div className="relative z-10">
                    <RiSparkling2Line className="text-3xl text-gold-300 mx-auto mb-3" />
                    <h3 className="text-xl font-bold mb-2">Are you a skilled alumni?</h3>
                    <p className="text-primary2-100/80 mb-6 max-w-xl mx-auto text-sm">
                        Register as a tutor or service provider and connect with alumni who need your expertise.
                    </p>
                    <PrimaryButton
                        title="Get Started"
                        href="/jobs/register-provider"
                        icon2={<RiArrowRightLine />}
                        className="py-[19px] rounded-full bg-white text-primary2-700 font-semibold"
                    />
                </div>
            </FadeUpWrapper>
        </section>

    );
}
export default JobPageProviderRegCTA
