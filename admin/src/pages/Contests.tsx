import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { Loader2, Plus, Pencil } from 'lucide-react'

export default function Contests() {
  const [contests, setContests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('contests').select('*').order('created_at', { ascending: false })
    setContests(data || [])
    setLoading(false)
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    const payload = {
      title: editing.title, description: editing.description, category: editing.category,
      start_date: editing.start_date, end_date: editing.end_date,
      entry_deadline: editing.entry_deadline || null,
      prize_pool_coins: Number(editing.prize_pool_coins), status: editing.status,
    }
    const { error } = editing.id
      ? await supabase.from('contests').update(payload).eq('id', editing.id)
      : await supabase.from('contests').insert(payload)
    if (error) toast.error('Failed: ' + error.message)
    else { toast.success(editing.id ? 'Contest updated' : 'Contest created'); setEditing(null); load() }
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Contests</h2>
        <Dialog open={!!editing && !editing?.id} onOpenChange={(o) => { if (!o) setEditing(null) }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({
              title: '', description: '', category: 'COVER', status: 'UPCOMING',
              start_date: '', end_date: '', entry_deadline: '', prize_pool_coins: 0,
            })}>
              <Plus className="h-4 w-4 mr-2" /> New Contest
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Prize Pool</TableHead><TableHead>Status</TableHead><TableHead>Start</TableHead><TableHead>End</TableHead><TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : contests.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No contests</TableCell></TableRow>
              ) : contests.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium max-w-40 truncate">{c.title}</TableCell>
                  <TableCell><Badge variant="outline">{c.category}</Badge></TableCell>
                  <TableCell className="font-mono">{c.prize_pool_coins?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === 'ACTIVE' ? 'default' : c.status === 'UPCOMING' ? 'secondary' : c.status === 'COMPLETED' ? 'outline' : 'destructive'}>
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(c.start_date)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{formatDate(c.end_date)}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setEditing({ ...c })}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editing?.id} onOpenChange={(o) => { if (!o) setEditing(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing?.id ? 'Edit Contest' : 'New Contest'}</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={editing.title} onChange={e => setEditing({ ...editing, title: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={editing.category} onValueChange={v => setEditing({ ...editing, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="COVER">Cover</SelectItem>
                      <SelectItem value="ORIGINAL">Original</SelectItem>
                      <SelectItem value="REMIX">Remix</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={editing.status} onValueChange={v => setEditing({ ...editing, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UPCOMING">Upcoming</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Prize Pool (coins)</Label>
                  <Input type="number" value={editing.prize_pool_coins} onChange={e => setEditing({ ...editing, prize_pool_coins: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Entry Deadline</Label>
                  <Input type="date" value={editing.entry_deadline?.split('T')[0] || ''} onChange={e => setEditing({ ...editing, entry_deadline: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input type="date" value={editing.start_date?.split('T')[0] || ''} onChange={e => setEditing({ ...editing, start_date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" value={editing.end_date?.split('T')[0] || ''} onChange={e => setEditing({ ...editing, end_date: e.target.value })} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : 'Save'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
