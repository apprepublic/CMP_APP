import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { Loader2, Eye, CheckCircle, XCircle } from 'lucide-react'

export default function Kyc() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const [reason, setReason] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('kyc_verifications').select('*, profiles(first_name, last_name, email)').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  const handleAction = async (id: string, action: 'verified' | 'rejected') => {
    setProcessing(true)
    const { error } = await supabase.from('kyc_verifications').update({
      status: action,
      rejection_reason: action === 'rejected' ? reason : null,
      reviewed_at: new Date().toISOString(),
    }).eq('id', id)
    if (error) toast.error('Failed: ' + error.message)
    else {
      toast.success(`KYC ${action}`)
      setSelected(null)
      setReason('')
      load()
    }
    setProcessing(false)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">KYC Verifications</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead><TableHead>Email</TableHead><TableHead>ID Type</TableHead><TableHead>Status</TableHead><TableHead>Submitted</TableHead><TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No verifications</TableCell></TableRow>
              ) : items.map((k: any) => (
                <TableRow key={k.id}>
                  <TableCell className="font-medium">{k.profiles?.first_name} {k.profiles?.last_name}</TableCell>
                  <TableCell className="text-muted-foreground">{k.profiles?.email}</TableCell>
                  <TableCell>{k.id_type || '—'}</TableCell>
                  <TableCell><Badge variant={k.status === 'verified' ? 'success' : k.status === 'rejected' ? 'destructive' : 'warning'}>{k.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(k.created_at)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => { setSelected(k); setReason(k.rejection_reason || '') }}>
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
          <DialogHeader>
            <DialogTitle>KYC Verification Details</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Name:</span> <span className="font-medium">{selected.profiles?.first_name} {selected.profiles?.last_name}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span>{selected.profiles?.email}</span></div>
                <div><span className="text-muted-foreground">ID Type:</span> <span>{selected.id_type}</span></div>
                <div><span className="text-muted-foreground">ID Number:</span> <span>{selected.id_number}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant={selected.status === 'verified' ? 'success' : selected.status === 'rejected' ? 'destructive' : 'warning'}>{selected.status}</Badge></div>
                <div><span className="text-muted-foreground">Confidence:</span> <span>{selected.face_confidence ? `${(selected.face_confidence * 100).toFixed(0)}%` : '—'}</span></div>
              </div>
              {selected.status === 'pending' && (
                <div className="space-y-3 pt-2 border-t">
                  <Textarea placeholder="Rejection reason (required if rejecting)" value={reason} onChange={e => setReason(e.target.value)} />
                  <div className="flex gap-2">
                    <Button onClick={() => handleAction(selected.id, 'verified')} disabled={processing} className="flex-1">
                      {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />} Approve
                    </Button>
                    <Button variant="destructive" onClick={() => reason ? handleAction(selected.id, 'rejected') : toast.error('Please provide a reason')} disabled={processing || !reason} className="flex-1">
                      {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />} Reject
                    </Button>
                  </div>
                </div>
              )}
              {selected.rejection_reason && (
                <div className="p-3 bg-destructive/10 rounded-md text-sm">
                  <span className="font-medium text-destructive">Rejection reason:</span> {selected.rejection_reason}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
