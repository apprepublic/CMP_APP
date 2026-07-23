-- Allow admins to view all wallets
CREATE POLICY "Admins can view all wallets"
ON wallets FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.auth_uid = auth.uid() AND au.is_active = true
  )
);

-- Allow admins to view all withdrawal requests
CREATE POLICY "Admins can view all withdrawal requests"
ON withdrawal_requests FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.auth_uid = auth.uid() AND au.is_active = true
  )
);

-- Allow admins to view all coin transactions
CREATE POLICY "Admins can view all coin transactions"
ON coin_transactions FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM admin_users au
    WHERE au.auth_uid = auth.uid() AND au.is_active = true
  )
);
