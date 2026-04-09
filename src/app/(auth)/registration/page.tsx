import RegistrationPage from '@/components/Pages/Auth/RegistrationPage'
import ClientAuthGuard from '@/components/shared/ClientAuthGuard'

// ClientAuthGuard: requireGuest — redirect logged-in users away from registration.
// WHEN CUSTOM DOMAIN: middleware handles this too. Keep guard for defence-in-depth.
const Registration = () => {
  return (
    <ClientAuthGuard requireGuest>
      <RegistrationPage />
    </ClientAuthGuard>
  )
}

export default Registration