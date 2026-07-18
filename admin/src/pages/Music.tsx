import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { Loader2, Star, Eye, Music2, Users } from 'lucide-react'

export default function Music() {
  const [artists, setArtists] = useState<any[]>([])
  const [songs, setSongs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const [aRes, sRes] = await Promise.all([
      supabase.from('artists').select('*').order('created_at', { ascending: false }),
      supabase.from('songs').select('*, artists(stage_name)').order('created_at', { ascending: false }),
    ])
    setArtists(aRes.data || [])
    setSongs(sRes.data || [])
    setLoading(false)
  }

  const toggleArtistVerify = async (artist: any) => {
    const { error } = await supabase.from('artists').update({ is_verified: !artist.is_verified }).eq('id', artist.id)
    if (error) toast.error('Failed: ' + error.message)
    else { toast.success(artist.is_verified ? 'Unverified' : 'Verified'); load() }
  }

  const toggleSongFeatured = async (song: any) => {
    const { error } = await supabase.from('songs').update({ is_featured: !song.is_featured }).eq('id', song.id)
    if (error) toast.error('Failed: ' + error.message)
    else { toast.success(song.is_featured ? 'Unfeatured' : 'Featured'); load() }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Music Management</h2>

      <Tabs defaultValue="artists">
        <TabsList>
          <TabsTrigger value="artists"><Users className="h-4 w-4 mr-2" /> Artists</TabsTrigger>
          <TabsTrigger value="songs"><Music2 className="h-4 w-4 mr-2" /> Songs</TabsTrigger>
        </TabsList>

        <TabsContent value="artists">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Stage Name</TableHead><TableHead>Genre</TableHead><TableHead>Verified</TableHead><TableHead>Followers</TableHead><TableHead>Listeners</TableHead><TableHead>Created</TableHead><TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                  ) : artists.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No artists</TableCell></TableRow>
                  ) : artists.map(a => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.stage_name}</TableCell>
                      <TableCell><Badge variant="outline">{a.genre || '—'}</Badge></TableCell>
                      <TableCell><Badge variant={a.is_verified ? 'default' : 'secondary'}>{a.is_verified ? 'Verified' : 'No'}</Badge></TableCell>
                      <TableCell>{a.follower_count?.toLocaleString()}</TableCell>
                      <TableCell>{a.monthly_listeners?.toLocaleString()}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">{formatDate(a.created_at)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => toggleArtistVerify(a)}>
                          <Star className={`h-4 w-4 ${a.is_verified ? 'text-yellow-500' : ''}`} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="songs">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead><TableHead>Artist</TableHead><TableHead>Genre</TableHead><TableHead>Plays</TableHead><TableHead>Featured</TableHead><TableHead>Published</TableHead><TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                  ) : songs.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No songs</TableCell></TableRow>
                  ) : songs.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium max-w-40 truncate">{s.title}</TableCell>
                      <TableCell className="text-muted-foreground">{s.artists?.stage_name || '—'}</TableCell>
                      <TableCell><Badge variant="outline">{s.genre || '—'}</Badge></TableCell>
                      <TableCell>{s.play_count?.toLocaleString()}</TableCell>
                      <TableCell><Badge variant={s.is_featured ? 'default' : 'secondary'}>{s.is_featured ? 'Featured' : 'No'}</Badge></TableCell>
                      <TableCell><Badge variant={s.is_published ? 'default' : 'secondary'}>{s.is_published ? 'Yes' : 'No'}</Badge></TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => toggleSongFeatured(s)} title="Toggle featured">
                          <Star className={`h-4 w-4 ${s.is_featured ? 'text-yellow-500' : ''}`} />
                        </Button>
                      </TableCell>
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
