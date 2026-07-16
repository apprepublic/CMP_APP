import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatCurrency, formatDate } from '@/lib/utils'
import { adminFetch } from '@/lib/admin-client'
import { toast } from 'sonner'
import { Loader2, Eye, CheckCircle, XCircle } from 'lucide-react'

export default function TutorUpgrades() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const [notes, setNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('tutor_upgrade_requests').select('*, profiles(first_name, last_name, email)').order('submitted_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  const handleAction = async (action: 'approve' | 'reject') => {
    if (!selected) return
    setProcessing(true)
    const { error } = await adminFetch('process-tutor-upgrade', {
      request_id: selected.id,
      action,
      reviewer_notes: action === 'reject' ? notes : '',
    })
    if (error) toast.error('Failed: ' + error)
    else {
      toast.success(`Upgrade ${action}d`)
      setSelected(null)
      setNotes('')
      load()
    }
    setProcessing(false)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Tutor Upgrades</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead><TableHead>Subjects</TableHead><TableHead>Rate</TableHead><TableHead>Experience</TableHead><TableHead>Status</TableHead><TableHead>Submitted</TableHead><TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No upgrade requests</TableCell></TableRow>
              ) : items.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.profiles?.first_name} {r.profiles?.last_name}</TableCell>
                  <TableCell className="max-w-32 truncate">{(r.subjects || []).join(', ')}</TableCell>
                  <TableCell>{r.hourly_rate ? formatCurrency(r.hourly_rate, r.currency) : '—'}</TableCell>
                  <TableCell>{r.experience_years ? `${r.experience_years}y` : '—'}</TableCell>
                  <TableCell><Badge variant={r.status === 'approved' ? 'success' : r.status === 'rejected' ? 'destructive' : 'warning'}>{r.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(r.submitted_at)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => { setSelected(r); setNotes(r.reviewer_notes || '') }}>
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
          <DialogHeader><DialogTitle>Upgrade Request</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Student:</span> <span className="font-medium">{selected.profiles?.first_name} {selected.profiles?.last_name}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span>{selected.profiles?.email}</span></div>
                <div><span className="text-muted-foreground">Bio:</span> <span className="col-span-2">{selected.bio || '—'}</span></div>
                <div><span className="text-muted-foreground">Education:</span> <span>{selected.education || '—'}</span></div>
                <div><span className="text-muted-foreground">Experience:</span> <span>{selected.experience_years ? `${selected.experience_years} years` : '—'}</span></div>
                <div><span className="text-muted-foreground">Rate:</span> <span>{selected.hourly_rate ? formatCurrency(selected.hourly_rate, selected.currency) : '—'}</span></div>
                <div><span className="text-muted-foreground">Subjects:</span> <span>{(selected.subjects || []).join(', ') || '—'}</span></div>
                <div><span className="text-muted-foreground">Teaching Style:</span> <span>{selected.teaching_style || '—'}</span></div>
                <div><span className="text-muted-foreground">Country:</span> <span>{selected.country || '—'}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant={selected.status === 'approved' ? 'success' : selected.status === 'rejected' ? 'destructive' : 'warning'}>{selected.status}</Badge></div>
              </div>
              {selected.status === 'pending' && (
                <div className="space-y-3 pt-2 border-t">
                  <Textarea placeholder="Reviewer notes" value={notes} onChange={e => setNotes(e.target.value)} />
                  <div className="flex gap-2">
                    <Button onClick={() => handleAction('approve')} disabled={processing} className="flex-1">
                      {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />} Approve
                    </Button>
                    <Button variant="destructive" onClick={() => handleAction('reject')} disabled={processing} className="flex-1">
                      {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />} Reject
                    </Button>
                  </div>
                </div>
              )}
              {selected.reviewer_notes && (
                <div className="p-3 bg-muted rounded-md text-sm"><span className="font-medium">Notes:</span> {selected.reviewer_notes}</div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
