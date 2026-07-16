import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getAdminStats, type AdminStats } from '@/lib/admin-client'
import { formatCurrency } from '@/lib/utils'
import { supabase } from '@shared/supabase-client'
import { Users, GraduationCap, BookOpen, Wallet, ShieldCheck, Award, UserPlus, MessageSquare, Loader2, ArrowUpDown } from 'lucide-react'

const defaultStats: AdminStats = {
  totalUsers: 0, totalTutors: 0, activeBookings: 0, revenueMtd: 0,
  pendingKyc: 0, pendingCredentials: 0, pendingUpgrades: 0, pendingWithdrawals: 0,
  unreadMessages: 0, usersByType: [], revenueByMonth: [],
}

export default function Dashboard() {
  const [stats, setStats] = useState<AdminStats>(defaultStats)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const s = await getAdminStats()
      setStats(s || defaultStats)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const cards = [
    { title: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Tutors', value: stats.totalTutors.toLocaleString(), icon: GraduationCap, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Active Bookings', value: stats.activeBookings.toLocaleString(), icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-100' },
    { title: 'Revenue (MTD)', value: formatCurrency(stats.revenueMtd), icon: Wallet, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    { title: 'Pending KYC', value: stats.pendingKyc.toLocaleString(), icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-100' },
    { title: 'Pending Credentials', value: stats.pendingCredentials.toLocaleString(), icon: Award, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'Pending Upgrades', value: stats.pendingUpgrades.toLocaleString(), icon: UserPlus, color: 'text-cyan-600', bg: 'bg-cyan-100' },
    { title: 'Unread Messages', value: stats.unreadMessages.toLocaleString(), icon: MessageSquare, color: 'text-rose-600', bg: 'bg-rose-100' },
    { title: 'Pending Withdrawals', value: stats.pendingWithdrawals.toLocaleString(), icon: ArrowUpDown, color: 'text-indigo-600', bg: 'bg-indigo-100' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Dashboard</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Card key={card.title}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${card.bg}`}>
                    <Icon className={`h-5 w-5 ${card.color}`} />
                  </div>
                </div>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.title}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Users by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.usersByType.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No data</p>
            ) : (
              <div className="space-y-3">
                {stats.usersByType.map((u) => (
                  <div key={u.type} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{u.type}</span>
                    <Badge variant="secondary">{u.count.toLocaleString()}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Revenue by Month</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.revenueByMonth.length === 0 ? (
              <p className="text-sm text-muted-foreground py-8 text-center">No data</p>
            ) : (
              <div className="space-y-3">
                {stats.revenueByMonth.map((r) => (
                  <div key={r.month} className="flex items-center justify-between">
                    <span className="text-sm">{r.month}</span>
                    <span className="text-sm font-medium">{formatCurrency(r.amount)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
