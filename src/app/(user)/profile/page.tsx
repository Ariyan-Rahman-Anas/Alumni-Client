import ProfilePage from "@/components/pages/user/Profile/ProfilePage";
import ClientAuthGuard from "@/components/shared/ClientAuthGuard";

export const metadata = {
    title: "My Profile | BAMHS Alumni",
    description: "View and edit your BAMHS Alumni profile.",
};

// ClientAuthGuard: requireAuth — only logged-in users.
// WHEN CUSTOM DOMAIN: middleware handles this too. Keep guard for defence-in-depth.
const Profile = () => {
    return (
        <ClientAuthGuard requireAuth>
            <ProfilePage />
        </ClientAuthGuard>
    );
};
export default Profile;