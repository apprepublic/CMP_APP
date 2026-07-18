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
import { formatDate, formatDateTime } from '@/lib/utils'
import { toast } from 'sonner'
import { Loader2, Search, Shield, Eye, Ban, CheckCircle } from 'lucide-react'

export default function Users() {
  const { admin } = useAdminAuth()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [kycFilter, setKycFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [promoteId, setPromoteId] = useState<string | null>(null)
  const [promoting, setPromoting] = useState(false)

  useEffect(() => { loadUsers() }, [])

  async function loadUsers() {
    setLoading(true)
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    const name = (u.full_name || '').toLowerCase()
    const email = (u.email || '').toLowerCase()
    const matchesSearch = !search || name.includes(q) || email.includes(q)
    const matchesKyc = kycFilter === 'all' || u.kyc_status === kycFilter
    return matchesSearch && matchesKyc
  })

  const handleToggleActive = async (user: any) => {
    const { error } = await supabase.from('users').update({ is_active: !user.is_active }).eq('id', user.id)
    if (error) toast.error('Failed: ' + error.message)
    else { toast.success(`User ${user.is_active ? 'deactivated' : 'activated'}`); loadUsers() }
  }

  const handlePromote = async () => {
    if (!promoteId) return
    setPromoting(true)
    const user = users.find(u => u.id === promoteId)
    const { error } = await supabase.from('admin_users').insert({
      auth_uid: promoteId,
      email: user?.email || '',
      full_name: user?.full_name || '',
      role: 'admin',
      is_active: true,
    }).maybeSingle()
    if (error) toast.error('Failed: ' + error.message)
    else { toast.success('User promoted to admin'); setPromoteId(null) }
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
            <Select value={kycFilter} onValueChange={setKycFilter}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All KYC</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="VERIFIED">Verified</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>KYC</TableHead><TableHead>Status</TableHead><TableHead>Phone</TableHead><TableHead>Joined</TableHead><TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No users found</TableCell></TableRow>
              ) : filtered.map(u => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.full_name || '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{u.email}</TableCell>
                  <TableCell>
                    <Badge variant={u.kyc_status === 'VERIFIED' ? 'default' : u.kyc_status === 'PENDING' ? 'secondary' : 'outline'}>
                      {u.kyc_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={u.is_active ? 'default' : 'destructive'}>{u.is_active ? 'Active' : 'Inactive'}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{u.phone_number || '—'}</TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(u.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedUser(u)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {admin?.role === 'superadmin' && (
                        <Button variant="ghost" size="sm" onClick={() => handleToggleActive(u)}>
                          {u.is_active ? <Ban className="h-4 w-4 text-destructive" /> : <CheckCircle className="h-4 w-4 text-primary" />}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedUser} onOpenChange={(o) => { if (!o) setSelectedUser(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>User Details</DialogTitle></DialogHeader>
          {selectedUser && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{selectedUser.full_name || '—'}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span>{selectedUser.email}</span></div>
                <div><span className="text-muted-foreground">Phone:</span> <span>{selectedUser.phone_number || '—'}</span></div>
                <div><span className="text-muted-foreground">KYC Status:</span> <Badge variant={selectedUser.kyc_status === 'VERIFIED' ? 'default' : 'outline'}>{selectedUser.kyc_status}</Badge></div>
                <div><span className="text-muted-foreground">Active:</span> <Badge variant={selectedUser.is_active ? 'default' : 'destructive'}>{selectedUser.is_active ? 'Yes' : 'No'}</Badge></div>
                <div><span className="text-muted-foreground">Joined:</span> <span>{formatDateTime(selectedUser.created_at)}</span></div>
              </div>
              {selectedUser.kyc_metadata && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-1">KYC Metadata</p>
                  <pre className="text-xs bg-muted p-2 rounded">{JSON.stringify(selectedUser.kyc_metadata, null, 2)}</pre>
                </div>
              )}
              <DialogFooter className="flex gap-2 pt-2">
                {admin?.role === 'superadmin' && (
                  <Dialog open={promoteId === selectedUser.id} onOpenChange={(o) => { if (!o) setPromoteId(null) }}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setPromoteId(selectedUser.id)}>
                        <Shield className="h-4 w-4 mr-2" /> Promote to Admin
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Promote to Admin</DialogTitle>
                        <DialogDescription>Grant admin privileges to {selectedUser.full_name} ({selectedUser.email})?</DialogDescription>
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
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
