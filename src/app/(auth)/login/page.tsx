import LoginPage from '@/components/Pages/Auth/LoginPage'
import ClientAuthGuard from '@/components/shared/ClientAuthGuard'

// ClientAuthGuard: requireGuest — redirect logged-in users away from login.
// WHEN CUSTOM DOMAIN: middleware handles this too. Keep guard for defence-in-depth.
const Login = () => {
    return (
        <ClientAuthGuard requireGuest>
            <LoginPage />
        </ClientAuthGuard>
    )
}
export default Login