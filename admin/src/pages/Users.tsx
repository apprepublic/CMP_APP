import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { Loader2, Search, Shield, UserCog } from 'lucide-react'

export default function Users() {
  const { admin } = useAdminAuth()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [promoteId, setPromoteId] = useState<string | null>(null)
  const [promoting, setPromoting] = useState(false)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    const { data } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, user_type, kyc_status, country, created_at')
      .order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    const name = `${u.first_name || ''} ${u.last_name || ''}`.toLowerCase()
    const email = (u.email || '').toLowerCase()
    const matchesSearch = !search || name.includes(q) || email.includes(q)
    const matchesType = typeFilter === 'all' || u.user_type === typeFilter
    return matchesSearch && matchesType
  })

  const handlePromote = async () => {
    if (!promoteId) return
    setPromoting(true)
    const { error } = await supabase
      .from('profiles')
      .update({ user_type: 'admin' })
      .eq('id', promoteId)

    if (error) {
      toast.error('Failed to promote: ' + error.message)
    } else {
      // Also insert into admin_users
      const user = users.find(u => u.id === promoteId)
      await supabase.from('admin_users').insert({
        auth_uid: promoteId,
        email: user?.email || '',
        full_name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
        role: 'admin',
        is_active: true,
      }).maybeSingle()
      toast.success('User promoted to admin')
      setPromoteId(null)
      loadUsers()
    }
    setPromoting(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Users</h2>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="tutor">Tutor</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>KYC</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No users found</TableCell>
                </TableRow>
              ) : filtered.map(u => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.first_name} {u.last_name}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={u.user_type === 'admin' ? 'default' : u.user_type === 'tutor' ? 'secondary' : 'outline'}>
                      {u.user_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.kyc_status === 'verified' ? 'success' : u.kyc_status === 'pending' ? 'warning' : 'secondary'}>
                      {u.kyc_status}
                    </Badge>
                  </TableCell>
                  <TableCell>{u.country || '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(u.created_at)}</TableCell>
                  <TableCell>
                    {admin?.role === 'superadmin' && u.user_type !== 'admin' && (
                      <Dialog open={promoteId === u.id} onOpenChange={(open) => !open && setPromoteId(null)}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={() => setPromoteId(u.id)}>
                            <Shield className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Promote to Admin</DialogTitle>
                            <DialogDescription>
                              Grant admin privileges to {u.first_name} {u.last_name} ({u.email})?
                            </DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setPromoteId(null)}>Cancel</Button>
                            <Button onClick={handlePromote} disabled={promoting}>
                              {promoting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Promoting...</> : 'Confirm'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
