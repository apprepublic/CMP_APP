'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useWallet } from '@/lib/useWallet';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type SettingsTab = 'profile' | 'security' | 'notifications';

const SETTINGS_DEFAULTS = {
  transactionAlerts: true,
  marketingPromos: false,
};

function parseSettings(settings: any) {
  if (!settings || typeof settings !== 'object') return SETTINGS_DEFAULTS;
  return {
    transactionAlerts: typeof settings.transactionAlerts === 'boolean' ? settings.transactionAlerts : SETTINGS_DEFAULTS.transactionAlerts,
    marketingPromos: typeof settings.marketingPromos === 'boolean' ? settings.marketingPromos : SETTINGS_DEFAULTS.marketingPromos,
  };
}

export default function SettingsPage() {
  const { user, logout } = useUserStore();
  const { wallet } = useWallet();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // Profile fields
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('NG');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveMessageType, setSaveMessageType] = useState<'success' | 'error'>('success');

  // Security fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordMessageType, setPasswordMessageType] = useState<'success' | 'error'>('success');

  // Notification prefs
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [marketingPromos, setMarketingPromos] = useState(false);
  const [isSavingNotifications, setIsSavingNotifications] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  const showMessage = (setter: (m: string) => void, msg: string, duration = 3000) => {
    setter(msg);
    setTimeout(() => setter(''), duration);
  };

  // Load profile from Supabase
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser || cancelled) { setIsLoadingProfile(false); return; }

      const { data: profile } = await supabase
        .from('users' as any)
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile && !cancelled) {
        const p = profile as Record<string, any>;
        setFullName(p.full_name || '');
        setUsername(p.username || '');
        setBio(p.bio || '');
        setCountry(p.country || 'NG');

        const s = parseSettings(p.settings);
        setTransactionAlerts(s.transactionAlerts ?? true);
        setMarketingPromos(s.marketingPromos ?? false);
      }
      setIsLoadingProfile(false);
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const saveSettingsField = async (patch: Record<string, any>) => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) throw new Error('Not authenticated');

    // Merge with existing settings
    const { data: existing } = await supabase
      .from('users' as any)
      .select('settings')
      .eq('id', authUser.id)
      .single();

    const current = parseSettings((existing as any)?.settings);
    const merged = { ...current, ...patch };

    const { error } = await supabase
      .from('users' as any)
      .update({ settings: merged } as any)
      .eq('id', authUser.id);

    if (error) throw error;
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (!fullName.trim()) {
      setSaveMessageType('error');
      setSaveMessage('Full name is required');
      return;
    }

    setIsSaving(true);
    setSaveMessage('');
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      // Check username uniqueness if changed
      if (username.trim()) {
        const { data: existing } = await supabase
          .from('users' as any)
          .select('id')
          .eq('username', username.trim())
          .neq('id', authUser.id)
          .maybeSingle();

        if (existing) {
          throw new Error('Username is already taken. Please choose another one.');
        }
      }

      const { error } = await supabase
        .from('users' as any)
        .update({
          full_name: fullName.trim(),
          username: username.trim() || null,
          bio: bio.trim() || null,
          country,
        } as any)
        .eq('id', authUser.id);

      if (error) throw error;
      setSaveMessageType('success');
      setSaveMessage('Profile updated successfully');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err: any) {
      const msg = err?.message || '';
      setSaveMessageType('error');
      setSaveMessage(
        msg.includes('unique') || msg.includes('already taken')
          ? 'Username is already taken. Please choose another one.'
          : msg || 'Failed to save changes'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    if (!currentPassword) {
      setPasswordMessageType('error');
      setPasswordMessage('Please enter your current password');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessageType('error');
      setPasswordMessage('New password must be at least 8 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessageType('error');
      setPasswordMessage('New passwords do not match');
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordMessage('');
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser?.email) throw new Error('Not authenticated');

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: authUser.email,
        password: currentPassword,
      });
      if (signInError) throw new Error('Current password is incorrect');

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setPasswordMessageType('success');
      setPasswordMessage('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (err: any) {
      const msg = err?.message || '';
      setPasswordMessageType('error');
      setPasswordMessage(
        msg.includes('incorrect') || msg.includes('Invalid') ? 'Current password is incorrect' :
        msg.includes('same') ? 'New password must be different from your current password' :
        msg.includes('session') ? 'Session expired. Please sign out and sign in again.' :
        msg || 'Failed to update password'
      );
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Save notification prefs
  const handleSaveNotifications = async () => {
    setIsSavingNotifications(true);
    setNotificationMessage('');
    try {
      await saveSettingsField({ transactionAlerts, marketingPromos });
      showMessage(setNotificationMessage, 'Notification preferences saved');
    } catch (err: any) {
      showMessage(setNotificationMessage, err?.message || 'Failed to save');
    } finally {
      setIsSavingNotifications(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.push('/login');
  };

  // Delete account
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete your account and all associated data? This cannot be undone.'
    );
    if (!confirmed) return;

    try {
      const { error } = await supabase.functions.invoke('delete-user');
      if (error) throw error;
      await supabase.auth.signOut();
      logout();
      router.push('/login');
    } catch (err: any) {
      const msg = err?.message || '';
      alert(msg.includes('function') ? 'Account deletion is not available yet. Please contact support.' : msg || 'Failed to delete account');
    }
  };

  const settingsTabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: 'account_circle' },
    { id: 'security' as SettingsTab, label: 'Security', icon: 'shield' },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: 'notifications' },
  ];

  if (isLoadingProfile) {
    return (
      <main className="flex-1 pt-8 pb-24 lg:pb-12 px-margin-mobile lg:px-margin-desktop max-w-container-max mx-auto w-full">
        <div className="animate-pulse space-y-6">
          <div className="h-12 w-48 bg-surface-variant rounded-lg" />
          <div className="h-96 bg-surface-variant rounded-xl" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-8 pb-24 lg:pb-12 px-margin-mobile lg:px-margin-desktop max-w-container-max mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

        {/* Settings Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="bg-primary-container rounded-xl p-6 sticky top-28 border border-outline-variant/20 overflow-hidden relative">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-fixed/10 rounded-full blur-2xl" />

            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className="w-12 h-12 rounded-full bg-secondary-fixed/20 flex items-center justify-center border-2 border-secondary-fixed/50 text-secondary-fixed font-bold text-lg">
                {(() => {
                    const name = user?.displayName || 'User';
                    const parts = name.trim().split(/\s+/);
                    return parts.length >= 2
                      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
                      : name[0].toUpperCase();
                  })()}
              </div>
              <div>
                <h3 className="font-body-md text-body-md font-bold text-white">{user?.displayName || 'User'}</h3>
                <p className="font-body-sm text-body-sm text-on-primary-container">@{user?.username || 'user'}</p>
              </div>
            </div>

            <nav className="flex flex-col gap-2 relative z-10">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-4 px-4 py-3 rounded-lg font-label-caps text-label-caps transition-all duration-200 text-left w-full ${
                    activeTab === tab.id
                      ? 'text-secondary-fixed font-bold border-r-2 border-secondary-fixed bg-navy-glass'
                      : 'text-on-primary-container opacity-80 hover:bg-navy-glass hover:text-secondary-fixed'
                  }`}
                >
                  <span className="material-symbols-outlined">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Tabs */}
        <div className="lg:hidden flex overflow-x-auto gap-2 pb-4 mb-4 scrollbar-hide">
          {settingsTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap font-label-caps text-label-caps transition-colors ${
                activeTab === tab.id
                  ? 'bg-secondary-container text-on-secondary-container font-bold'
                  : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 flex flex-col gap-gutter">

          {/* ===== PROFILE ===== */}
          {activeTab === 'profile' && (
            <section className="bg-primary-container rounded-xl p-6 lg:p-8 border border-outline-variant/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-fixed/5 rounded-full blur-2xl" />

              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4 relative z-10">
                <h3 className="font-h3 text-h3 text-white">Profile Information</h3>
              </div>

              <div className="flex flex-col md:flex-row gap-8 mb-8 relative z-10">
                <div className="flex flex-col items-center gap-4 w-full md:w-auto">
                  <div className="relative group cursor-pointer">
                    <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center border-2 border-secondary-fixed/50 group-hover:border-secondary-fixed transition-colors text-secondary-fixed">
                      <span className="material-symbols-outlined" style={{ fontSize: '48px' }}>account_circle</span>
                    </div>
                    <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-white">photo_camera</span>
                    </div>
                  </div>
                  <button className="font-body-sm text-body-sm text-on-primary-container hover:text-white transition-colors">Change Picture</button>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-primary-container">Full Name</label>
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body-md text-body-md text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-primary-container">Username</label>
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body-md text-body-md text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="font-label-caps text-label-caps text-on-primary-container">Email Address</label>
                    <input type="email" value={user?.email || ''} disabled
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body-md text-body-md text-white/50 cursor-not-allowed" />
                    <p className="font-body-sm text-body-sm text-on-primary-container text-xs">Email cannot be changed from settings.</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-primary-container">Bio</label>
                  <textarea value={bio} onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..." rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body-md text-body-md text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors resize-none" />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-primary-container">Country / Region</label>
                  <div className="relative">
                    <select value={country} onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body-md text-body-md text-white appearance-none focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors">
                      <option value="NG" className="bg-primary-container text-white">Nigeria</option>
                      <option value="US" className="bg-primary-container text-white">United States</option>
                      <option value="UK" className="bg-primary-container text-white">United Kingdom</option>
                      <option value="CA" className="bg-primary-container text-white">Canada</option>
                      <option value="GH" className="bg-primary-container text-white">Ghana</option>
                      <option value="KE" className="bg-primary-container text-white">Kenya</option>
                      <option value="OTHER" className="bg-primary-container text-white">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-on-primary-container">
                      <span className="material-symbols-outlined">expand_more</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-4 relative z-10">
                {saveMessage && (
                  <p className={`font-body-sm text-body-sm ${saveMessageType === 'success' ? 'text-success-verified' : 'text-error'}`}>
                    {saveMessage}
                  </p>
                )}
                <button onClick={handleSaveProfile} disabled={isSaving}
                  className="bg-[#d4af37] text-[#0d1b35] font-body-md text-body-md font-bold py-2.5 px-6 rounded-lg hover:bg-[#b8860b] transition-colors disabled:opacity-50">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </section>
          )}

          {/* ===== SECURITY ===== */}
          {activeTab === 'security' && (
            <div className="flex flex-col gap-gutter">
              <section className="bg-primary-container rounded-xl p-6 lg:p-8 border border-outline-variant/20 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#d4af37]/10 rounded-full blur-2xl" />

                <div className="mb-6 border-b border-white/10 pb-4 relative z-10">
                  <h3 className="font-h3 text-h3 text-white flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#d4af37]">lock</span>
                    Security
                  </h3>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="space-y-4">
                    <h4 className="font-body-md text-body-md font-semibold text-white">Change Password</h4>
                    <div className="space-y-3">
                      <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current Password"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 font-body-sm text-body-sm text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors" />
                      <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 font-body-sm text-body-sm text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors" />
                      <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 font-body-sm text-body-sm text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors" />
                    </div>
                    {passwordMessage && (
                      <p className={`font-body-sm text-body-sm ${passwordMessageType === 'success' ? 'text-success-verified' : 'text-error'}`}>
                        {passwordMessage}
                      </p>
                    )}
                    <button onClick={handleUpdatePassword} disabled={isUpdatingPassword}
                      className="w-full bg-white/10 text-white font-body-sm text-body-sm py-2.5 rounded-lg hover:bg-white/20 border border-white/10 transition-colors mt-2 disabled:opacity-50">
                      {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <h4 className="font-body-md text-body-md font-semibold text-red-400 mb-1">Danger Zone</h4>
                      <p className="font-body-sm text-body-sm text-on-primary-container mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
                      <button onClick={handleDeleteAccount}
                        className="text-red-400 text-body-sm font-body-sm font-semibold hover:text-red-300 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          )}

          {/* ===== NOTIFICATIONS ===== */}
          {activeTab === 'notifications' && (
            <section className="bg-primary-container rounded-xl p-6 lg:p-8 border border-outline-variant/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-fixed/5 rounded-full blur-2xl" />

              <div className="mb-6 border-b border-white/10 pb-4 relative z-10">
                <h3 className="font-h3 text-h3 text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#d4af37]">notifications</span>
                  Notification Preferences
                </h3>
              </div>

              <div className="space-y-4 relative z-10">
                <ToggleRow label="Transaction Alerts" desc="Email notifications for deposits and withdrawals" checked={transactionAlerts} onChange={setTransactionAlerts} />
                <ToggleRow label="Marketing Promos" desc="Special offers and partner deals" checked={marketingPromos} onChange={setMarketingPromos} />
              </div>

              {notificationMessage && (
                <p className={`font-body-sm text-body-sm mt-4 relative z-10 ${notificationMessage.includes('saved') ? 'text-success-verified' : 'text-error'}`}>
                  {notificationMessage}
                </p>
              )}
              <button onClick={handleSaveNotifications} disabled={isSavingNotifications}
                className="mt-4 bg-[#d4af37] text-[#0d1b35] font-body-md text-body-md font-bold py-2.5 px-6 rounded-lg hover:bg-[#b8860b] transition-colors disabled:opacity-50 relative z-10">
                {isSavingNotifications ? 'Saving...' : 'Save Preferences'}
              </button>
            </section>
          )}

          {/* ===== LOGOUT ===== */}
          <div className="flex justify-center pt-4">
            <button onClick={handleLogout}
              className="flex items-center justify-center gap-2 bg-white/10 text-white font-body-md text-body-md font-semibold py-3 px-8 rounded-lg hover:bg-white/20 border border-white/10 transition-colors">
              <span className="material-symbols-outlined">logout</span>
              Sign Out
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}

function ToggleRow({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
      <div>
        <p className="font-body-md text-body-md text-white">{label}</p>
        <p className="font-body-sm text-body-sm text-on-primary-container">{desc}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer shrink-0">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]" />
      </label>
    </div>
  );
}
