import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { supabase } from '@shared/supabase-client'
import type { Session } from '@supabase/supabase-js'

interface AdminProfile {
  id: string
  email: string
  full_name: string
  role: 'superadmin' | 'admin'
  auth_uid: string
}

interface AdminAuthContextType {
  admin: AdminProfile | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}

async function fetchAdminProfile(authUid: string): Promise<AdminProfile | null> {
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, email, full_name, role, auth_uid')
    .eq('auth_uid', authUid)
    .eq('is_active', true)
    .single()
  if (error || !data) return null
  return data as AdminProfile
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<AdminProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadAdmin = async (authUid: string) => {
    const profile = await fetchAdminProfile(authUid)
    setAdmin(profile)
    return profile
  }

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession)

      if (event === 'SIGNED_OUT' || !newSession?.user) {
        setAdmin(null)
        setIsLoading(false)
        return
      }

      const adminProfile = await loadAdmin(newSession.user.id)
      if (!adminProfile) setAdmin(null)
      setIsLoading(false)
    })

    supabase.auth.getSession().then(async ({ data: { session: s } }) => {
      setSession(s)
      if (s?.user) {
        await loadAdmin(s.user.id)
      }
      setIsLoading(false)
    })

    return () => sub?.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string): Promise<{ error: string | null }> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { error: error.message }

    const adminProfile = await loadAdmin(data.user.id)
    if (!adminProfile) {
      await supabase.auth.signOut()
      return { error: 'Admin account not found or inactive.' }
    }

    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setAdmin(null)
    setSession(null)
  }

  return (
    <AdminAuthContext.Provider value={{ admin, session, isLoading, signIn, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  )
}
