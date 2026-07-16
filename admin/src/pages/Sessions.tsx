import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import { Loader2, Search } from 'lucide-react'

export default function Sessions() {
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('sessions').select('*, student:profiles!student_id(first_name, last_name), tutor:profiles!tutor_id(first_name, last_name)').order('session_date', { ascending: false })
    setSessions(data || [])
    setLoading(false)
  }

  const filtered = sessions.filter((s: any) => {
    const q = search.toLowerCase()
    return (!search || `${s.student?.first_name} ${s.student?.last_name} ${s.tutor?.first_name} ${s.tutor?.last_name} ${s.subject}`.toLowerCase().includes(q)) &&
      (statusFilter === 'all' || s.status === statusFilter)
  })

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Sessions</h2>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
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
                <TableHead>Student</TableHead><TableHead>Tutor</TableHead><TableHead>Subject</TableHead><TableHead>Date</TableHead><TableHead>Time</TableHead><TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No sessions</TableCell></TableRow>
              ) : filtered.map((s: any) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium">{s.student?.first_name} {s.student?.last_name}</TableCell>
                  <TableCell>{s.tutor?.first_name} {s.tutor?.last_name}</TableCell>
                  <TableCell>{s.subject}</TableCell>
                  <TableCell>{formatDate(s.session_date)}</TableCell>
                  <TableCell>{s.start_time} - {s.end_time}</TableCell>
                  <TableCell><Badge variant={s.status === 'completed' ? 'success' : s.status === 'scheduled' ? 'default' : 'destructive'}>{s.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
