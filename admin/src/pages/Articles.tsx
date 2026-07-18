import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDate, formatDateTime } from '@/lib/utils'
import { toast } from 'sonner'
import { Loader2, Search, Eye, Globe, Lock, Trash2 } from 'lucide-react'

export default function Articles() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('articles').select('*').order('created_at', { ascending: false })
    setArticles(data || [])
    setLoading(false)
  }

  const togglePublish = async (article: any) => {
    const now = article.is_published ? null : new Date().toISOString()
    const { error } = await supabase.from('articles').update({ is_published: !article.is_published, published_at: now }).eq('id', article.id)
    if (error) toast.error('Failed: ' + error.message)
    else { toast.success(article.is_published ? 'Article unpublished' : 'Article published'); load() }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('articles').delete().eq('id', id)
    if (error) toast.error('Failed: ' + error.message)
    else { toast.success('Article deleted'); load() }
  }

  const filtered = articles.filter(a => {
    const q = search.toLowerCase()
    return !search || a.title?.toLowerCase().includes(q) || a.category?.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Articles</h2>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search articles..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead><TableHead>Category</TableHead><TableHead>Views</TableHead><TableHead>AI Gen</TableHead><TableHead>Status</TableHead><TableHead>Published</TableHead><TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
              ) : filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No articles found</TableCell></TableRow>
              ) : filtered.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium max-w-60 truncate">{a.title}</TableCell>
                  <TableCell><Badge variant="outline">{a.category}</Badge></TableCell>
                  <TableCell>{a.view_count?.toLocaleString() || 0}</TableCell>
                  <TableCell>{a.is_ai_generated ? <Badge variant="secondary">AI</Badge> : '—'}</TableCell>
                  <TableCell><Badge variant={a.is_published ? 'default' : 'secondary'}>{a.is_published ? 'Published' : 'Draft'}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-xs">{a.published_at ? formatDate(a.published_at) : '—'}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => togglePublish(a)} title={a.is_published ? 'Unpublish' : 'Publish'}>
                        {a.is_published ? <Lock className="h-4 w-4" /> : <Globe className="h-4 w-4" />}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDelete(a.id)} title="Delete">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
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
