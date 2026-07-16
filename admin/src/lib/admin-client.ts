import { supabase } from '@shared/supabase-client'

const EDGE_FUNCTION_URL = import.meta.env.VITE_SUPABASE_URL + '/functions/v1'

export async function adminFetch<T = unknown>(
  functionName: string,
  payload?: Record<string, unknown>
): Promise<{ data: T | null; error: string | null }> {
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    const token = sessionData?.session?.access_token
    if (!token) return { data: null, error: 'Not authenticated' }

    const res = await fetch(`${EDGE_FUNCTION_URL}/${functionName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: payload ? JSON.stringify(payload) : undefined,
    })

    if (!res.ok) {
      const errBody = await res.text()
      return { data: null, error: errBody || `HTTP ${res.status}` }
    }

    const data = await res.json()
    return { data: data as T, error: null }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Network error'
    return { data: null, error: msg }
  }
}

export type AdminStats = {
  totalUsers: number
  totalTutors: number
  activeBookings: number
  revenueMtd: number
  pendingKyc: number
  pendingCredentials: number
  pendingUpgrades: number
  pendingWithdrawals: number
  unreadMessages: number
  usersByType: { type: string; count: number }[]
  revenueByMonth: { month: string; amount: number }[]
}

export async function getAdminStats(): Promise<AdminStats> {
  const { data } = await adminFetch<AdminStats>('admin-stats')
  return data || ({} as AdminStats)
}
