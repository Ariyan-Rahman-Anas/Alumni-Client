"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { BsStarFill } from "react-icons/bs";
import {
    RiDoubleQuotesL,
    RiCheckboxCircleLine,
    RiTimeLine,
    RiCloseCircleLine,
    RiEditLine,
    RiSendPlaneLine,
} from "react-icons/ri";

import {
    useGetMyTestimonialQuery,
    useSubmitTestimonialMutation,
} from "@/redux/apis/testimonialApi";
import type { TTestimonialAddInputs } from "@/types/common/testimonial.types";
import { testimonialAddSchema } from "@/components/modules/user/home/testimonialSchema";
import type { IServerErrorRes } from "@/types/common.components.types";
import DateFormatter from "@/lib/DateFormatter";

const STATUS_CONFIG = {
    PENDING: {
        icon: <RiTimeLine className="text-amber-500 text-xl" />,
        label: "Pending Review",
        bg: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/40",
        text: "text-amber-700 dark:text-amber-400",
        desc: "Your testimonial has been submitted and is awaiting admin approval.",
    },
    APPROVED: {
        icon: <RiCheckboxCircleLine className="text-green-600 text-xl" />,
        label: "Published",
        bg: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700/40",
        text: "text-green-700 dark:text-green-400",
        desc: "Your testimonial is live on the home page!",
    },
    REJECTED: {
        icon: <RiCloseCircleLine className="text-red-500 text-xl" />,
        label: "Rejected",
        bg: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/40",
        text: "text-red-600 dark:text-red-400",
        desc: "Your testimonial was not approved. You may submit a new one.",
    },
} as const;

const StarRating = ({
    value,
    onChange,
    error,
}: {
    value: number;
    onChange: (v: number) => void;
    error?: string;
}) => {
    const [hovered, setHovered] = useState(0);

    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        type="button"
                        onMouseEnter={() => setHovered(star)}
                        onMouseLeave={() => setHovered(0)}
                        onClick={() => onChange(star)}
                        className="text-2xl transition-transform hover:scale-110 focus-visible:outline-none"
                    >
                        <BsStarFill
                            className={
                                star <= (hovered || value)
                                    ? "text-amber-400"
                                    : "text-surface-200 dark:text-surface-700"
                            }
                        />
                    </button>
                ))}
                {value > 0 && (
                    <span className="ml-2 text-xs text-muted-foreground">
                        {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][value]}
                    </span>
                )}
            </div>
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
};

const MyTestimonialPanel = () => {
    const [showForm, setShowForm] = useState(false);

    const { data, isLoading } = useGetMyTestimonialQuery();
    const [submit, { isLoading: isSubmitting }] = useSubmitTestimonialMutation();

    const testimonial = data?.data;

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<TTestimonialAddInputs>({
        resolver: zodResolver(testimonialAddSchema),
        defaultValues: { quote: "", rating: 0 },
    });

    const ratingValue = watch("rating");
    const quoteValue = watch("quote");

    // If rejected, auto-open form so user can resubmit
    useEffect(() => {
        if (testimonial?.status === "REJECTED") setShowForm(true);
    }, [testimonial?.status]);

    const onSubmit = async (values: TTestimonialAddInputs) => {
        try {
            await submit(values).unwrap();
            toast.success("Testimonial submitted! It will be reviewed by admin.");
            reset();
            setShowForm(false);
        } catch (err) {
            toast.error((err as IServerErrorRes).data?.message ?? "Failed to submit testimonial");
        }
    };

    if (isLoading) {
        return (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                <div className="h-8 w-48 rounded-lg bg-surface-200 dark:bg-surface-700 animate-pulse" />
                <div className="h-32 rounded-2xl bg-surface-200 dark:bg-surface-700 animate-pulse" />
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                    <h2 className="text-lg font-semibold text-surface-900 dark:text-white flex items-center gap-2">
                        <RiDoubleQuotesL className="text-primary2-600" />
                        My Testimonial
                    </h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                        Share your BAMHS experience to inspire others.
                    </p>
                </div>
                {/* Show write button only when no pending/approved testimonial exists */}
                {(!testimonial || testimonial.status === "REJECTED") && !showForm && (
                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl bg-primary2-600 text-white hover:bg-primary2-700 transition-colors font-medium"
                    >
                        <RiEditLine />
                        Write Testimonial
                    </button>
                )}
            </div>

            {/* Existing testimonial status card */}
            {testimonial && (
                <div className={`rounded-2xl border p-5 ${STATUS_CONFIG[testimonial.status].bg}`}>
                    <div className="flex items-start gap-3 mb-3">
                        {STATUS_CONFIG[testimonial.status].icon}
                        <div>
                            <p className={`text-sm font-semibold ${STATUS_CONFIG[testimonial.status].text}`}>
                                {STATUS_CONFIG[testimonial.status].label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {STATUS_CONFIG[testimonial.status].desc}
                            </p>
                        </div>
                    </div>

                    {/* Quote preview */}
                    <div className="rounded-xl bg-white/60 dark:bg-black/10 p-4 mb-3">
                        <div className="flex items-center gap-0.5 mb-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <BsStarFill
                                    key={s}
                                    size={12}
                                    className={s <= testimonial.rating ? "text-amber-400" : "text-surface-200 dark:text-surface-700"}
                                />
                            ))}
                        </div>
                        <p className="text-sm italic text-surface-700 dark:text-surface-300 leading-relaxed">
                            &ldquo;{testimonial.quote}&rdquo;
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                            Submitted <DateFormatter date={testimonial.createdAt} />
                        </p>
                    </div>

                    {/* Rejection reason */}
                    {testimonial.status === "REJECTED" && testimonial.rejectionReason && (
                        <p className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2 mt-2">
                            <span className="font-medium">Reason:</span> {testimonial.rejectionReason}
                        </p>
                    )}
                </div>
            )}

            {/* No testimonial yet */}
            {!testimonial && !showForm && (
                <div className="rounded-2xl border border-dashed border-surface-300 dark:border-surface-700 p-10 flex flex-col items-center gap-3 text-center">
                    <div className="h-12 w-12 rounded-full bg-primary2-50 dark:bg-primary2-900/20 flex items-center justify-center">
                        <RiDoubleQuotesL className="text-2xl text-primary2-500" />
                    </div>
                    <p className="text-sm font-medium text-surface-700 dark:text-surface-300">
                        You haven&apos;t shared a testimonial yet
                    </p>
                    <p className="text-xs text-muted-foreground max-w-xs">
                        Share your story as a BAMHSian. Your testimonial will appear on the home page after admin approval.
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowForm(true)}
                        className="mt-2 flex items-center gap-1.5 text-sm px-5 py-2.5 rounded-xl bg-primary2-600 text-white hover:bg-primary2-700 transition-colors font-medium"
                    >
                        <RiEditLine />
                        Write Testimonial
                    </button>
                </div>
            )}

            {/* Submit form */}
            {showForm && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 p-5 space-y-4"
                >
                    <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100">
                        {testimonial?.status === "REJECTED" ? "Submit a New Testimonial" : "Write Your Testimonial"}
                    </h3>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Star rating */}
                        <StarRating
                            value={ratingValue}
                            onChange={(v) => setValue("rating", v, { shouldValidate: true })}
                            error={errors.rating?.message}
                        />

                        {/* Quote textarea */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">
                                Your Story <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                {...register("quote")}
                                rows={5}
                                placeholder="Share how BAMHS shaped your life..."
                                className="w-full rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-800 text-sm text-surface-800 dark:text-surface-100 placeholder:text-muted-foreground px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary2-500 transition-shadow"
                            />
                            <div className="flex items-center justify-between">
                                {errors.quote ? (
                                    <p className="text-xs text-red-500">{errors.quote.message}</p>
                                ) : (
                                    <span />
                                )}
                                <p className="text-xs text-muted-foreground">{quoteValue.length}/600</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => { setShowForm(false); reset(); }}
                                className="text-sm px-4 py-2 rounded-xl border border-surface-300 dark:border-surface-600 text-surface-600 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="flex items-center gap-1.5 text-sm px-5 py-2 rounded-xl bg-primary2-600 text-white hover:bg-primary2-700 disabled:opacity-60 transition-colors font-medium"
                            >
                                <RiSendPlaneLine />
                                {isSubmitting ? "Submitting..." : "Submit"}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}
        </motion.div>
    );
};

export default MyTestimonialPanel;
