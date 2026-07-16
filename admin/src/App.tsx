import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import AdminLayout from '@/components/AdminLayout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Users from '@/pages/Users'
import Tutors from '@/pages/Tutors'
import Bookings from '@/pages/Bookings'
import Sessions from '@/pages/Sessions'
import Payments from '@/pages/Payments'
import Kyc from '@/pages/Kyc'
import Credentials from '@/pages/Credentials'
import TutorUpgrades from '@/pages/TutorUpgrades'
import Withdrawals from '@/pages/Withdrawals'
import Contact from '@/pages/Contact'
import Config from '@/pages/Config'

const queryClient = new QueryClient()

function AdminPage({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AdminAuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><AdminPage><Dashboard /></AdminPage></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><AdminPage><Users /></AdminPage></ProtectedRoute>} />
            <Route path="/tutors" element={<ProtectedRoute><AdminPage><Tutors /></AdminPage></ProtectedRoute>} />
            <Route path="/bookings" element={<ProtectedRoute><AdminPage><Bookings /></AdminPage></ProtectedRoute>} />
            <Route path="/sessions" element={<ProtectedRoute><AdminPage><Sessions /></AdminPage></ProtectedRoute>} />
            <Route path="/payments" element={<ProtectedRoute><AdminPage><Payments /></AdminPage></ProtectedRoute>} />
            <Route path="/kyc" element={<ProtectedRoute><AdminPage><Kyc /></AdminPage></ProtectedRoute>} />
            <Route path="/credentials" element={<ProtectedRoute><AdminPage><Credentials /></AdminPage></ProtectedRoute>} />
            <Route path="/tutor-upgrades" element={<ProtectedRoute><AdminPage><TutorUpgrades /></AdminPage></ProtectedRoute>} />
            <Route path="/withdrawals" element={<ProtectedRoute><AdminPage><Withdrawals /></AdminPage></ProtectedRoute>} />
            <Route path="/contact" element={<ProtectedRoute><AdminPage><Contact /></AdminPage></ProtectedRoute>} />
            <Route path="/config" element={<ProtectedRoute><AdminPage><Config /></AdminPage></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Toaster richColors position="top-right" />
        </AdminAuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
