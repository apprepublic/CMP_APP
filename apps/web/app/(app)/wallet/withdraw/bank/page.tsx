'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useWithdrawStore, SettlementAccount } from '@/stores/withdrawStore';
import { useUserStore } from '@/stores/userStore';

export default function WithdrawBankPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { amountCoins, selectedAccount, setSelectedAccount } = useWithdrawStore();
  const { user } = useUserStore();
  const [accounts, setAccounts] = useState<SettlementAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(searchParams?.get('add') === 'true');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [type, setType] = useState<'NGN_BANK' | 'CRYPTO'>('NGN_BANK');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [network, setNetwork] = useState('');

  useEffect(() => {
    if (amountCoins <= 0 && !showForm) {
      router.replace('/wallet/withdraw');
    }
    loadAccounts();
  }, [amountCoins, router]);

  const loadAccounts = async () => {
    const { data } = await supabase
      .from('settlement_accounts')
      .select('*')
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });
    setAccounts((data as SettlementAccount[]) || []);
    setLoading(false);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setType('NGN_BANK');
    setAccountName('');
    setAccountNumber('');
    setBankName('');
    setNetwork('');
  };

  const handleEdit = (acc: SettlementAccount) => {
    setEditingId(acc.id);
    setShowForm(true);
    setType(acc.type as 'NGN_BANK' | 'CRYPTO');
    setAccountName(acc.account_name);
    setAccountNumber(acc.account_number);
    setBankName(acc.bank_name || '');
    setNetwork(acc.network || '');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountName.trim() || !accountNumber.trim()) return;
    if (!user) return;

    const payload = {
      user_id: user.id,
      type,
      account_name: accountName.trim(),
      account_number: accountNumber.trim(),
      bank_name: type === 'NGN_BANK' ? bankName.trim() || null : null,
      network: type === 'CRYPTO' ? network.trim() || null : null,
    };

    if (editingId) {
      await supabase.from('settlement_accounts').update(payload).eq('id', editingId);
    } else {
      await supabase.from('settlement_accounts').insert(payload);
    }

    resetForm();
    loadAccounts();
  };

  const handleDelete = async (id: string) => {
    const acc = accounts.find(a => a.id === id);
    if (selectedAccount?.id === id) setSelectedAccount(null);
    await supabase.from('settlement_accounts').delete().eq('id', id);
    loadAccounts();
  };

  const handleSetDefault = async (id: string) => {
    await supabase.from('settlement_accounts').update({ is_default: true }).eq('id', id);
    await supabase.from('settlement_accounts').update({ is_default: false }).neq('id', id).eq('user_id', user?.id);
    loadAccounts();
  };

  const handleContinue = () => {
    if (selectedAccount) {
      router.push('/wallet/withdraw/confirm');
    }
  };

  const fiatAmount = amountCoins * 10.50;
  const processingFee = fiatAmount * 0.015;
  const finalAmount = fiatAmount - processingFee;

  return (
    <main className="flex-1 flex items-center justify-center pb-24 md:pb-12 px-margin-mobile min-h-[calc(100vh-80px)]">
      <div className="bg-surface-container-lowest rounded-xl p-6 md:p-8 w-full max-w-lg shadow-sm border border-outline-variant/30 mt-4">
        <div className="w-full flex justify-between items-center mb-8 text-on-surface-variant">
          <Link href="/wallet/withdraw" className="material-symbols-outlined hover:text-primary-container transition-colors">arrow_back</Link>
          <div className="font-label-caps text-label-caps text-on-primary-container tracking-wider">
            {showForm ? (editingId ? 'EDIT ACCOUNT' : 'ADD ACCOUNT') : 'STEP 2 OF 3'}
          </div>
          <button onClick={resetForm} className="material-symbols-outlined hover:text-primary transition-colors text-transparent pointer-events-none">close</button>
        </div>

        <div className="w-full flex items-center justify-between mb-8 px-2 relative">
          <div className="absolute left-[15%] right-[15%] top-1/2 h-[2px] bg-surface-variant -z-10 -translate-y-1/2"></div>
          <div className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2">
            <div className="w-8 h-8 rounded-full bg-success-verified text-on-primary flex items-center justify-center font-data-md text-data-md shadow-sm">
              <span className="material-symbols-outlined text-sm">check</span>
            </div>
            <span className="font-label-caps text-label-caps text-success-verified">Amount</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-data-md text-data-md shadow-sm ${showForm ? 'bg-surface-variant text-outline' : 'bg-primary text-on-primary border-[1.5px] border-[#B8860B]'}`}>
              {showForm ? <span className="material-symbols-outlined text-sm">add</span> : '2'}
            </div>
            <span className="font-label-caps text-label-caps text-on-surface">Account</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-surface-container-lowest px-2">
            <div className="w-8 h-8 rounded-full bg-surface-variant text-outline flex items-center justify-center font-data-md text-data-md">3</div>
            <span className="font-label-caps text-label-caps text-outline">Confirm</span>
          </div>
        </div>

        {showForm ? (
          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block font-label-caps text-label-caps text-on-surface mb-2">Account Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setType('NGN_BANK')}
                  className={`py-3 rounded-lg border-2 text-center transition-all ${type === 'NGN_BANK' ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-outline-variant text-on-surface-variant'}`}
                >
                  <span className="material-symbols-outlined text-lg block mx-auto">account_balance</span>
                  NGN Bank
                </button>
                <button
                  type="button"
                  onClick={() => setType('CRYPTO')}
                  className={`py-3 rounded-lg border-2 text-center transition-all ${type === 'CRYPTO' ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-outline-variant text-on-surface-variant'}`}
                >
                  <span className="material-symbols-outlined text-lg block mx-auto">currency_bitcoin</span>
                  Crypto Wallet
                </button>
              </div>
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface mb-2">Account Name</label>
              <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} placeholder="e.g. John Doe" className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary" />
            </div>

            <div>
              <label className="block font-label-caps text-label-caps text-on-surface mb-2">
                {type === 'NGN_BANK' ? 'Account Number' : 'Wallet Address'}
              </label>
              <input type="text" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} placeholder={type === 'NGN_BANK' ? '0123456789' : '0x... or bc1...'} className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary" />
            </div>

            {type === 'NGN_BANK' && (
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface mb-2">Bank Name</label>
                <input type="text" value={bankName} onChange={(e) => setBankName(e.target.value)} placeholder="e.g. GTBank" className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary" />
              </div>
            )}

            {type === 'CRYPTO' && (
              <div>
                <label className="block font-label-caps text-label-caps text-on-surface mb-2">Network</label>
                <input type="text" value={network} onChange={(e) => setNetwork(e.target.value)} placeholder="e.g. ERC20, TRC20, BEP20" className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-lg text-on-surface focus:outline-none focus:border-primary" />
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={resetForm} className="flex-1 py-3 rounded-lg border border-outline-variant text-on-surface font-semibold hover:bg-surface-variant/50 transition-colors">Cancel</button>
              <button type="submit" className="flex-[2] py-3 rounded-lg bg-primary text-on-primary font-semibold hover:bg-primary/90 transition-colors">
                {editingId ? 'Update Account' : 'Save Account'}
              </button>
            </div>
          </form>
        ) : (
          <>
            <h2 className="font-h3 text-h3 text-on-surface mb-6">Settlement Account</h2>

            {loading ? (
              <div className="flex justify-center py-8">
                <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
              </div>
            ) : accounts.length === 0 ? (
              <div className="text-center py-8 space-y-4">
                <span className="material-symbols-outlined text-4xl text-outline block">account_balance_wallet</span>
                <p className="text-on-surface-variant font-body-sm">No settlement accounts yet. Add one to withdraw.</p>
              </div>
            ) : (
              <div className="space-y-3 mb-8">
                {accounts.map((acc) => (
                  <div
                    key={acc.id}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAccount?.id === acc.id ? 'border-[#B8860B] bg-primary/5' : 'border-outline-variant/50 hover:border-outline'}`}
                    onClick={() => setSelectedAccount(acc)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${acc.type === 'NGN_BANK' ? 'bg-[#E5F3FF] text-primary' : 'bg-[#FFF3E0] text-secondary'}`}>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                          {acc.type === 'NGN_BANK' ? 'account_balance' : 'currency_bitcoin'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-body-md text-body-md font-semibold text-on-surface truncate">{acc.account_name}</div>
                        <div className="font-data-md text-data-md text-on-surface-variant">
                          {acc.type === 'NGN_BANK' ? `${acc.bank_name || 'Bank'} • ${acc.account_number}` : `${acc.network || 'Crypto'} • ${acc.account_number.slice(0, 8)}...`}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {acc.is_default && <span className="text-label-caps text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">DEFAULT</span>}
                        <button onClick={(e) => { e.stopPropagation(); handleEdit(acc); }} className="text-outline hover:text-primary p-1">
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(acc.id); }} className="text-outline hover:text-error-alert p-1">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </div>
                    {!acc.is_default && (
                      <button onClick={(e) => { e.stopPropagation(); handleSetDefault(acc.id); }} className="text-label-caps text-[11px] text-outline hover:text-primary mt-2 underline underline-offset-2">
                        Set as default
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary transition-all font-semibold mb-8"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Add Settlement Account
            </button>

            {selectedAccount && (
              <div className="border-t border-outline-variant/30 pt-6 w-full">
                <h3 className="font-body-sm text-body-sm font-semibold text-on-surface-variant mb-4 uppercase tracking-wider">Withdrawal Summary</h3>
                <div className="space-y-3 bg-surface-container-low p-4 rounded-lg border border-outline-variant/20">
                  <div className="flex justify-between items-center">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Amount</span>
                    <div className="flex items-center gap-2">
                      <img src="/coin.png" alt="" className="w-4 h-4 object-contain" />
                      <span className="font-data-md text-data-md text-on-surface">{amountCoins.toLocaleString()} CMP</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Exchange Rate</span>
                    <span className="font-data-md text-data-md text-on-surface">1 CMP = ₦10.50</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Processing Fee (1.5%)</span>
                    <span className="font-data-md text-data-md text-error-alert">- ₦{processingFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-dashed border-outline-variant/50 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="font-body-md text-body-md font-semibold text-on-surface">You will receive</span>
                      <span className="font-data-lg text-data-lg text-success-verified">₦{finalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex gap-4">
              <Link href="/wallet/withdraw" className="flex-1 py-3 px-4 rounded-lg border border-outline-variant text-on-surface font-body-md text-body-md font-semibold hover:bg-surface-variant/50 transition-colors text-center">Back</Link>
              <button
                onClick={handleContinue}
                disabled={!selectedAccount}
                className="flex-[2] py-3 px-4 rounded-lg bg-primary text-on-primary font-body-md text-body-md font-semibold hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>

            <div className="flex items-start gap-3 text-on-surface-variant opacity-80 px-4 mt-8 w-full">
              <span className="material-symbols-outlined text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
              <p className="font-body-sm text-body-sm">Funds are withheld immediately upon request and held until the withdrawal is processed or rejected.</p>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
