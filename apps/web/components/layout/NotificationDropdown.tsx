'use client';

import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '@/lib/hooks';
import { markNotificationRead, markAllNotificationsRead, AppNotification } from '@/lib/queries';
import { useUserStore } from '@/stores/userStore';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useUserStore();
  const queryClient = useQueryClient();
  const { data: notifications = [], isLoading } = useNotifications(user?.id || '');

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

  // Real-time subscription for notifications
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel('notifications_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` },
        () => {
          queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const handleMarkAsRead = async (id: string) => {
    await markNotificationRead(id);
    queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
  };

  const handleMarkAllRead = async () => {
    if (user?.id) {
      await markAllNotificationsRead(user.id);
      queryClient.invalidateQueries({ queryKey: ['notifications', user.id] });
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'TRANSACTION': return 'payments';
      case 'SOCIAL': return 'group';
      case 'SYSTEM': return 'info';
      default: return 'notifications';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative text-on-primary lg:text-on-primary-container hover:text-secondary transition-colors scale-95 active:duration-100 flex items-center justify-center p-2"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-primary lg:border-white animate-pulse"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/30 overflow-hidden z-50 transform origin-top-right animate-in fade-in zoom-in-95 duration-200">
          <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
            <h3 className="font-h3 text-h3 text-primary-container">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={handleMarkAllRead}
                className="text-xs font-bold text-secondary hover:text-secondary-fixed-dim transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-6 text-center text-on-surface-variant text-sm">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center">
                <span className="material-symbols-outlined text-4xl text-outline-variant mb-2">notifications_paused</span>
                <p className="text-on-surface-variant font-body-sm text-body-sm">You have no notifications.</p>
              </div>
            ) : (
              <div className="divide-y divide-outline-variant/20">
                {notifications.map((n: AppNotification) => (
                  <div 
                    key={n.id} 
                    className={`p-4 flex gap-4 transition-colors hover:bg-surface-alt cursor-pointer ${!n.is_read ? 'bg-primary-fixed/10' : ''}`}
                    onClick={() => { if (!n.is_read) handleMarkAsRead(n.id); }}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${!n.is_read ? 'bg-secondary-container text-on-secondary-fixed' : 'bg-surface-variant text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {getIconForType(n.type)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${!n.is_read ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>
                        {n.title}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-outline mt-2 font-data-md uppercase tracking-wider">
                        {new Date(n.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {!n.is_read && (
                      <div className="w-2 h-2 rounded-full bg-secondary self-center shrink-0"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
