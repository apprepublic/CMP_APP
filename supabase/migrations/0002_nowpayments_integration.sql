-- NOWPayments Integration Migration
-- Adds payment tracking tables and functions for crypto wallet top-ups

-- ===========================================
-- PAYMENT TABLES
-- ===========================================

-- Crypto payment requests table
CREATE TABLE IF NOT EXISTS crypto_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  nowpayments_id BIGINT,
  purchase_id TEXT,
  order_id TEXT UNIQUE NOT NULL,
  price_amount DECIMAL(18,8) NOT NULL,
  price_currency TEXT NOT NULL DEFAULT 'USD',
  pay_amount DECIMAL(18,8),
  pay_currency TEXT,
  pay_address TEXT,
  coin_amount BIGINT,
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, COMPLETED, FAILED, EXPIRED
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_crypto_payments_user_id ON crypto_payments(user_id);
CREATE INDEX idx_crypto_payments_order_id ON crypto_payments(order_id);
CREATE INDEX idx_crypto_payments_status ON crypto_payments(status);
CREATE INDEX idx_crypto_payments_nowpayments_id ON crypto_payments(nowpayments_id);

-- ===========================================
-- DATABASE FUNCTIONS
-- ===========================================

-- Function to create a new crypto payment request
CREATE OR REPLACE FUNCTION create_crypto_payment(
  p_user_id UUID,
  p_price_amount DECIMAL,
  p_price_currency TEXT DEFAULT 'USD',
  p_pay_currency TEXT DEFAULT NULL
)
RETURNS TABLE (
  order_id TEXT,
  payment_url TEXT,
  pay_address TEXT,
  pay_amount DECIMAL,
  pay_currency TEXT,
  expires_at TIMESTAMPTZ
) AS $$
DECLARE
  v_order_id TEXT;
  v_nowpayments_id BIGINT;
  v_payment_url TEXT;
  v_pay_address TEXT;
  v_pay_amount DECIMAL;
  v_pay_currency TEXT;
  v_expires_at TIMESTAMPTZ;
BEGIN
  -- Generate unique order ID
  v_order_id := 'topup_' || p_user_id::TEXT || '_' || EXTRACT(EPOCH FROM NOW())::TEXT;
  
  -- Call NOWPayments API (this would be done via application layer)
  -- For now, we just create the record
  
  v_expires_at := NOW() + INTERVAL '24 hours';
  
  -- Insert payment record
  INSERT INTO crypto_payments (
    user_id,
    order_id,
    price_amount,
    price_currency,
    pay_currency,
    status,
    expires_at
  ) VALUES (
    p_user_id,
    v_order_id,
    p_price_amount,
    p_price_currency,
    p_pay_currency,
    'PENDING',
    v_expires_at
  );
  
  RETURN QUERY SELECT 
    v_order_id,
    NULL::TEXT,
    NULL::TEXT,
    NULL::DECIMAL,
    p_pay_currency,
    v_expires_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update payment status (called by webhook)
CREATE OR REPLACE FUNCTION update_crypto_payment_status(
  p_nowpayments_id BIGINT,
  p_status TEXT,
  p_pay_amount DECIMAL DEFAULT NULL,
  p_pay_currency TEXT DEFAULT NULL,
  p_pay_address TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_wallet_id UUID;
  v_user_id UUID;
  v_coin_amount BIGINT;
  v_new_balance BIGINT;
BEGIN
  -- Update payment record
  UPDATE crypto_payments
  SET 
    status = p_status,
    pay_amount = COALESCE(p_pay_amount, pay_amount),
    pay_currency = COALESCE(p_pay_currency, pay_currency),
    pay_address = COALESCE(p_pay_address, pay_address),
    metadata = COALESCE(p_metadata, metadata),
    updated_at = NOW()
  WHERE nowpayments_id = p_nowpayments_id
  RETURNING user_id INTO v_user_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- If payment completed, update wallet balance
  IF p_status = 'finished' THEN
    -- Calculate coin amount (1 USD = 100 coins, adjust as needed)
    SELECT price_amount * 100 INTO v_coin_amount
    FROM crypto_payments
    WHERE nowpayments_id = p_nowpayments_id;
    
    -- Get user's wallet
    SELECT id INTO v_wallet_id
    FROM wallets
    WHERE user_id = v_user_id;
    
    IF v_wallet_id IS NOT NULL THEN
      -- Update wallet balance
      UPDATE wallets
      SET 
        coin_balance = coin_balance + v_coin_amount,
        lifetime_earned = lifetime_earned + v_coin_amount,
        updated_at = NOW()
      WHERE id = v_wallet_id;
      
      -- Create transaction record
      INSERT INTO coin_transactions (
        wallet_id,
        type,
        amount,
        balance_after,
        description,
        metadata
      ) VALUES (
        v_wallet_id,
        'TOPUP',
        v_coin_amount,
        (SELECT coin_balance FROM wallets WHERE id = v_wallet_id),
        'Crypto top-up via NOWPayments',
        jsonb_build_object(
          'nowpayments_id', p_nowpayments_id,
          'payment_status', p_status
        )
      );
    END IF;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

ALTER TABLE crypto_payments ENABLE ROW LEVEL SECURITY;

-- Users can view their own payments
CREATE POLICY "Users can view own crypto payments"
  ON crypto_payments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own payments
CREATE POLICY "Users can create crypto payments"
  ON crypto_payments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Service role can update all payments (for webhooks)
CREATE POLICY "Service role can update all payments"
  ON crypto_payments
  FOR UPDATE
  USING (auth.jwt()->>'role' = 'service_role');

-- ===========================================
-- TRIGGERS
-- ===========================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_crypto_payments_updated_at
  BEFORE UPDATE ON crypto_payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ===========================================
-- COMMENTS
-- ===========================================

COMMENT ON TABLE crypto_payments IS 'Tracks cryptocurrency payments for wallet top-ups via NOWPayments';
COMMENT ON COLUMN crypto_payments.status IS 'PENDING: waiting for payment, COMPLETED: payment finished, FAILED: payment failed/expired';
COMMENT ON COLUMN crypto_payments.coin_amount IS 'Amount of coins to be credited (calculated as price_amount * 100)';