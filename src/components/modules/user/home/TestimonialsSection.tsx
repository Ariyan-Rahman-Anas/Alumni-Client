"use client";

import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Image from "next/image";
import { motion } from "framer-motion";
import { FadeUpWrapper } from "@/components/pages/user/Home/HomePage";
import {
    Carousel, CarouselContent, CarouselItem,
    CarouselNext, CarouselPrevious, type CarouselApi,
} from "@/components/ui/carousel";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RiDoubleQuotesL, RiEditLine } from "react-icons/ri";
import { BsStarFill } from "react-icons/bs";
import SectionLabel from "@/components/shared/SectionLabel";

import {
    useGetApprovedTestimonialsQuery,
    useSubmitTestimonialMutation,
    useGetMyTestimonialQuery,
} from "@/redux/apis/testimonialApi";
import { selectCurrentUser, selectIsLoggedIn } from "@/redux/slice/authSlice";
import type { IDisplayTestimonial, ITestimonial, ITestimonialUser, TTestimonialAddInputs } from "@/types/common/testimonial.types";
import { TESTIMONIAL_FIELD_ORDER, testimonialAddSchema } from "./testimonialSchema";
import { useFormWithToast } from "@/hooks/useFormWithToast";



function toDisplay(t: ITestimonial): IDisplayTestimonial {
    const user = typeof t.userId === "object" ? (t.userId as ITestimonialUser) : null;
    const roleLabel = user
        ? [user.position, user.workplace].filter(Boolean).join(" @ ") || user.country || ""
        : "";
    return {
        _id: t._id,
        quote: t.quote,
        rating: t.rating,
        name: user?.name ?? "Anonymous",
        batchLabel: user?.batch ? `Batch of ${user.batch}` : "",
        roleLabel,
        imageUrl: user?.imageUrl,
    };
}

/* ── static fallback (shown until real data loads) ───────────── */
const FALLBACK: IDisplayTestimonial[] = [
    {
        _id: "fb-1",
        quote: "BAMHS shaped who I am. The values I learned in those classrooms still guide every decision I make as a doctor today.",
        name: "Dr. Rafiqul Islam",
        batchLabel: "Batch of 1998",
        roleLabel: "Senior Physician, Dhaka Medical College",
        rating: 5,
    },
    {
        _id: "fb-2",
        quote: "No matter where life took me, BAMHS always felt like home. The friendships forged here are for a lifetime.",
        name: "Nasrin Akter",
        batchLabel: "Batch of 2005",
        roleLabel: "Software Engineer, Dubai",
        rating: 5,
    },
    {
        _id: "fb-3",
        quote: "My teachers at BAMHS did not just teach subjects — they taught us how to stand tall with dignity and purpose.",
        name: "Md. Karim Hossain",
        batchLabel: "Batch of 1992",
        roleLabel: "Entrepreneur, Chittagong",
        rating: 5,
    },
    {
        _id: "fb-4",
        quote: "The school annual sports day and cultural programs made us who we are. I owe everything to BAMHS.",
        name: "Sadia Rahman",
        batchLabel: "Batch of 2010",
        roleLabel: "Teacher, Cumilla Govt. College",
        rating: 5,
    },
];

/* ── STATUS_MSG map  */
const STATUS_MSG = {
    PENDING: "Your review is pending admin approval. We'll show it once approved.",
    APPROVED: "Your review is already published on this page.",
    REJECTED: "Your review was not approved. You may submit a new one.",
} as const;

/* ═══════════════════════════════════════════════════════════════ */
const TestimonialsSection = () => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);

    const isLoggedIn = useSelector(selectIsLoggedIn);
    const currentUser = useSelector(selectCurrentUser);

    const { data: approvedData } = useGetApprovedTestimonialsQuery();
    const { data: myData, isLoading: myLoading } = useGetMyTestimonialQuery(undefined, {
        skip: !isLoggedIn || !dialogOpen,
    });

    const [submitReview, { isLoading: isSubmitting }] = useSubmitTestimonialMutation();

    const testimonials: IDisplayTestimonial[] =
        approvedData?.data && approvedData.data.length > 0
            ? approvedData.data.map(toDisplay)
            : FALLBACK;

    const myReview = myData?.data ?? null;
    const canSubmit = !myReview || myReview.status === "REJECTED";

    const methods = useFormWithToast<TTestimonialAddInputs>(
        {
            resolver: zodResolver(testimonialAddSchema),
            defaultValues: {
                quote: "",
                rating: 5,
            },
        },
        { fieldOrder: TESTIMONIAL_FIELD_ORDER }
    );

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = methods;

    const ratingValue = watch("rating");

    /* Track selected slide */
    useEffect(() => {
        if (!api) return;
        const onSelect = () => setCurrent(api.selectedScrollSnap());
        api.on("select", onSelect);
        return () => { api.off("select", onSelect); };
    }, [api]);

    /* Autoplay */
    useEffect(() => {
        if (!api) return;
        if (isPaused) { if (intervalRef.current) clearInterval(intervalRef.current); return; }
        intervalRef.current = setInterval(() => api.scrollNext(), 5000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [api, isPaused]);

    const onSubmit = async (values: TTestimonialAddInputs) => {
        try {
            await submitReview(values).unwrap();
            toast.success("Thank you! Your review has been submitted for approval.");
            reset({ quote: "", rating: 5 });
            setDialogOpen(false);
        } catch (err: unknown) {
            toast.error((err as { data?: { message?: string } })?.data?.message ?? "Something went wrong");
        }
    };

    const handleShareClick = () => {
        if (!isLoggedIn) {
            toast.info("Please log in to share your experience.");
            return;
        }
        setDialogOpen(true);
    };

    return (
        <>
            <section
                className="relative overflow-hidden"
                style={{ background: "linear-gradient(160deg, var(--color-primary-950) 0%, var(--color-primary-900) 45%, var(--color-primary-800) 100%)" }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Decorative grid */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        backgroundImage:
                            "linear-gradient(color-mix(in srgb, var(--color-primary-500) 6%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--color-primary-500) 6%, transparent) 1px, transparent 1px)",
                        backgroundSize: "60px 60px",
                    }}
                />
                {/* Ambient orbs */}
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--color-primary-500) 18%, transparent) 0%, transparent 70%)", filter: "blur(40px)" }} />
                <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--color-primary-400) 15%, transparent) 0%, transparent 70%)", filter: "blur(36px)" }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
                    style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--color-primary-500) 6%, transparent) 0%, transparent 65%)", filter: "blur(60px)" }} />

                {/* Background quote icon */}
                <RiDoubleQuotesL
                    className="absolute top-6 right-6 sm:top-10 sm:right-10 pointer-events-none select-none"
                    style={{ fontSize: "clamp(6rem, 12vw, 11rem)", color: "color-mix(in srgb, var(--color-primary-500) 7%, transparent)", lineHeight: 1 }}
                />

                {/* Main content */}
                <div className="three-xl-section-setup relative z-10">

                    {/* Header */}
                    <FadeUpWrapper className="text-center mb-14">
                        <SectionLabel
                            text="Alumni Voices"
                            className="text-primary2-100 border-primary2-700 dark:text-gunmetal-300 dark:border-gunmetal-500"
                            icon={<RiDoubleQuotesL />}
                        />
                        <h2 className="section-heading-text-center text-white dark:text-gunmetal-200 mt-5">
                            What BAMHSians Say
                        </h2>
                        <p className="mt-4 text-sm sm:text-base max-w-xl mx-auto leading-relaxed text-primary2-400 dark:text-gunmetal-300">
                            Voices from across decades — sharing the legacy that BAMHS instilled in every student.
                        </p>
                    </FadeUpWrapper>

                    {/* Carousel */}
                    <FadeUpWrapper delay={0.15}>
                        <Carousel setApi={setApi} opts={{ loop: true, align: "center" }} className="w-full">
                            <CarouselContent className="-ml-4 sm:-ml-6">
                                {testimonials.map((t, i) => (
                                    <CarouselItem key={t._id} className="pl-4 sm:pl-6 basis-full sm:basis-[85%] md:basis-[75%] lg:basis-[60%]">
                                        <motion.div
                                            animate={{ scale: i === current ? 1 : 0.95, opacity: i === current ? 1 : 0.55 }}
                                            transition={{ duration: 0.4, ease: "easeOut" }}
                                            className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 h-full flex flex-col gap-6 cursor-grab active:cursor-grabbing"
                                            style={{
                                                background: "linear-gradient(145deg, color-mix(in srgb, var(--color-primary-500) 10%, transparent) 0%, color-mix(in srgb, var(--color-primary-500) 4%, transparent) 100%)",
                                                border: "1px solid color-mix(in srgb, var(--color-primary-500) 22%, transparent)",
                                                boxShadow: i === current
                                                    ? "0 8px 32px rgba(0,0,0,0.35), 0 0 48px color-mix(in srgb, var(--color-primary-500) 12%, transparent), inset 0 1px 0 rgba(255,255,255,0.06)"
                                                    : "0 4px 16px rgba(0,0,0,0.2)",
                                                backdropFilter: "blur(12px)",
                                            }}
                                        >
                                            {/* Quote icon + stars */}
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                                                    style={{ background: "color-mix(in srgb, var(--color-primary-500) 20%, transparent)", border: "1px solid color-mix(in srgb, var(--color-primary-500) 30%, transparent)" }}>
                                                    <RiDoubleQuotesL className="text-lg sm:text-xl text-primary2-500" />
                                                </div>
                                                <div className="flex items-center gap-0.5 mt-1">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <BsStarFill key={s} className="text-xs"
                                                            style={{ color: s <= t.rating ? "var(--color-gold-500)" : "color-mix(in srgb, var(--color-primary-500) 20%, transparent)" }} />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Quote */}
                                            <p className="font-serif italic text-base sm:text-lg md:text-xl leading-relaxed text-center flex-1 text-primary2-100 dark:text-gunmetal-300">
                                                &ldquo;{t.quote}&rdquo;
                                            </p>

                                            {/* Divider */}
                                            <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-primary-500) 35%, transparent), transparent)" }} />

                                            {/* Author */}
                                            <div className="flex items-center gap-4">
                                                {t.imageUrl ? (
                                                    <Image src={t.imageUrl} alt={t.name} width={44} height={44}
                                                        className="w-11 h-11 sm:w-13 sm:h-13 rounded-full object-cover flex-shrink-0 shadow" />
                                                ) : (
                                                    <div className="w-11 min-w-[2.75rem] h-11 min-h-[2.75rem] sm:w-13 sm:h-13 rounded-full flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0 bg-primary2-500 text-white dark:text-gunmetal-900 shadow">
                                                        {t.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="min-w-0">
                                                    <p className="font-semibold text-sm sm:text-base leading-tight truncate text-primary2-100 dark:text-gunmetal-300">
                                                        {t.name}
                                                    </p>
                                                    <p className="text-xs mt-0.5 truncate text-primary2-400 dark:text-gunmetal-300">
                                                        {[t.batchLabel, t.roleLabel].filter(Boolean).join(" · ")}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>

                            <div className="flex items-center justify-center gap-5 mt-8 sm:mt-10">
                                <CarouselPrevious className="static translate-y-0 h-10 w-10 rounded-full transition-colors duration-200 text-primary2-100 bg-primary2-500 hover:bg-primary2-600 dark:bg-gunmetal-300 dark:hover:bg-primary hover:text-surface" />
                                <div className="flex items-center gap-2">
                                    {testimonials.map((t, i) => (
                                        <button key={t._id} aria-label={`Go to testimonial ${i + 1}`} onClick={() => api?.scrollTo(i)}
                                            className={`rounded-full transition-all duration-300 focus-visible:outline-none ${i === current ? "bg-primary2-400 dark:bg-gunmetal-300" : "bg-primary2-300 dark:bg-gunmetal-400"}`}
                                            style={{
                                                width: i === current ? "28px" : "8px",
                                                height: "8px",
                                                boxShadow: i === current ? "0 0 8px color-mix(in srgb, var(--color-primary-400) 60%, transparent)" : "none",
                                            }}
                                        />
                                    ))}
                                </div>
                                <CarouselNext className="static translate-y-0 h-10 w-10 rounded-full transition-colors duration-200 text-primary2-100 bg-primary2-500 hover:bg-primary2-600 dark:bg-gunmetal-300 dark:hover:bg-primary hover:text-surface" />
                            </div>
                        </Carousel>
                    </FadeUpWrapper>

                    {/* Share CTA */}
                    <FadeUpWrapper delay={0.25} className="text-center mt-12">
                        <p className="text-sm text-primary2-400 dark:text-gunmetal-400 mb-3">
                            Are you a BAMHSian? Share your experience.
                        </p>
                        <button
                            type="button"
                            onClick={handleShareClick}
                            className="inline-flex items-center gap-2 text-sm font-medium px-5 py-2.5 rounded-full transition-all duration-200 text-primary2-100 hover:text-white"
                            style={{
                                background: "color-mix(in srgb, var(--color-primary-500) 18%, transparent)",
                                border: "1px solid color-mix(in srgb, var(--color-primary-500) 35%, transparent)",
                            }}
                        >
                            <RiEditLine size={15} />
                            Share Your Story
                        </button>
                    </FadeUpWrapper>

                </div>
            </section>

            {/* Submit review dialog */}
            <Dialog open={dialogOpen} onOpenChange={(o) => !o && setDialogOpen(false)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Share Your Experience</DialogTitle>
                    </DialogHeader>

                    {myLoading ? (
                        <div className="py-8 text-center text-sm text-muted-foreground">Loading...</div>
                    ) : !canSubmit && myReview ? (
                        <div className="py-4 space-y-3">
                            <p className={`text-sm rounded-lg px-4 py-3 ${myReview.status === "APPROVED"
                                ? "bg-green-50 text-green-700"
                                : myReview.status === "PENDING"
                                    ? "bg-amber-50 text-amber-700"
                                    : "bg-red-50 text-red-600"
                                }`}>
                                {STATUS_MSG[myReview.status]}
                            </p>
                            {myReview.status !== "REJECTED" && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-sm italic text-gray-700">&ldquo;{myReview.quote}&rdquo;</p>
                                    <div className="flex gap-0.5 mt-2">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <BsStarFill key={s} size={12}
                                                className={s <= myReview.rating ? "text-amber-400" : "text-gray-200"} />
                                        ))}
                                    </div>
                                </div>
                            )}
                            <Button variant="outline" className="w-full" onClick={() => setDialogOpen(false)}>Close</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 pt-1">
                            {currentUser && (
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                    {currentUser.imageUrl ? (
                                        <Image src={currentUser.imageUrl} alt={currentUser.name} width={36} height={36} className="rounded-full object-cover" />
                                    ) : (
                                        <div className="h-9 w-9 rounded-full bg-primary2-100 text-primary2-700 flex items-center justify-center text-sm font-bold">
                                            {currentUser.name.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                                        {currentUser.batch && <p className="text-xs text-muted-foreground">Batch {currentUser.batch}</p>}
                                    </div>
                                </div>
                            )}

                            {/* Star rating */}
                            <Controller name="rating" control={control} render={({ field }) => (
                                <div className="flex flex-col gap-1.5">
                                    <span className="text-xs font-medium text-gray-700">Rating</span>
                                    <div className="flex items-center gap-1.5">
                                        {[1, 2, 3, 4, 5].map((s) => (
                                            <button key={s} type="button"
                                                onClick={() => field.onChange(s)}
                                                className="transition-transform hover:scale-110">
                                                <BsStarFill size={22}
                                                    className={s <= ratingValue ? "text-amber-400" : "text-gray-200"} />
                                            </button>
                                        ))}
                                        <span className="ml-1 text-sm text-muted-foreground">{ratingValue}/5</span>
                                    </div>
                                </div>
                            )} />

                            {/* Quote */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-700">
                                    Your experience <span className="text-red-500">*</span>
                                </label>
                                <Controller name="quote" control={control} render={({ field }) => (
                                    <Textarea rows={4} placeholder="Share what BAMHS meant to you..." className="resize-none"
                                        {...field}
                                        value={field.value ?? ""}
                                    />
                                )} />
                                {errors.quote && <p className="text-xs text-red-500">{errors.quote.message}</p>}
                            </div>

                            <p className="text-xs text-muted-foreground">
                                Your review will be visible on this page after admin approval.
                            </p>

                            <div className="flex gap-3">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1 bg-primary2-600 hover:bg-primary2-700 text-white" disabled={isSubmitting}>
                                    {isSubmitting ? "Submitting..." : "Submit Review"}
                                </Button>
                            </div>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TestimonialsSection;
