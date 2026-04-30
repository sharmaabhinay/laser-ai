import { useState } from 'react'
import { AuthProvider } from './context/AuthContext'
import { GalleryProvider } from './context/GalleryContext'
import Navbar from './components/layout/Navbar'
import StudioPage from './pages/StudioPage'
import GalleryPage from './pages/GalleryPage'
import AuthPage from './pages/AuthPage'
import PricingPage from './pages/PricingPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  const [page, setPage] = useState('studio')

  const renderPage = () => {
    switch (page) {
      case 'studio':   return <StudioPage />
      case 'gallery':  return <GalleryPage />
      case 'login':    return <AuthPage mode="login" setPage={setPage} />
      case 'signup':   return <AuthPage mode="signup" setPage={setPage} />
      case 'pricing':  return <PricingPage />
      case 'profile':  return <ProfilePage setPage={setPage} />
      default:         return <StudioPage />
    }
  }

  const noNav = page === 'login' || page === 'signup'

  return (
    <AuthProvider>
      <GalleryProvider>
        {!noNav && <Navbar page={page} setPage={setPage} />}
        {renderPage()}
      </GalleryProvider>
    </AuthProvider>
  )
}
