-- Allow authenticated users (and service role) to insert notifications
-- This is needed for the app to write notification rows from client-side mutations

-- Allow any authenticated user to insert a notification targeting any user_id
-- (needed for creator→participant approval notifications across different users)
CREATE POLICY "Authenticated users can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
