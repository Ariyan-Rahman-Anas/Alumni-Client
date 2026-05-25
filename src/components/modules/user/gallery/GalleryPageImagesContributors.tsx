"use client";

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetTopContributorsQuery } from "@/redux/apis/galleryApi";
import type { TopContributor } from "@/redux/apis/galleryApi";
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";

const GalleryPageImagesContributors = () => {
    const router = useRouter();
    const { data, isLoading } = useGetTopContributorsQuery();

    const contributors = data?.data ?? [];

    const getInitials = (name: string) =>
        name
            .split(" ")
            .slice(0, 2)
            .map((n) => n[0])
            .join("")
            .toUpperCase();

    return (
        <FadeUpWrapper delay={0.1} className="three-xl-section-setup">
            <section className="py-10">
                <FadeUpWrapper delay={0.15}>
                    <div className="mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-primary2-900">
                            Top Contributors
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Alumni who have contributed the most to our photo archive.
                        </p>
                    </div>
                </FadeUpWrapper>

                {isLoading ? (
                    <div className="flex flex-wrap gap-3">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div
                                key={i}
                                className="h-12 w-12 rounded-full animate-pulse bg-gray-200"
                            />
                        ))}
                    </div>
                ) : contributors.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No contributors yet.</p>
                ) : (
                    <div className="flex flex-wrap gap-3">
                        {contributors.map(({ user, imageCount }: TopContributor) => (
                            <Tooltip key={user._id}>
                                <TooltipTrigger asChild>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            router.push(`/gallery/contributor/${user._id}`)
                                        }
                                        className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-primary2-500 rounded-full"
                                    >
                                        <Avatar className="h-12 w-12 border-2 border-surface-200 hover:border-primary2-400 transition-all duration-200 cursor-pointer hover:scale-110">
                                            <AvatarImage
                                                src={user.imageUrl}
                                                alt={user.name}
                                            />
                                            <AvatarFallback className="bg-primary2-100 text-primary2-800 font-semibold text-sm">
                                                {getInitials(user.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                    </button>
                                </TooltipTrigger>
                                <TooltipContent side="bottom">
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {imageCount} photo{imageCount !== 1 ? "s" : ""}
                                    </p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </div>
                )}
            </section>
        </FadeUpWrapper>
    );
};

export default GalleryPageImagesContributors;
