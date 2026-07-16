import { Navigate } from 'react-router-dom'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { admin, isLoading } = useAdminAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  if (!admin) return <Navigate to="/login" replace />
  return <>{children}</>
}
