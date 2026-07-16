import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDateTime } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export default function Payments() {
  const [payments, setPayments] = useState<any[]>([])
  const [walletTx, setWalletTx] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'payments' | 'wallet'>('payments')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const [pRes, wRes] = await Promise.all([
      supabase.from('payments').select('*').order('created_at', { ascending: false }).limit(100),
      supabase.from('wallet_transactions').select('*, profiles(first_name, last_name)').order('created_at', { ascending: false }).limit(100),
    ])
    setPayments(pRes.data || [])
    setWalletTx(wRes.data || [])
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Payments</h2>
        <Select value={view} onValueChange={(v: any) => setView(v)}>
          <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="payments">Payments</SelectItem>
            <SelectItem value="wallet">Wallet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {view === 'payments' ? (
        <Card>
          <CardHeader><CardTitle className="text-lg">Payment Transactions</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead><TableHead>Amount</TableHead><TableHead>Fee</TableHead><TableHead>Tutor Gets</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                ) : payments.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No payments</TableCell></TableRow>
                ) : payments.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs">{p.paystack_reference || p.id.slice(0, 8)}</TableCell>
                    <TableCell>{formatCurrency(p.amount, p.currency)}</TableCell>
                    <TableCell>{p.platform_fee ? formatCurrency(p.platform_fee, p.currency) : '—'}</TableCell>
                    <TableCell>{p.tutor_amount ? formatCurrency(p.tutor_amount, p.currency) : '—'}</TableCell>
                    <TableCell><Badge variant={p.status === 'completed' ? 'success' : p.status === 'pending' ? 'warning' : 'destructive'}>{p.status}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{formatDateTime(p.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader><CardTitle className="text-lg">Wallet Transactions</CardTitle></CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead><TableHead>Type</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Description</TableHead><TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                ) : walletTx.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No transactions</TableCell></TableRow>
                ) : walletTx.map((t: any) => (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">{t.profiles?.first_name} {t.profiles?.last_name}</TableCell>
                    <TableCell><Badge variant={t.type === 'deposit' || t.type === 'earning' ? 'success' : t.type === 'withdrawal' ? 'warning' : 'secondary'}>{t.type}</Badge></TableCell>
                    <TableCell>{formatCurrency(t.amount, t.currency)}</TableCell>
                    <TableCell><Badge variant={t.status === 'completed' ? 'success' : t.status === 'pending' ? 'warning' : 'destructive'}>{t.status}</Badge></TableCell>
                    <TableCell className="text-muted-foreground text-xs max-w-60 truncate">{t.description}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDateTime(t.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
