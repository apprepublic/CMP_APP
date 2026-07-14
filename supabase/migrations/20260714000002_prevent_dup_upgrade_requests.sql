-- Prevent duplicate pending upgrade requests per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_pending_upgrade
  ON tutor_upgrade_requests (user_id)
  WHERE status = 'pending';
