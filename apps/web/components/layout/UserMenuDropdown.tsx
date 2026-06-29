'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';

export default function UserMenuDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, setUser } = useUserStore();
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleLogout = () => {
    setUser(null);
    router.push('/login');
  };

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';
  const nameParts = displayName.trim().split(/\s+/);
  const initials = nameParts.length >= 2
    ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
    : displayName.substring(0, 2).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-fixed font-bold text-sm border-2 border-transparent hover:border-secondary transition-all active:scale-95"
      >
        {initials}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 overflow-hidden z-50 transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-outline-variant/30 bg-surface-container-low">
            <p className="font-bold text-on-surface truncate">{displayName}</p>
            <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
            <div className="mt-2 inline-flex items-center gap-1 bg-surface-variant px-2 py-0.5 rounded text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
              {user?.role || 'USER'}
            </div>
          </div>
          
          <div className="py-2">
            <Link 
              href="/settings" 
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface hover:text-primary-container transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              Settings
            </Link>
            <Link 
              href="/wallet" 
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface-variant hover:bg-surface hover:text-primary-container transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
              Wallet
            </Link>
          </div>
          
          <div className="border-t border-outline-variant/30 py-2">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error hover:bg-error-container/50 transition-colors text-left"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
