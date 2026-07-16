import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { toast } from 'sonner'
import { Loader2, Eye, CheckCircle } from 'lucide-react'

export default function Withdrawals() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('wallet_transactions').select('*, profiles(first_name, last_name, email)').eq('type', 'withdrawal').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  const handleComplete = async (id: string) => {
    setProcessing(true)
    const { error } = await supabase.from('wallet_transactions').update({ status: 'completed' }).eq('id', id)
    if (error) toast.error('Failed: ' + error.message)
    else { toast.success('Withdrawal marked completed'); setSelected(null); load() }
    setProcessing(false)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Withdrawals</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead><TableHead>Amount</TableHead><TableHead>Currency</TableHead><TableHead>Description</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No withdrawals</TableCell></TableRow>
              ) : items.map((w: any) => (
                <TableRow key={w.id}>
                  <TableCell className="font-medium">{w.profiles?.first_name} {w.profiles?.last_name}</TableCell>
                  <TableCell>{formatCurrency(w.amount, w.currency)}</TableCell>
                  <TableCell>{w.currency}</TableCell>
                  <TableCell className="text-muted-foreground text-xs max-w-40 truncate">{w.description}</TableCell>
                  <TableCell><Badge variant={w.status === 'completed' ? 'success' : w.status === 'pending' ? 'warning' : 'destructive'}>{w.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{formatDateTime(w.created_at)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setSelected(w)}>
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
        <DialogContent>
          <DialogHeader><DialogTitle>Withdrawal Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">User:</span> <span className="font-medium">{selected.profiles?.first_name} {selected.profiles?.last_name}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span>{selected.profiles?.email}</span></div>
                <div><span className="text-muted-foreground">Amount:</span> <span>{formatCurrency(selected.amount, selected.currency)}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge variant={selected.status === 'completed' ? 'success' : 'warning'}>{selected.status}</Badge></div>
                <div className="col-span-2"><span className="text-muted-foreground">Description:</span> <span>{selected.description}</span></div>
              </div>
              {selected.status === 'pending' && (
                <div className="pt-2 border-t">
                  <Button onClick={() => handleComplete(selected.id)} disabled={processing} className="w-full">
                    {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />} Mark as Completed
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
