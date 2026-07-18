import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2, Plus, Pencil, Power } from 'lucide-react'

export default function Tasks() {
  const [tasks, setTasks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('tasks').select('*').order('sort_order')
    setTasks(data || [])
    setLoading(false)
  }

  const toggleActive = async (task: any) => {
    const { error } = await supabase.from('tasks').update({ is_active: !task.is_active }).eq('id', task.id)
    if (error) toast.error('Failed: ' + error.message)
    else { toast.success(`Task ${task.is_active ? 'disabled' : 'enabled'}`); load() }
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    const payload = {
      title: editing.title, description: editing.description, category: editing.category,
      frequency: editing.frequency, coin_reward: Number(editing.coin_reward), sort_order: Number(editing.sort_order),
      is_active: editing.is_active ?? true,
    }
    const { error } = editing.id
      ? await supabase.from('tasks').update(payload).eq('id', editing.id)
      : await supabase.from('tasks').insert(payload)
    if (error) toast.error('Failed: ' + error.message)
    else { toast.success(editing.id ? 'Task updated' : 'Task created'); setEditing(null); load() }
    setSaving(false)
  }

  const categories = ['ENGAGEMENT', 'CONTENT', 'SOCIAL', 'ONBOARDING', 'REFERRAL']
  const frequencies = ['ONE_TIME', 'DAILY', 'WEEKLY', 'UNLIMITED']

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">System Tasks</h2>
        <Dialog open={!!editing && !editing?.id} onOpenChange={(o) => { if (!o) setEditing(null) }}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing({ title: '', description: '', category: 'ENGAGEMENT', frequency: 'ONE_TIME', coin_reward: 0, sort_order: 0, is_active: true })}>
              <Plus className="h-4 w-4 mr-2" /> Add Task
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Order</TableHead><TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Frequency</TableHead><TableHead>Reward</TableHead><TableHead>Active</TableHead><TableHead className="w-20"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : tasks.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No tasks defined</TableCell></TableRow>
              ) : tasks.map(t => (
                <TableRow key={t.id}>
                  <TableCell className="text-muted-foreground">{t.sort_order}</TableCell>
                  <TableCell className="font-medium">{t.title}</TableCell>
                  <TableCell><Badge variant="outline">{t.category}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{t.frequency}</TableCell>
                  <TableCell className="font-mono">{t.coin_reward.toLocaleString()}</TableCell>
                  <TableCell><Switch checked={t.is_active} onCheckedChange={() => toggleActive(t)} /></TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => setEditing({ ...t })}>
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
        <DialogContent>
          <DialogHeader><DialogTitle>{editing?.id ? 'Edit Task' : 'New Task'}</DialogTitle></DialogHeader>
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
                    <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select value={editing.frequency} onValueChange={v => setEditing({ ...editing, frequency: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{frequencies.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Coin Reward</Label>
                  <Input type="number" value={editing.coin_reward} onChange={e => setEditing({ ...editing, coin_reward: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Input type="number" value={editing.sort_order} onChange={e => setEditing({ ...editing, sort_order: e.target.value })} />
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
