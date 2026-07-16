import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { Loader2, Eye, CheckCircle, XCircle } from 'lucide-react'

export default function Credentials() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const [notes, setNotes] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('tutor_credentials').select('*, profiles(first_name, last_name, email)').order('submitted_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  const handleAction = async (id: string, action: 'verified' | 'rejected') => {
    setProcessing(true)
    const { error } = await supabase.from('tutor_credentials').update({
      status: action,
      reviewer_notes: action === 'rejected' ? notes : null,
      reviewed_at: new Date().toISOString(),
    }).eq('id', id)
    if (error) toast.error('Failed: ' + error.message)
    else {
      toast.success(`Credential ${action}`)
      setSelected(null)
      setNotes('')
      load()
    }
    setProcessing(false)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Credentials</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tutor</TableHead><TableHead>Type</TableHead><TableHead>Name</TableHead><TableHead>Institution</TableHead><TableHead>Status</TableHead><TableHead>Submitted</TableHead><TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No credentials</TableCell></TableRow>
              ) : items.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.profiles?.first_name} {c.profiles?.last_name}</TableCell>
                  <TableCell>{c.credential_type || 'education'}</TableCell>
                  <TableCell>{c.credential_name || c.highest_qualification}</TableCell>
                  <TableCell className="text-muted-foreground">{c.institution || c.university}</TableCell>
                  <TableCell><Badge variant={c.status === 'verified' ? 'success' : c.status === 'rejected' ? 'destructive' : 'warning'}>{c.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(c.submitted_at)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => { setSelected(c); setNotes(c.reviewer_notes || '') }}>
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
          <DialogHeader><DialogTitle>Credential Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-muted-foreground">Tutor:</span> <span className="font-medium">{selected.profiles?.first_name} {selected.profiles?.last_name}</span></div>
                <div><span className="text-muted-foreground">Type:</span> <span>{selected.credential_type || 'Education'}</span></div>
                <div><span className="text-muted-foreground">Name:</span> <span>{selected.credential_name || selected.highest_qualification}</span></div>
                <div><span className="text-muted-foreground">Institution:</span> <span>{selected.institution || selected.university}</span></div>
                {selected.graduation_year && <div><span className="text-muted-foreground">Year:</span> <span>{selected.graduation_year}</span></div>}
                <div><span className="text-muted-foreground">Status:</span> <Badge variant={selected.status === 'verified' ? 'success' : selected.status === 'rejected' ? 'destructive' : 'warning'}>{selected.status}</Badge></div>
              </div>
              {selected.file_url && (
                <div><a href={selected.file_url} target="_blank" rel="noopener noreferrer" className="text-primary text-sm hover:underline">View uploaded file →</a></div>
              )}
              {selected.status === 'pending' && (
                <div className="space-y-3 pt-2 border-t">
                  <Textarea placeholder="Reviewer notes (required if rejecting)" value={notes} onChange={e => setNotes(e.target.value)} />
                  <div className="flex gap-2">
                    <Button onClick={() => handleAction(selected.id, 'verified')} disabled={processing} className="flex-1">
                      {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />} Verify
                    </Button>
                    <Button variant="destructive" onClick={() => notes ? handleAction(selected.id, 'rejected') : toast.error('Please add reviewer notes')} disabled={processing || !notes} className="flex-1">
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
