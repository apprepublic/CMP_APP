-- Migration to add check_email_exists RPC helper for register-user edge function
CREATE OR REPLACE FUNCTION check_email_exists(email_to_check TEXT)
RETURNS BOOLEAN
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users
    WHERE email = LOWER(email_to_check)
  );
END;
$$ LANGUAGE plpgsql;
