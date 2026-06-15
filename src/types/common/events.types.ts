import { TEventCategory, TEventStatus, TLocationType } from "@/constants";

export interface PriceTier {
    _id?: string;
    label: string;
    fee: number;
    batchFrom?: number;
    batchTo?: number;
}

export interface IEvent {
    _id: string;
    title: string;
    slug: string;
    description: string;
    coverImage?: string;
    coverImagePublicId?: string;
    category: TEventCategory;
    status: TEventStatus;
    startDateTime: string;
    endDateTime?: string;
    locationType: TLocationType;
    venue: string;
    meetingLink?: string;
    organizer?: string;
    contactInfo?: string;
    isRegistrationRequired: boolean;
    registrationOpensAt?: string;
    registrationDeadline?: string;
    maxAttendees?: number;
    isFree: boolean;
    priceTiers: PriceTier[];
    allowGuests: boolean;
    maxGuestsPerAlumni: number;
    guestFee: number;
    collectsTShirtSize: boolean;
    eventFlow: string[];
    isPublished: boolean;
    isFeatured: boolean;
    createdAt: string;
    updatedAt: string;
}

export type TPaymentMethod = "CASH" | "BKASH" | "NAGAD" | "ROCKET" | "BANK_TRANSFER";
export type TPaymentStatus = "PENDING" | "PAID" | "WAIVED";
export type TRegistrationStatus = "CONFIRMED" | "CANCELLED" | "WAITLISTED";
export type TTshirtSize = "S" | "M" | "L" | "XL" | "XXL";

export interface IEventRegistrationUser {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    batch?: number;
    section?: string;
    imageUrl?: string;
}

export interface IEventRegistrationEvent {
    _id: string;
    title: string;
    startDateTime: string;
    venue?: string;
    status: TEventStatus;
    category: TEventCategory;
}

export interface IEventRegistration {
    _id: string;
    eventId: string | IEventRegistrationEvent;
    userId: string | IEventRegistrationUser;
    priceTierLabel?: string;
    registrationFee: number;
    guestCount: number;
    guestFee: number;
    totalAmount: number;
    tshirtSize?: TTshirtSize;
    paymentStatus: TPaymentStatus;
    paymentMethod?: TPaymentMethod;
    bankName?: string;
    transactionId?: string;
    status: TRegistrationStatus;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface RegisterForEventPayload {
    guestCount?: number;
    tshirtSize?: TTshirtSize;
    notes?: string;
    paymentMethod?: TPaymentMethod;
    bankName?: string;
    transactionId?: string;
}

export interface EventListResponse {
    success: boolean;
    message: string;
    meta: { page: number; limit: number; total: number; totalPage: number };
    data: IEvent[];
}

export interface EventResponse {
    success: boolean;
    message: string;
    data: IEvent;
}

export interface ToggleResponse {
    success: boolean;
    message: string;
    data: IEvent;
}

export interface EventRegistrationResponse {
    success: boolean;
    message: string;
    data: IEventRegistration;
}

export interface MyRegistrationsResponse {
    success: boolean;
    message: string;
    data: IEventRegistration[];
}

export interface EventRegistrationsListResponse {
    success: boolean;
    message: string;
    data: IEventRegistration[];
}

/* ── Cancellation Requests ──────────────────────────── */

export type TCancelRequestStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ICancelRequestAdmin {
    _id: string;
    name: string;
}

export interface IEventCancelRequest {
    _id: string;
    registrationId: string | IEventRegistration;
    userId: string | IEventRegistrationUser;
    eventId: string | IEventRegistrationEvent;
    reason: string;
    status: TCancelRequestStatus;
    adminNote?: string;
    actionBy?: ICancelRequestAdmin;
    actionAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface SubmitCancelRequestPayload {
    reason: string;
}

export interface ProcessCancelRequestPayload {
    action: "APPROVED" | "REJECTED";
    adminNote?: string;
}

export interface CancelRequestResponse {
    success: boolean;
    message: string;
    data: IEventCancelRequest;
}

export interface CancelRequestListResponse {
    success: boolean;
    message: string;
    data: IEventCancelRequest[];
}