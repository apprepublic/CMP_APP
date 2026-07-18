import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import AdminLayout from '@/components/AdminLayout'
import Login from '@/pages/Login'
import Dashboard from '@/pages/Dashboard'
import Users from '@/pages/Users'
import Articles from '@/pages/Articles'
import Tasks from '@/pages/Tasks'
import PostedTasks from '@/pages/PostedTasks'
import Music from '@/pages/Music'
import Wallet from '@/pages/Wallet'
import Withdrawals from '@/pages/Withdrawals'
import Contests from '@/pages/Contests'
import Marketplace from '@/pages/Marketplace'
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
            <Route path="/articles" element={<ProtectedRoute><AdminPage><Articles /></AdminPage></ProtectedRoute>} />
            <Route path="/tasks" element={<ProtectedRoute><AdminPage><Tasks /></AdminPage></ProtectedRoute>} />
            <Route path="/posted-tasks" element={<ProtectedRoute><AdminPage><PostedTasks /></AdminPage></ProtectedRoute>} />
            <Route path="/music" element={<ProtectedRoute><AdminPage><Music /></AdminPage></ProtectedRoute>} />
            <Route path="/wallet" element={<ProtectedRoute><AdminPage><Wallet /></AdminPage></ProtectedRoute>} />
            <Route path="/withdrawals" element={<ProtectedRoute><AdminPage><Withdrawals /></AdminPage></ProtectedRoute>} />
            <Route path="/contests" element={<ProtectedRoute><AdminPage><Contests /></AdminPage></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute><AdminPage><Marketplace /></AdminPage></ProtectedRoute>} />
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
