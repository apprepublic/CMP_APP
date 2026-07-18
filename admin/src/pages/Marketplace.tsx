import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { formatDate } from '@/lib/utils'
import { toast } from 'sonner'
import { Loader2, Plus, Pencil, Store, Package } from 'lucide-react'

export default function Marketplace() {
  const [stores, setStores] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingStore, setEditingStore] = useState<any | null>(null)
  const [editingProduct, setEditingProduct] = useState<any | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const [sRes, pRes] = await Promise.all([
      supabase.from('stores').select('*').order('name'),
      supabase.from('products').select('*, stores(name)').order('created_at', { ascending: false }),
    ])
    setStores(sRes.data || [])
    setProducts(pRes.data || [])
    setLoading(false)
  }

  const toggleStoreActive = async (store: any) => {
    const { error } = await supabase.from('stores').update({ is_active: !store.is_active }).eq('id', store.id)
    if (error) toast.error('Failed: ' + error.message)
    else { toast.success(store.is_active ? 'Disabled' : 'Enabled'); load() }
  }

  const saveStore = async () => {
    if (!editingStore) return; setSaving(true)
    const payload = { name: editingStore.name, slug: editingStore.slug, description: editingStore.description, is_active: editingStore.is_active ?? true }
    const { error } = editingStore.id
      ? await supabase.from('stores').update(payload).eq('id', editingStore.id)
      : await supabase.from('stores').insert(payload)
    if (error) toast.error('Failed: ' + error.message)
    else { toast.success(editingStore.id ? 'Store updated' : 'Store created'); setEditingStore(null); load() }
    setSaving(false)
  }

  const saveProduct = async () => {
    if (!editingProduct) return; setSaving(true)
    const payload = {
      store_id: editingProduct.store_id, name: editingProduct.name, description: editingProduct.description,
      price_coins: Number(editingProduct.price_coins), stock_quantity: Number(editingProduct.stock_quantity),
      is_available: editingProduct.is_available ?? true, category: editingProduct.category,
    }
    const { error } = editingProduct.id
      ? await supabase.from('products').update(payload).eq('id', editingProduct.id)
      : await supabase.from('products').insert(payload)
    if (error) toast.error('Failed: ' + error.message)
    else { toast.success(editingProduct.id ? 'Product updated' : 'Product created'); setEditingProduct(null); load() }
    setSaving(false)
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Marketplace</h2>

      <Tabs defaultValue="stores">
        <TabsList>
          <TabsTrigger value="stores"><Store className="h-4 w-4 mr-2" /> Stores</TabsTrigger>
          <TabsTrigger value="products"><Package className="h-4 w-4 mr-2" /> Products</TabsTrigger>
        </TabsList>

        <TabsContent value="stores">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead><TableHead>Slug</TableHead><TableHead>Active</TableHead><TableHead>Created</TableHead><TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                  ) : stores.length === 0 ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-12 text-muted-foreground">No stores</TableCell></TableRow>
                  ) : stores.map(s => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-muted-foreground">{s.slug}</TableCell>
                      <TableCell><Switch checked={s.is_active} onCheckedChange={() => toggleStoreActive(s)} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{formatDate(s.created_at)}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => setEditingStore({ ...s })}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead><TableHead>Store</TableHead><TableHead>Price</TableHead><TableHead>Stock</TableHead><TableHead>Available</TableHead><TableHead>Category</TableHead><TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-12"><Loader2 className="h-6 w-6 animate-spin mx-auto" /></TableCell></TableRow>
                  ) : products.length === 0 ? (
                    <TableRow><TableCell colSpan={7} className="text-center py-12 text-muted-foreground">No products</TableCell></TableRow>
                  ) : products.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium max-w-40 truncate">{p.name}</TableCell>
                      <TableCell className="text-muted-foreground">{p.stores?.name}</TableCell>
                      <TableCell className="font-mono">{p.price_coins?.toLocaleString()}</TableCell>
                      <TableCell>{p.stock_quantity}</TableCell>
                      <TableCell><Badge variant={p.is_available ? 'default' : 'secondary'}>{p.is_available ? 'Yes' : 'No'}</Badge></TableCell>
                      <TableCell><Badge variant="outline">{p.category || '—'}</Badge></TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" onClick={() => setEditingProduct({ ...p, store_id: p.store_id })}>
                          <Pencil className="h-4 w-4" />
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

      <Dialog open={!!editingStore} onOpenChange={(o) => { if (!o) setEditingStore(null) }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingStore?.id ? 'Edit Store' : 'New Store'}</DialogTitle></DialogHeader>
          {editingStore && (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={editingStore.name} onChange={e => setEditingStore({ ...editingStore, name: e.target.value })} /></div>
              <div className="space-y-2"><Label>Slug</Label><Input value={editingStore.slug} onChange={e => setEditingStore({ ...editingStore, slug: e.target.value })} /></div>
              <div className="space-y-2"><Label>Description</Label><Input value={editingStore.description || ''} onChange={e => setEditingStore({ ...editingStore, description: e.target.value })} /></div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingStore(null)}>Cancel</Button>
                <Button onClick={saveStore} disabled={saving}>{saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : 'Save'}</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingProduct} onOpenChange={(o) => { if (!o) setEditingProduct(null) }}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingProduct?.id ? 'Edit Product' : 'New Product'}</DialogTitle></DialogHeader>
          {editingProduct && (
            <div className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} /></div>
              <div className="space-y-2">
                <Label>Store</Label>
                <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={editingProduct.store_id} onChange={e => setEditingProduct({ ...editingProduct, store_id: e.target.value })}>
                  {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2"><Label>Price (coins)</Label><Input type="number" value={editingProduct.price_coins} onChange={e => setEditingProduct({ ...editingProduct, price_coins: e.target.value })} /></div>
                <div className="space-y-2"><Label>Stock</Label><Input type="number" value={editingProduct.stock_quantity} onChange={e => setEditingProduct({ ...editingProduct, stock_quantity: e.target.value })} /></div>
              </div>
              <div className="space-y-2"><Label>Category</Label><Input value={editingProduct.category || ''} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value })} /></div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditingProduct(null)}>Cancel</Button>
                <Button onClick={saveProduct} disabled={saving}>{saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : 'Save'}</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
