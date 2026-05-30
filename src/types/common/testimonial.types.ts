import { testimonialAddSchema } from "@/components/modules/user/home/testimonialSchema";
import z from "zod";

export type TTestimonialStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ITestimonialUser {
    _id: string;
    name: string;
    batch: number;
    position?: string;
    workplace?: string;
    imageUrl?: string;
    country?: string;
}

export type TTestimonialAddInputs = z.infer<typeof testimonialAddSchema>;

export interface IDisplayTestimonial {
    _id: string;
    quote: string;
    rating: number;
    name: string;
    batchLabel: string;
    roleLabel: string;
    imageUrl?: string;
}

export interface ITestimonial {
    _id: string;
    userId: ITestimonialUser | string;
    quote: string;
    rating: number;
    status: TTestimonialStatus;
    rejectionReason?: string;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export interface TestimonialListResponse {
    success: boolean;
    message: string;
    data: ITestimonial[];
}

export interface TestimonialResponse {
    success: boolean;
    message: string;
    data: ITestimonial;
}

export interface SubmitTestimonialPayload {
    quote: string;
    rating: number;
}