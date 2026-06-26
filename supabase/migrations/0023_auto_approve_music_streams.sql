CREATE OR REPLACE FUNCTION public.complete_posted_task_with_increment(
  p_user_id uuid,
  p_posted_task_id uuid,
  p_coins_earned integer,
  p_proof_data jsonb DEFAULT NULL::jsonb,
  p_auto_approve boolean DEFAULT false
)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
DECLARE
  v_completion_id UUID;
  v_creator_id UUID;
  v_current_count INTEGER;
  v_threshold INTEGER;
  v_status TEXT;
  v_wallet_id UUID;
BEGIN
  -- Get task details with lock
  SELECT creator_id, current_participants, participant_threshold
  INTO v_creator_id, v_current_count, v_threshold
  FROM user_posted_tasks
  WHERE id = p_posted_task_id
    AND is_active = true
    AND status = 'ACTIVE'
  FOR UPDATE;

  -- Check if task exists and is active
  IF v_creator_id IS NULL THEN
    RAISE EXCEPTION 'Task not found or not active';
  END IF;

  -- Check if user is the creator
  IF v_creator_id = p_user_id THEN
    RAISE EXCEPTION 'Cannot complete your own task';
  END IF;

  -- Check if task is full
  IF v_current_count >= v_threshold THEN
    RAISE EXCEPTION 'Task has reached participant limit';
  END IF;

  IF p_auto_approve THEN
    v_status := 'APPROVED';
  ELSE
    v_status := 'PENDING';
  END IF;

  -- Insert completion
  INSERT INTO user_task_completions (user_id, posted_task_id, coins_earned, proof_data, status)
  VALUES (p_user_id, p_posted_task_id, p_coins_earned, p_proof_data, v_status)
  RETURNING id INTO v_completion_id;

  -- Increment participant count
  UPDATE user_posted_tasks
  SET current_participants = current_participants + 1,
      updated_at = NOW()
  WHERE id = p_posted_task_id;

  -- Auto credit wallet if approved
  IF p_auto_approve THEN
    UPDATE wallets
    SET balance = balance + p_coins_earned,
        lifetime_earned = lifetime_earned + p_coins_earned,
        updated_at = NOW()
    WHERE user_id = p_user_id
    RETURNING id INTO v_wallet_id;

    IF v_wallet_id IS NOT NULL THEN
      INSERT INTO coin_transactions (id, user_id, type, amount, balance_after, description, reference_id)
      SELECT gen_random_uuid(), p_user_id, 'earn', p_coins_earned, balance, 'Auto-approved streaming task', p_posted_task_id::text
      FROM wallets WHERE id = v_wallet_id;
    END IF;
  END IF;

  RETURN v_completion_id;
END;
$function$;
