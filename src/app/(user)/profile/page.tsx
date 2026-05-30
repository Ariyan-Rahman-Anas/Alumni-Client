import ProfilePage from "@/components/pages/user/Profile/ProfilePage";
import { getWebsiteData, toShortName } from "@/lib/getWebsiteData";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const wm = await getWebsiteData();
    const shortName = wm?.schoolName ? toShortName(wm.schoolName) : "BAMHS";
    return {
        title: "My Profile",
        description: `View and manage your ${shortName} Alumni profile, contributions, and activity.`,
    };
}

const Profile = () => <ProfilePage />;
export default Profile;