import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Shield, User, Mail, Calendar } from 'lucide-react'

export default function Config() {
  const { admin, signOut } = useAdminAuth()

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">System Config</h2>

      <Card>
        <CardHeader><CardTitle className="text-lg">Admin Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{admin?.full_name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{admin?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Role</p>
                <Badge variant={admin?.role === 'superadmin' ? 'default' : 'secondary'}>{admin?.role}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Platform</p>
                <p className="font-medium">CMP Earning Platform</p>
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Supabase Project: <code className="text-xs bg-muted px-1 py-0.5 rounded">eztaonlpenuzpoosqonx</code>
            </div>
            <Button variant="destructive" size="sm" onClick={signOut}>Sign Out</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-lg">Coin Economy Settings</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: '100 coins', value: '₦1' },
              { label: 'Min Withdrawal', value: '100,000 coins' },
              { label: 'Min Fiat', value: '₦1,000' },
              { label: 'Signup Bonus', value: '500 coins' },
              { label: 'Withdrawal Fee', value: '1.5%' },
              { label: 'L1 Referral', value: '20%' },
              { label: 'L2 Referral', value: '10%' },
              { label: 'L3 Referral', value: '5%' },
            ].map(item => (
              <div key={item.label} className="p-3 border rounded-lg text-center">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-lg font-bold text-primary">{item.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
