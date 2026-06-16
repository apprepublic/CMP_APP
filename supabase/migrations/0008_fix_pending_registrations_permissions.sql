CREATE TABLE IF NOT EXISTS public.pending_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  full_name text,
  verification_token uuid NOT NULL DEFAULT gen_random_uuid(),
  verification_code text NOT NULL,
  referral_code text,
  ip_address text,
  user_agent text,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '24 hours'),
  used_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_pending_registrations_email ON public.pending_registrations(email);
CREATE INDEX idx_pending_registrations_token ON public.pending_registrations(verification_token);

ALTER TABLE public.pending_registrations ENABLE ROW LEVEL SECURITY;

-- Grant permissions to service_role (required for edge functions)
GRANT ALL ON public.pending_registrations TO service_role;
GRANT ALL ON public.pending_registrations TO authenticated;
GRANT ALL ON public.pending_registrations TO anon;