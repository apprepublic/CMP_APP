import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { toast } from 'sonner'
import { Loader2, Eye, CheckCircle, XCircle } from 'lucide-react'

export default function Withdrawals() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)
  const [processing, setProcessing] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase
      .from('withdrawal_requests')
      .select('*, users:user_id(full_name, email)')
      .order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  const handleApprove = async (id: string) => {
    setProcessing(true)
    const { error } = await supabase.rpc('approve_withdrawal', { p_request_id: id })
    if (error) toast.error('Approve failed: ' + error.message)
    else { toast.success('Withdrawal approved'); setSelected(null); load() }
    setProcessing(false)
  }

  const handleReject = async (id: string) => {
    setProcessing(true)
    const { error } = await supabase.rpc('reject_withdrawal', { p_request_id: id })
    if (error) toast.error('Reject failed: ' + error.message)
    else { toast.success('Withdrawal rejected, coins credited back'); setSelected(null); load() }
    setProcessing(false)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Withdrawal Requests</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead><TableHead>Amount (NGN)</TableHead><TableHead>Coin Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No withdrawal requests</TableCell></TableRow>
              ) : items.map((w: any) => (
                <TableRow key={w.id}>
                  <TableCell className="font-medium">{w.users?.full_name || w.users?.email}</TableCell>
                  <TableCell>{formatCurrency(Number(w.amount))}</TableCell>
                  <TableCell className="font-mono">{w.coin_amount?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={w.status === 'PROCESSED' ? 'default' : w.status === 'APPROVED' ? 'secondary' : w.status === 'REJECTED' ? 'destructive' : 'outline'}>
                      {w.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">{formatDateTime(w.created_at)}</TableCell>
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
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Withdrawal Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">User:</span> <span className="font-medium">{selected.users?.full_name}</span></div>
                <div><span className="text-muted-foreground">Email:</span> <span>{selected.users?.email}</span></div>
                <div><span className="text-muted-foreground">Amount:</span> <span>{formatCurrency(Number(selected.amount))}</span></div>
                <div><span className="text-muted-foreground">Coins:</span> <span>{selected.coin_amount?.toLocaleString()}</span></div>
                <div><span className="text-muted-foreground">Status:</span> <Badge>{selected.status}</Badge></div>
                <div><span className="text-muted-foreground">Submitted:</span> <span>{formatDateTime(selected.created_at)}</span></div>
              </div>
              {selected.account_details && (
                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-1">Account Details</p>
                  <pre className="text-xs bg-muted p-2 rounded whitespace-pre-wrap">{JSON.stringify(selected.account_details, null, 2)}</pre>
                </div>
              )}
              {selected.status === 'PENDING' && (
                <div className="flex gap-2 pt-2 border-t">
                  <Button onClick={() => handleApprove(selected.id)} disabled={processing} className="flex-1">
                    {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />} Approve
                  </Button>
                  <Button onClick={() => handleReject(selected.id)} disabled={processing} variant="destructive" className="flex-1">
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
