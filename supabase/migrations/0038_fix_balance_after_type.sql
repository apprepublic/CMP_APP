-- Fix "column balance_after is of type bigint but expression is of type text"
-- coin_transactions.balance_after is BIGINT; v_new_balance is already BIGINT

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
  VALUES (p_user_id, p_fiat_amount::DECIMAL(18,2), p_coin_amount, 'PENDING', p_account_details)
  RETURNING id INTO v_request_id;

  INSERT INTO coin_transactions (wallet_id, user_id, type, amount, balance_after, description)
  VALUES (p_wallet_id, p_user_id, 'WITHDRAWAL', p_coin_amount, v_new_balance, 'Withdrawal pending - coins withheld');

  RETURN v_request_id;
END;
$$;

CREATE OR REPLACE FUNCTION reject_withdrawal(
  p_request_id UUID
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_wallet_id UUID;
  v_user_id UUID;
  v_coin_amount BIGINT;
  v_current_balance BIGINT;
  v_new_balance BIGINT;
BEGIN
  SELECT user_id, coin_amount::BIGINT INTO v_user_id, v_coin_amount
  FROM withdrawal_requests WHERE id = p_request_id AND status = 'PENDING'
  FOR UPDATE;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Withdrawal request not found or already processed';
  END IF;

  SELECT id, coin_balance::BIGINT INTO v_wallet_id, v_current_balance
  FROM wallets WHERE user_id = v_user_id
  FOR UPDATE;

  v_new_balance := v_current_balance + v_coin_amount;

  UPDATE wallets SET coin_balance = v_new_balance::TEXT, updated_at = now()
  WHERE id = v_wallet_id;

  UPDATE withdrawal_requests SET status = 'REJECTED', processed_at = now()
  WHERE id = p_request_id;

  INSERT INTO coin_transactions (wallet_id, user_id, type, amount, balance_after, description)
  VALUES (v_wallet_id, v_user_id, 'REFUND', v_coin_amount, v_new_balance, 'Withdrawal rejected - coins returned');
END;
$$;
