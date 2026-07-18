-- Admin portal tables for CMP App

-- Admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('superadmin', 'admin')),
  auth_uid UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Admin audit logs
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES public.admin_users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS: admins can read their own record
CREATE POLICY "admin_users_select_own" ON public.admin_users
  FOR SELECT USING (auth.uid() = auth_uid);

-- RLS: service_role full access
CREATE POLICY "admin_users_service_role" ON public.admin_users
  FOR ALL USING (auth.role() = 'service_role');

-- RLS: audit logs - admins can read and insert
CREATE POLICY "admin_audit_logs_select" ON public.admin_audit_logs
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.admin_users WHERE auth_uid = auth.uid() AND is_active = true
  ));

CREATE POLICY "admin_audit_logs_insert" ON public.admin_audit_logs
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.admin_users WHERE auth_uid = auth.uid() AND is_active = true
  ));

CREATE POLICY "admin_audit_logs_service_role" ON public.admin_audit_logs
  FOR ALL USING (auth.role() = 'service_role');
