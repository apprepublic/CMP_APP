import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { Loader2, Search, Ban, CheckCircle } from 'lucide-react'

export default function Tutors() {
  const [tutors, setTutors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [countryFilter, setCountryFilter] = useState('all')
  const [suspending, setSuspending] = useState<string | null>(null)

  useEffect(() => { loadTutors() }, [])

  async function loadTutors() {
    setLoading(true)
    const { data } = await supabase
      .from('tutor_profiles')
      .select('*, profiles!inner(id, first_name, last_name, email, country, kyc_status, gender)')
      .order('created_at', { ascending: false })
    setTutors(data || [])
    setLoading(false)
  }

  const filtered = tutors.filter((t: any) => {
    const q = search.toLowerCase()
    const name = `${t.profiles?.first_name || ''} ${t.profiles?.last_name || ''}`.toLowerCase()
    const email = (t.profiles?.email || '').toLowerCase()
    const matchesSearch = !search || name.includes(q) || email.includes(q)
    const matchesCountry = countryFilter === 'all' || t.profiles?.country === countryFilter
    return matchesSearch && matchesCountry
  })

  const countries = [...new Set(tutors.map((t: any) => t.profiles?.country).filter(Boolean))].sort() as string[]

  const toggleSuspend = async (tutorId: string, isSuspended: boolean) => {
    setSuspending(tutorId)
    const { error } = await supabase
      .from('tutor_profiles')
      .update({ suspended_at: isSuspended ? null : new Date().toISOString() })
      .eq('id', tutorId)
    if (error) toast.error('Failed: ' + error.message)
    else {
      toast.success(isSuspended ? 'Tutor unsuspended' : 'Tutor suspended')
      loadTutors()
    }
    setSuspending(null)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Tutors</h2>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search tutors..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-44"><SelectValue placeholder="All countries" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Rate</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>KYC</TableHead>
                <TableHead>Credentials</TableHead>
                <TableHead>Suspended</TableHead>
                <TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={10} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={10} className="text-center py-12 text-muted-foreground">No tutors found</TableCell></TableRow>
              ) : filtered.map((t: any) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.profiles?.first_name} {t.profiles?.last_name}</TableCell>
                  <TableCell>{t.rating ? `${Number(t.rating).toFixed(1)} ★` : '—'}</TableCell>
                  <TableCell className="max-w-40 truncate">{(t.subjects || []).join(', ')}</TableCell>
                  <TableCell>{t.hourly_rate ? formatCurrency(t.hourly_rate, t.currency) : '—'}</TableCell>
                  <TableCell>{t.profiles?.country || '—'}</TableCell>
                  <TableCell><Badge variant={t.status === 'active' ? 'success' : 'warning'}>{t.status}</Badge></TableCell>
                  <TableCell><Badge variant={t.profiles?.kyc_status === 'verified' ? 'success' : 'secondary'}>{t.profiles?.kyc_status || 'none'}</Badge></TableCell>
                  <TableCell><Badge variant={t.credentials_status === 'approved' ? 'success' : t.credentials_status === 'pending' ? 'warning' : 'secondary'}>{t.credentials_status || 'none'}</Badge></TableCell>
                  <TableCell>{t.suspended_at ? <Badge variant="destructive">Suspended</Badge> : <span className="text-xs text-muted-foreground">—</span>}</TableCell>
                  <TableCell>
                    <Button
                      variant={t.suspended_at ? "outline" : "ghost"}
                      size="sm"
                      onClick={() => toggleSuspend(t.id, !!t.suspended_at)}
                      disabled={suspending === t.id}
                    >
                      {suspending === t.id ? <Loader2 className="h-4 w-4 animate-spin" /> :
                       t.suspended_at ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Ban className="h-4 w-4 text-destructive" />}
                    </Button>
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
