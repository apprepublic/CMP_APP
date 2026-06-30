import { create } from 'zustand';

export interface SettlementAccount {
  id: string;
  user_id: string;
  type: 'NGN_BANK' | 'CRYPTO';
  account_name: string;
  account_number: string;
  bank_name: string | null;
  network: string | null;
  is_default: boolean;
}

interface WithdrawState {
  amountCoins: number;
  selectedAccount: SettlementAccount | null;
  transactionId: string | null;
  setAmountCoins: (coins: number) => void;
  setSelectedAccount: (account: SettlementAccount | null) => void;
  setTransactionId: (txId: string) => void;
  reset: () => void;
}

export const useWithdrawStore = create<WithdrawState>((set) => ({
  amountCoins: 0,
  selectedAccount: null,
  transactionId: null,
  setAmountCoins: (coins) => set({ amountCoins: coins }),
  setSelectedAccount: (account) => set({ selectedAccount: account }),
  setTransactionId: (txId) => set({ transactionId: txId }),
  reset: () => set({ amountCoins: 0, selectedAccount: null, transactionId: null }),
}));
