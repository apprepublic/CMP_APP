-- Fix "column amount is of type numeric but expression is of type text" error
-- p_fiat_amount was TEXT but amount column is DECIMAL(18,2)

CREATE OR REPLACE FUNCTION request_withdrawal(
  p_user_id UUID,
  p_wallet_id UUID,
  p_coin_amount BIGINT,
  p_fiat_amount TEXT,
  p_account_details JSONB
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_balance BIGINT;
  v_new_balance BIGINT;
  v_request_id UUID;
BEGIN
  SELECT (coin_balance::BIGINT) INTO v_current_balance
  FROM wallets WHERE id = p_wallet_id
  FOR UPDATE;

  IF v_current_balance IS NULL THEN
    RAISE EXCEPTION 'Wallet not found';
  END IF;

  IF v_current_balance < p_coin_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  v_new_balance := v_current_balance - p_coin_amount;

  UPDATE wallets SET coin_balance = v_new_balance::TEXT, updated_at = now()
  WHERE id = p_wallet_id;

  INSERT INTO withdrawal_requests (user_id, amount, coin_amount, status, account_details)
  VALUES (p_user_id, p_fiat_amount::DECIMAL(18,2), p_coin_amount::TEXT, 'PENDING', p_account_details)
  RETURNING id INTO v_request_id;

  INSERT INTO coin_transactions (wallet_id, user_id, type, amount, balance_after, description)
  VALUES (p_wallet_id, p_user_id, 'WITHDRAWAL', p_coin_amount, v_new_balance::TEXT, 'Withdrawal pending - coins withheld');

  RETURN v_request_id;
END;
$$;
