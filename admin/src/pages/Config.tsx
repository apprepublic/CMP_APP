import { useEffect, useState } from 'react'
import { supabase } from '@shared/supabase-client'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'

interface ConfigItem {
  key: string
  value: any
  description: string | null
}

export default function Config() {
  const { admin } = useAdminAuth()
  const [configs, setConfigs] = useState<ConfigItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data } = await supabase.from('admin_config').select('*').order('key')
    setConfigs(data || [])
    setLoading(false)
  }

  const updateValue = async (key: string, value: any) => {
    setSaving(key)
    const { error } = await supabase.from('admin_config').upsert({
      key,
      value: typeof value === 'string' && !isNaN(Number(value)) ? Number(value) : value,
      updated_by: admin?.id,
      updated_at: new Date().toISOString(),
    })
    if (error) toast.error('Failed: ' + error.message)
    else {
      toast.success('Config updated')
      load()
    }
    setSaving(null)
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">System Config</h2>
      <Card>
        <CardHeader><CardTitle className="text-lg">Platform Settings</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          {configs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No configuration entries yet. Add them via the admin_config table.</p>
          ) : configs.map((cfg) => (
            <div key={cfg.key} className="flex items-center justify-between gap-4 p-3 border rounded-lg">
              <div className="flex-1 min-w-0">
                <Label className="font-mono text-sm">{cfg.key}</Label>
                {cfg.description && <p className="text-xs text-muted-foreground">{cfg.description}</p>}
              </div>
              <div className="flex items-center gap-2">
                {typeof cfg.value === 'boolean' ? (
                  <Switch checked={cfg.value} onCheckedChange={(v) => updateValue(cfg.key, v)} disabled={saving === cfg.key} />
                ) : (
                  <div className="flex items-center gap-2">
                    <Input
                      type={typeof cfg.value === 'number' ? 'number' : 'text'}
                      defaultValue={String(cfg.value ?? '')}
                      className="w-32 h-9 text-sm"
                      onBlur={(e) => {
                        const newVal = e.target.value
                        if (newVal !== String(cfg.value ?? '')) {
                          const parsed = typeof cfg.value === 'number' ? Number(newVal) : newVal
                          updateValue(cfg.key, parsed)
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const newVal = (e.target as HTMLInputElement).value
                          const parsed = typeof cfg.value === 'number' ? Number(newVal) : newVal
                          updateValue(cfg.key, parsed)
                        }
                      }}
                    />
                    {saving === cfg.key && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
