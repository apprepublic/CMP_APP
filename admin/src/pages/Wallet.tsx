import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { formatDateTime } from '@/lib/utils'
import { Loader2, Search, Wallet as WalletIcon, ArrowUpDown } from 'lucide-react'

export default function Wallet() {
  const [wallets, setWallets] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const [wRes, tRes] = await Promise.all([
      supabase.from('wallets').select('*, users:user_id(email, full_name)').order('coin_balance', { ascending: false }),
      supabase.from('coin_transactions').select('*, users:user_id(email, full_name)').order('created_at', { ascending: false }).limit(200),
    ])
    setWallets(wRes.data || [])
    setTransactions(tRes.data || [])
    setLoading(false)
  }

  const filteredWallets = wallets.filter(w => {
    const q = search.toLowerCase()
    return !search || w.users?.full_name?.toLowerCase().includes(q) || w.users?.email?.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Wallet Management</h2>

      <Tabs defaultValue="wallets">
        <TabsList>
          <TabsTrigger value="wallets"><WalletIcon className="h-4 w-4 mr-2" /> Wallets</TabsTrigger>
          <TabsTrigger value="transactions"><ArrowUpDown className="h-4 w-4 mr-2" /> Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="wallets">
          <Card>
            <CardHeader className="pb-3">
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search by name or email..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead><TableHead>Email</TableHead><TableHead>Coin Balance</TableHead><TableHead>Lifetime Earned</TableHead><TableHead>Lifetime Spent</TableHead><TableHead>Ref Code</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                  ) : filteredWallets.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No wallets found</TableCell></TableRow>
                  ) : filteredWallets.map(w => (
                    <TableRow key={w.id}>
                      <TableCell className="font-medium">{w.users?.full_name || '—'}</TableCell>
                      <TableCell className="text-muted-foreground">{w.users?.email || '—'}</TableCell>
                      <TableCell className="font-mono font-medium">{BigInt(w.coin_balance || 0).toLocaleString()}</TableCell>
                      <TableCell className="font-mono">{w.lifetime_earned?.toLocaleString() || 0}</TableCell>
                      <TableCell className="font-mono">{w.lifetime_spent?.toLocaleString() || 0}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{w.referral_code || '—'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead><TableHead>Type</TableHead><TableHead>Amount</TableHead><TableHead>Balance After</TableHead><TableHead>Description</TableHead><TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                  ) : transactions.length === 0 ? (
                    <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No transactions</TableCell></TableRow>
                  ) : transactions.map(t => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium text-xs">{t.users?.full_name || t.users?.email || '—'}</TableCell>
                      <TableCell><Badge variant={t.type === 'EARN' || t.type === 'REFERRAL' || t.type === 'STREAM' ? 'default' : t.type === 'TOPUP' ? 'secondary' : 'outline'}>{t.type}</Badge></TableCell>
                      <TableCell className="font-mono">{t.amount?.toLocaleString()}</TableCell>
                      <TableCell className="font-mono text-muted-foreground">{t.balance_after?.toLocaleString()}</TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-40 truncate">{t.description || '—'}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{formatDateTime(t.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
