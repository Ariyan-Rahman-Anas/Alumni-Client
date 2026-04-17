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
    category: string;
    status: string;
    startDateTime: string;
    endDateTime?: string;
    locationType: string;
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