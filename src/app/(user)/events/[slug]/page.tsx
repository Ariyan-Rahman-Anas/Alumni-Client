import EventDetailsPage from '@/components/pages/user/Events/EventDetailsPage'
import { getWebsiteData, toShortName } from '@/lib/getWebsiteData';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const wm = await getWebsiteData();
  const shortName = wm?.schoolName ? toShortName(wm.schoolName) : "BAMHS";
  return {
    title: "Event's details",
    description: `Discover upcoming ${shortName} alumni events, timelines, and participation tracks.`,
  };
}

const EventDetails = () => {
  return <EventDetailsPage />
}
export default EventDetails