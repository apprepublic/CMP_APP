import { create } from 'zustand';

interface WithdrawState {
  amountCoins: number;
  selectedBank: string | null;
  transactionId: string | null;
  setAmountCoins: (coins: number) => void;
  setSelectedBank: (bankId: string) => void;
  setTransactionId: (txId: string) => void;
  reset: () => void;
}

export const useWithdrawStore = create<WithdrawState>((set) => ({
  amountCoins: 0,
  selectedBank: null,
  transactionId: null,
  setAmountCoins: (coins) => set({ amountCoins: coins }),
  setSelectedBank: (bankId) => set({ selectedBank: bankId }),
  setTransactionId: (txId) => set({ transactionId: txId }),
  reset: () => set({ amountCoins: 0, selectedBank: null, transactionId: null }),
}));
