"use client";

import { useState } from "react";
import {
    RiUploadCloud2Line,
    RiShieldCheckLine,
    RiImageLine,
    RiArrowRightLine,
} from "react-icons/ri";
import { Button } from "@/components/ui/button";
import GalleryPageHead from "@/components/modules/user/gallery/GalleryPageHead";
import GalleryPageMasonryGrid from "@/components/modules/user/gallery/GalleryPageMasonryGrid";
import GalleryPageImagesContributors from "@/components/modules/user/gallery/GalleryPageImagesContributors";
import { FadeUpWrapper } from "../Home/HomePage";
import UserContributeGallerySheet from "@/components/modules/user/gallery/UserContributeGallerySheet";

/* ”€”€ Main Page  */
const GalleryPage = () => {
    const [contributeOpen, setContributeOpen] = useState(false);
    return (
        <>
            <div className="">

                {/* ••• 1. CINEMATIC HERO ••••••••••••••••••••••••••••••• */}
                <GalleryPageHead />

                {/* ••• 2. FILTER + MASONRY GRID •••••••••••••••••••••••• */}
                <GalleryPageMasonryGrid />


                <GalleryPageImagesContributors />

                {/* ••• CONTRIBUTE  */}
                <FadeUpWrapper className="three-xl-section-setup">
                    <div
                        className="relative overflow-hidden rounded-3xl"
                        style={{ background: "linear-gradient(135deg, var(--color-primary-950) 0%, var(--color-primary-800) 60%, var(--color-primary-800) 100%)" }}
                    >
                        {/* Background grid texture */}
                        <div
                            className="absolute inset-0 pointer-events-none opacity-20"
                            style={{
                                backgroundImage:
                                    "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
                                backgroundSize: "48px 48px",
                            }}
                        />
                        {/* Glow orbs */}
                        <div className="absolute -top-16 -right-16 h-56 w-56 rounded-full blur-3xl opacity-20" style={{ background: "rgba(46,139,87,1)" }} />
                        <div className="absolute -bottom-12 -left-12 h-44 w-44 rounded-full blur-3xl opacity-15" style={{ background: "rgba(245,158,11,1)" }} />

                        <div className="relative z-10 px-6 py-10 sm:px-10 sm:py-12">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-12">

                                {/* ”€”€ Left content ”€”€ */}
                                <div className="flex-1">
                                    <div className="inline-flex items-center gap-2 rounded-full border border-primary2-500/40 bg-primary2-900/50 px-3 py-1 text-xs font-medium text-primary2-300 mb-5">
                                        <RiUploadCloud2Line className="text-sm" />
                                        Open Submissions
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-bold text-white leading-snug max-w-lg">
                                        Your memories deserve{" "}
                                        <span className="text-primary2-300">a permanent place</span>{" "}
                                        in the archive
                                    </h2>
                                    <p className="mt-3 text-sm text-gunmetal-300 leading-relaxed max-w-md">
                                        Submit your best BAMHS moments ” sports days, graduations,
                                        classroom memories ” and let them live on for future alumni.
                                    </p>

                                    {/* Feature bullets */}
                                    <ul className="mt-6 space-y-2.5">
                                        {[
                                            { icon: <RiShieldCheckLine />, text: "Every photo reviewed before going public" },
                                            { icon: <RiImageLine />, text: "Upload up to 10 photos per submission" },
                                        ].map(({ icon, text }) => (
                                            <li key={text} className="flex items-center gap-2.5 text-sm text-gunmetal-200">
                                                <span className="flex-shrink-0 text-primary2-400 text-base">{icon}</span>
                                                {text}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* ”€”€ Right CTA card ”€”€ */}
                                <div className="lg:w-64 xl:w-72">
                                    <div
                                        className="rounded-2xl border p-6 flex flex-col items-center text-center gap-5"
                                        style={{ background: "rgba(255,255,255,0.06)", borderColor: "rgba(255,255,255,0.12)" }}
                                    >
                                        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "rgba(46,139,87,0.25)", border: "1px solid rgba(46,139,87,0.35)" }}>
                                            <RiUploadCloud2Line className="text-2xl text-primary2-300" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-white text-sm">Ready to contribute?</p>
                                            <p className="mt-1 text-xs text-gunmetal-300">Join the growing list of alumni keeping BAMHS memories alive.</p>
                                        </div>
                                        <Button
                                            className="w-full bg-primary2-500 hover:bg-primary2-400 text-white font-medium gap-2"
                                            onClick={() => setContributeOpen(true)}
                                        >
                                            Submit Photos
                                            <RiArrowRightLine className="text-base" />
                                        </Button>
                                        <p className="text-xs text-gunmetal-400">Free · No account required to browse</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </FadeUpWrapper>
            </div>

            <UserContributeGallerySheet open={contributeOpen} onClose={() => setContributeOpen(false)} />
        </>
    );
};
export default GalleryPage;