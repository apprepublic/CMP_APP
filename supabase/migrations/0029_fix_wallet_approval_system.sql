-- Fix 1: Grant UPDATE and INSERT on wallets and coin_transactions to authenticated users
GRANT UPDATE ON public.wallets TO authenticated;
GRANT INSERT ON public.wallets TO authenticated;
GRANT INSERT ON public.coin_transactions TO authenticated;
GRANT SELECT ON public.coin_transactions TO authenticated;

-- Fix 2: Add RLS policies so users can update their OWN wallet
-- and creators can update the earner's wallet via approval
CREATE POLICY "Users can update own wallet"
  ON public.wallets
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Fix 3: Add RLS policy allowing insert to coin_transactions for own user
CREATE POLICY "Users can insert own transactions"
  ON public.coin_transactions
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert transactions"
  ON public.coin_transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can select own transactions"
  ON public.coin_transactions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Fix 4: Create a SECURITY DEFINER function so task creators can credit 
-- another user's wallet on approval (bypasses RLS safely)
CREATE OR REPLACE FUNCTION public.approve_task_completion(
  p_completion_id UUID,
  p_reviewer_id UUID,
  p_posted_task_id UUID
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_completion RECORD;
  v_wallet RECORD;
  v_new_balance NUMERIC;
  v_new_lifetime NUMERIC;
  v_tx_id UUID;
  v_creator_id UUID;
BEGIN
  -- Verify the reviewer is the task creator
  SELECT creator_id INTO v_creator_id
  FROM user_posted_tasks
  WHERE id = p_posted_task_id;

  IF v_creator_id IS DISTINCT FROM p_reviewer_id THEN
    RAISE EXCEPTION 'Only the task creator can approve completions';
  END IF;

  -- Get the pending completion
  SELECT * INTO v_completion
  FROM user_task_completions
  WHERE id = p_completion_id
    AND status = 'PENDING'
    AND posted_task_id = p_posted_task_id;

  IF v_completion IS NULL THEN
    RAISE EXCEPTION 'Completion not found or already processed';
  END IF;

  -- Mark completion as approved
  UPDATE user_task_completions
  SET status = 'APPROVED',
      reviewer_id = p_reviewer_id,
      reviewed_at = NOW()
  WHERE id = p_completion_id;

  -- Credit the earner's wallet
  SELECT * INTO v_wallet
  FROM wallets
  WHERE user_id = v_completion.user_id;

  IF v_wallet IS NULL THEN
    RAISE EXCEPTION 'Earner wallet not found';
  END IF;

  v_new_balance := v_wallet.balance + v_completion.coins_earned;
  v_new_lifetime := v_wallet.lifetime_earned + v_completion.coins_earned;

  UPDATE wallets
  SET balance = v_new_balance,
      lifetime_earned = v_new_lifetime,
      updated_at = NOW()
  WHERE id = v_wallet.id;

  -- Record the transaction
  v_tx_id := gen_random_uuid();
  INSERT INTO coin_transactions (id, user_id, type, amount, balance_after, description, reference_id)
  VALUES (v_tx_id, v_completion.user_id, 'earn', v_completion.coins_earned, v_new_balance, 'Earned from posted task', p_posted_task_id::text);

  RETURN jsonb_build_object(
    'success', true,
    'coins_credited', v_completion.coins_earned,
    'new_balance', v_new_balance
  );
END;
$$;

-- Allow authenticated users to call this function
GRANT EXECUTE ON FUNCTION public.approve_task_completion(UUID, UUID, UUID) TO authenticated;

NOTIFY pgrst, 'reload schema';
