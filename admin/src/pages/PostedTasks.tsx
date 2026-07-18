import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDateTime, formatCurrency } from '@/lib/utils'
import { toast } from 'sonner'
import { Loader2, Eye, CheckCircle, XCircle } from 'lucide-react'

export default function PostedTasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected] = useState<any | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('user_posted_tasks').select('*, users:creator_id(email, full_name)').order('created_at', { ascending: false })
    setTasks(data || [])
    setLoading(false)
  }

  const handleAction = async (id: string, status: string) => {
    setProcessing(true)
    const { error } = await supabase.from('user_posted_tasks').update({ status, is_active: status === 'ACTIVE' }).eq('id', id)
    if (error) toast.error('Failed: ' + error.message)
    else { toast.success(`Task ${status.toLowerCase()}`); setSelected(null); load() }
    setProcessing(false)
  }

  const filtered = statusFilter === 'all' ? tasks : tasks.filter(t => t.status === statusFilter)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Posted Tasks</h2>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead><TableHead>Creator</TableHead><TableHead>Type</TableHead><TableHead>Budget</TableHead><TableHead>Participants</TableHead><TableHead>Status</TableHead><TableHead>Created</TableHead><TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={8} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={8} className="text-center py-12 text-muted-foreground">No posted tasks found</TableCell></TableRow>
              ) : filtered.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium max-w-40 truncate">{t.title}</TableCell>
                  <TableCell className="text-muted-foreground">{t.users?.full_name || t.users?.email || '—'}</TableCell>
                  <TableCell><Badge variant="outline">{t.type}</Badge></TableCell>
                  <TableCell className="font-mono text-sm">{t.total_budget?.toLocaleString()}</TableCell>
                  <TableCell>{t.current_participants}/{t.participant_threshold}</TableCell>
                  <TableCell>
                    <Badge variant={t.status === 'ACTIVE' ? 'default' : t.status === 'PENDING' ? 'secondary' : t.status === 'COMPLETED' ? 'outline' : 'destructive'}>{t.status}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{formatDateTime(t.created_at)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setSelected(t)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) setSelected(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{selected?.title}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Creator:</span> <span className="font-medium">{selected.users?.full_name || selected.users?.email}</span></div>
                <div><span className="text-muted-foreground">Type:</span> <Badge variant="outline">{selected.type}</Badge></div>
                <div><span className="text-muted-foreground">Budget:</span> <span>{selected.total_budget?.toLocaleString()} coins</span></div>
                <div><span className="text-muted-foreground">Per Participant:</span> <span>{selected.coin_per_participant?.toLocaleString()} coins</span></div>
                <div><span className="text-muted-foreground">Participants:</span> <span>{selected.current_participants} / {selected.participant_threshold}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge>{selected.status}</Badge></div>
              </div>
              <p className="text-sm text-muted-foreground">{selected.description}</p>
              {selected.status === 'PENDING' && (
                <div className="flex gap-2 pt-2 border-t">
                  <Button onClick={() => handleAction(selected.id, 'ACTIVE')} disabled={processing} className="flex-1">
                    {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />} Approve
                  </Button>
                  <Button onClick={() => handleAction(selected.id, 'REJECTED')} disabled={processing} variant="destructive" className="flex-1">
                    <XCircle className="h-4 w-4 mr-2" /> Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
