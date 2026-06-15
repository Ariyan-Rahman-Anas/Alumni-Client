import { FadeUpWrapper } from '@/components/pages/user/Home/HomePage';
import { Badge } from '@/components/ui/badge';
import { constantsData } from '@/constants';
import { IEvent } from '@/types/common/events.types';
import Image from 'next/image';
import { RiArrowRightLine, RiCalendarEventLine, RiMapPinLine } from 'react-icons/ri';
import { formatEventDate, formatEventTime } from './EventsSection';
import Link from 'next/link';

const EventCard = ({ event, index }: { event: IEvent; index: number }) => {
    return (
        <FadeUpWrapper delay={index * 0.08} className="group shadow hover:shadow-lg transition-all duration-500 rounded-2xl overflow-hidden h-full">
            <Link href={`/events/${event.slug}`} >
                <div className="h-60 w-full overflow-hidden ">
                    <Image src={event.coverImage ?? '/default-image.jpg'} alt={event.title} width={1920} height={1080} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="p-4">
                    <div className="flex items-center justify-between gap-2">
                        <Badge>{event.category}</Badge>
                        <p className={`${event.status === constantsData.event.eventStatus.CANCELLED || event.status === constantsData.event.eventStatus.COMPLETED ? "badge-danger" : "badge-success"}`}>{event.status}</p>
                    </div>

                    <h3
                        className="mt-3 font-semibold text-primary2-800 dark:text-gunmetal-200 text-base leading-snug mb-2 line-clamp-2">
                        {event.title}
                    </h3>

                    <div className="flex flex-col gap-1 text-xs text-gunmetal-300 ">
                        <span className="flex items-center gap-1.5">
                            <RiCalendarEventLine />
                            {formatEventDate(event.startDateTime)} · {formatEventTime(event.startDateTime)}
                        </span>
                        {event.venue && (
                            <span className="flex items-center gap-1.5">
                                <RiMapPinLine />
                                {event.venue}
                            </span>
                        )}
                    </div>

                    <p className="text-xs mt-2 leading-relaxed line-clamp-2 text-gunmetal-300 ">
                        {event.description}
                    </p>
                </div>

                <div className="flex items-center justify-between p-4 pt-3 border-t">
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {event.isFree
                            ? "Free Entry"
                            : event.priceTiers?.length
                                ? `From ৳${Math.min(...event.priceTiers.map((t) => t.fee))}`
                                : "Paid"}
                    </span>
                    <span
                        className="inline-flex items-center gap-1 font-semibold transition-all duration-200 text-gunmetal-300 group-hover:gap-1.5">
                        Details <RiArrowRightLine />
                    </span>
                </div>
            </Link>
        </FadeUpWrapper>
    )
}
export default EventCard