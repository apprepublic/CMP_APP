import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { formatDateTime } from '@/lib/utils'
import { toast } from 'sonner'
import { Loader2, Eye, MailCheck } from 'lucide-react'

export default function Contact() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<any | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  const markRead = async (id: string) => {
    const { error } = await supabase.from('contact_messages').update({ read: true }).eq('id', id)
    if (!error) load()
    else toast.error('Failed: ' + error.message)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Contact Messages</h2>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead>Subject</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead><TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : items.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center py-12 text-muted-foreground">No messages</TableCell></TableRow>
              ) : items.map((m: any) => (
                <TableRow key={m.id} className={!m.read ? 'font-semibold bg-accent/30' : ''}>
                  <TableCell>{m.name}</TableCell>
                  <TableCell className="text-muted-foreground">{m.email}</TableCell>
                  <TableCell className="max-w-40 truncate">{m.subject}</TableCell>
                  <TableCell><Badge variant={m.read ? 'secondary' : 'default'}>{m.read ? 'Read' : 'New'}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{formatDateTime(m.created_at)}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => setSelected(m)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      {!m.read && (
                        <Button variant="ghost" size="sm" onClick={() => markRead(m.id)}>
                          <MailCheck className="h-4 w-4 text-primary" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) setSelected(null) }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Message from {selected?.name}</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{selected.email}</span>
                <span className="text-muted-foreground">{formatDateTime(selected.created_at)}</span>
              </div>
              {selected.subject && (
                <div className="p-3 bg-muted rounded-md text-sm font-medium">{selected.subject}</div>
              )}
              <div className="p-4 bg-muted/50 rounded-md text-sm whitespace-pre-wrap">{selected.message}</div>
              {!selected.read && (
                <Button onClick={() => { markRead(selected.id); setSelected(null) }} className="w-full">
                  <MailCheck className="h-4 w-4 mr-2" /> Mark as Read
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
