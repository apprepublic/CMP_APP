import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { Loader2, Search, XCircle } from 'lucide-react'

const statusColors: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  confirmed: 'success', pending: 'warning', pending_payment: 'warning', pending_approval: 'warning',
  completed: 'default', cancelled: 'destructive',
}

export default function Bookings() {
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('bookings').select('*, student:profiles!student_id(first_name, last_name), tutor:profiles!tutor_id(first_name, last_name)').order('created_at', { ascending: false })
    setBookings(data || [])
    setLoading(false)
  }

  const filtered = bookings.filter((b: any) => {
    const q = search.toLowerCase()
    const student = `${b.student?.first_name || ''} ${b.student?.last_name || ''}`.toLowerCase()
    const tutor = `${b.tutor?.first_name || ''} ${b.tutor?.last_name || ''}`.toLowerCase()
    return (!search || student.includes(q) || tutor.includes(q)) && (statusFilter === 'all' || b.status === statusFilter)
  })

  const cancelBooking = async (id: string) => {
    const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id)
    if (error) toast.error('Failed: ' + error.message)
    else { toast.success('Booking cancelled'); load() }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Bookings</h2>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="pending_payment">Pending Payment</SelectItem>
                <SelectItem value="pending_approval">Pending Approval</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead><TableHead>Tutor</TableHead><TableHead>Subject</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No bookings</TableCell></TableRow>
              ) : filtered.map((b: any) => (
                <TableRow key={b.id}>
                  <TableCell className="font-medium">{b.student?.first_name} {b.student?.last_name}</TableCell>
                  <TableCell>{b.tutor?.first_name} {b.tutor?.last_name}</TableCell>
                  <TableCell>{b.subject}</TableCell>
                  <TableCell>{b.total_price ? formatCurrency(b.total_price, b.currency) : '—'}</TableCell>
                  <TableCell><Badge variant={statusColors[b.status] || 'secondary'}>{b.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{formatDate(b.created_at)}</TableCell>
                  <TableCell>
                    {b.status !== 'cancelled' && b.status !== 'completed' && (
                      <Button variant="ghost" size="sm" onClick={() => cancelBooking(b.id)}><XCircle className="h-4 w-4 text-destructive" /></Button>
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
