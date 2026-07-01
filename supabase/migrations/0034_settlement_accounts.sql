CREATE TABLE IF NOT EXISTS settlement_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('NGN_BANK', 'CRYPTO')),
  account_name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  bank_name TEXT,
  network TEXT,
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_settlement_accounts_user_id ON settlement_accounts(user_id);

ALTER TABLE settlement_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settlement accounts"
  ON settlement_accounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settlement accounts"
  ON settlement_accounts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settlement accounts"
  ON settlement_accounts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own settlement accounts"
  ON settlement_accounts FOR DELETE
  USING (auth.uid() = user_id);

GRANT ALL ON settlement_accounts TO authenticated;
GRANT ALL ON settlement_accounts TO service_role;

-- Request withdrawal RPC: atomically inserts withdrawal_request + deducts wallet
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
  -- Lock wallet row
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

  -- Deduct wallet balance
  UPDATE wallets SET coin_balance = v_new_balance::TEXT, updated_at = now()
  WHERE id = p_wallet_id;

  -- Insert withdrawal request
  INSERT INTO withdrawal_requests (user_id, amount, coin_amount, status, account_details)
  VALUES (p_user_id, p_fiat_amount::DECIMAL(18,2), p_coin_amount, 'PENDING', p_account_details)
  RETURNING id INTO v_request_id;

  -- Record coin transaction
  INSERT INTO coin_transactions (wallet_id, user_id, type, amount, balance_after, description)
  VALUES (p_wallet_id, p_user_id, 'WITHDRAWAL', p_coin_amount, v_new_balance::TEXT, 'Withdrawal pending - coins withheld');

  RETURN v_request_id;
END;
$$;

-- Reject withdrawal RPC: atomically updates status + adds coins back
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
  -- Get request details
  SELECT user_id, coin_amount::BIGINT INTO v_user_id, v_coin_amount
  FROM withdrawal_requests WHERE id = p_request_id AND status = 'PENDING'
  FOR UPDATE;

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Withdrawal request not found or already processed';
  END IF;

  -- Get wallet
  SELECT id, coin_balance::BIGINT INTO v_wallet_id, v_current_balance
  FROM wallets WHERE user_id = v_user_id
  FOR UPDATE;

  v_new_balance := v_current_balance + v_coin_amount;

  -- Add coins back
  UPDATE wallets SET coin_balance = v_new_balance::TEXT, updated_at = now()
  WHERE id = v_wallet_id;

  -- Update request status
  UPDATE withdrawal_requests SET status = 'REJECTED', processed_at = now()
  WHERE id = p_request_id;

  -- Record coin transaction
  INSERT INTO coin_transactions (wallet_id, user_id, type, amount, balance_after, description)
  VALUES (v_wallet_id, v_user_id, 'REFUND', v_coin_amount, v_new_balance::TEXT, 'Withdrawal rejected - coins returned');
END;
$$;

-- Complete withdrawal RPC: marks as completed
CREATE OR REPLACE FUNCTION complete_withdrawal(
  p_request_id UUID
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE withdrawal_requests
  SET status = 'COMPLETED', processed_at = now()
  WHERE id = p_request_id AND status = 'PENDING';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Withdrawal request not found or already processed';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION request_withdrawal TO authenticated;
GRANT EXECUTE ON FUNCTION request_withdrawal TO service_role;
GRANT EXECUTE ON FUNCTION reject_withdrawal TO service_role;
GRANT EXECUTE ON FUNCTION complete_withdrawal TO service_role;
