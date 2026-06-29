'use client';

import { useState, useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useWallet } from '@/lib/useWallet';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'preferences';

export default function SettingsPage() {
  const { user, logout } = useUserStore();
  const { wallet } = useWallet();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  // Profile fields
  const [fullName, setFullName] = useState(user?.displayName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState('');
  const [country, setCountry] = useState('NG');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Security fields
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Notification prefs
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [marketingPromos, setMarketingPromos] = useState(false);

  // Preferences
  const [language, setLanguage] = useState('en');
  const [currencyDisplay, setCurrencyDisplay] = useState<'usd' | 'coins'>('usd');

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Load profile from Supabase
  useEffect(() => {
    async function loadProfile() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: profile } = await supabase
        .from('users' as any)
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profile) {
        const p = profile as Record<string, any>;
        setFullName(p.full_name || p.displayName || '');
        setUsername(p.username || '');
        setEmail(authUser.email || '');
        setBio(p.bio || '');
        setCountry(p.country || 'NG');
      }
    }
    loadProfile();
  }, []);

  // Save profile changes
  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      // @ts-ignore - Supabase type inference doesn't work with custom tables
      const { error } = await supabase
        .from('users')
        // @ts-ignore
        .update({
          full_name: fullName,
          username: username,
          bio: bio,
          country: country,
        })
        .eq('id', authUser.id);

      if (error) throw error;
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err: any) {
      setSaveMessage(err.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Update password
  const handleUpdatePassword = async () => {
    if (newPassword !== confirmPassword) {
      setPasswordMessage('Passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordMessage('Password must be at least 8 characters');
      return;
    }

    setIsUpdatingPassword(true);
    setPasswordMessage('');
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setPasswordMessage('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordMessage(''), 3000);
    } catch (err: any) {
      setPasswordMessage(err.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    await supabase.auth.signOut();
    logout();
    router.push('/login');
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to permanently delete your account? This action cannot be undone.'
    );
    if (!confirmed) return;

    try {
      await supabase.auth.signOut();
      logout();
      router.push('/login');
    } catch (err) {
      console.error('Error deleting account:', err);
    }
  };

  const settingsTabs = [
    { id: 'profile' as SettingsTab, label: 'Profile', icon: 'account_circle' },
    { id: 'security' as SettingsTab, label: 'Security', icon: 'shield' },
    { id: 'notifications' as SettingsTab, label: 'Notifications', icon: 'notifications' },
    { id: 'preferences' as SettingsTab, label: 'Preferences', icon: 'settings' },
  ];

  return (
    <main className="flex-1 pt-8 pb-24 lg:pb-12 px-margin-mobile lg:px-margin-desktop max-w-container-max mx-auto w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

        {/* Settings Sidebar (Desktop Only) */}
        <aside className="hidden lg:block lg:col-span-3">
          <div className="bg-primary-container rounded-xl p-6 sticky top-28 border border-outline-variant/20 overflow-hidden relative">
            {/* Decorative element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-fixed/10 rounded-full blur-2xl" />

            {/* User card */}
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

            {/* Nav tabs */}
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

        {/* Mobile Tabs (Visible only on mobile/tablet) */}
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

        {/* Main Content Area */}
        <div className="lg:col-span-9 flex flex-col gap-gutter">

          {/* ===== PROFILE SECTION ===== */}
          {activeTab === 'profile' && (
            <section className="bg-primary-container rounded-xl p-6 lg:p-8 border border-outline-variant/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-fixed/5 rounded-full blur-2xl" />

              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4 relative z-10">
                <h3 className="font-h3 text-h3 text-white">Profile Information</h3>
              </div>

              <div className="flex flex-col md:flex-row gap-8 mb-8 relative z-10">
                {/* Avatar */}
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

                {/* Form fields */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-primary-container">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body-md text-body-md text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-primary-container">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body-md text-body-md text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="font-label-caps text-label-caps text-on-primary-container">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body-md text-body-md text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Bio and Country */}
              <div className="space-y-6 relative z-10">
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-primary-container">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body-md text-body-md text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-label-caps text-label-caps text-on-primary-container">Country / Region</label>
                  <div className="relative">
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body-md text-body-md text-white appearance-none focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors"
                    >
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

              {/* Save button */}
              <div className="mt-8 flex items-center justify-end gap-4 relative z-10">
                {saveMessage && (
                  <p className={`font-body-sm text-body-sm ${saveMessage.includes('success') ? 'text-success-verified' : 'text-error'}`}>
                    {saveMessage}
                  </p>
                )}
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  className="bg-[#d4af37] text-[#0d1b35] font-body-md text-body-md font-bold py-2.5 px-6 rounded-lg hover:bg-[#b8860b] transition-colors disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </section>
          )}

          {/* ===== SECURITY SECTION ===== */}
          {activeTab === 'security' && (
            <div className="flex flex-col gap-gutter">
              {/* Change Password */}
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
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Current Password"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 font-body-sm text-body-sm text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors"
                      />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="New Password"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 font-body-sm text-body-sm text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors"
                      />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm New Password"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 font-body-sm text-body-sm text-white placeholder-white/30 focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors"
                      />
                    </div>
                    {passwordMessage && (
                      <p className={`font-body-sm text-body-sm ${passwordMessage.includes('success') ? 'text-success-verified' : 'text-error'}`}>
                        {passwordMessage}
                      </p>
                    )}
                    <button
                      onClick={handleUpdatePassword}
                      disabled={isUpdatingPassword}
                      className="w-full bg-white/10 text-white font-body-sm text-body-sm py-2.5 rounded-lg hover:bg-white/20 border border-white/10 transition-colors mt-2 disabled:opacity-50"
                    >
                      {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </div>

                  {/* 2FA */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="flex items-start justify-between">
                      <div className="pr-4">
                        <h4 className="font-body-md text-body-md font-semibold text-white mb-1">Two-Factor Auth (2FA)</h4>
                        <p className="font-body-sm text-body-sm text-on-primary-container leading-relaxed">Add an extra layer of security to your account using an authenticator app.</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer mt-1 shrink-0">
                        <input
                          type="checkbox"
                          checked={twoFactorEnabled}
                          onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]" />
                      </label>
                    </div>
                  </div>

                  {/* Danger Zone */}
                  <div className="pt-6 border-t border-white/10">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <h4 className="font-body-md text-body-md font-semibold text-red-400 mb-1">Danger Zone</h4>
                      <p className="font-body-sm text-body-sm text-on-primary-container mb-3">Permanently delete your account and all associated data.</p>
                      <button
                        onClick={handleDeleteAccount}
                        className="text-red-400 text-body-sm font-body-sm font-semibold hover:text-red-300 transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {/* Account Status Card */}
              <section className="bg-gradient-to-br from-[#1a2b4c] to-[#0d1b35] rounded-xl p-6 border border-[#d4af37]/30 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-[#d4af37]/5 rounded-bl-full" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center border border-[#d4af37]/50">
                    <span className="material-symbols-outlined text-[#d4af37]">star</span>
                  </div>
                  <div>
                    <h4 className="font-body-md text-body-md font-bold text-white">
                      {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? 'Admin' : 'Member'}
                    </h4>
                    <p className="font-body-sm text-body-sm text-[#d4af37]">
                      KYC: {user?.kycStatus || 'NONE'}
                    </p>
                  </div>
                </div>
                <p className="font-body-sm text-body-sm text-on-primary-container mb-4">
                  You are currently enjoying access to all creative tools and earning features on CMPapp.
                </p>
                <div className="flex items-center gap-3 text-on-primary-container font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-secondary-fixed" style={{ fontSize: '18px' }}>toll</span>
                  <span className="text-secondary-fixed font-data-md text-data-md">{wallet?.balance?.toLocaleString() || '0'}</span>
                  <span>coins</span>
                </div>
              </section>
            </div>
          )}

          {/* ===== NOTIFICATIONS SECTION ===== */}
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
                {/* Email Updates */}
                <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                  <div>
                    <p className="font-body-md text-body-md text-white">Email Updates</p>
                    <p className="font-body-sm text-body-sm text-on-primary-container">Weekly digest and platform news</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={emailUpdates}
                      onChange={() => setEmailUpdates(!emailUpdates)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]" />
                  </label>
                </div>

                {/* Transaction Alerts */}
                <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                  <div>
                    <p className="font-body-md text-body-md text-white">Transaction Alerts</p>
                    <p className="font-body-sm text-body-sm text-on-primary-container">Instant push notifications for sales</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={transactionAlerts}
                      onChange={() => setTransactionAlerts(!transactionAlerts)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]" />
                  </label>
                </div>

                {/* Marketing Promos */}
                <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                  <div>
                    <p className="font-body-md text-body-md text-white">Marketing Promos</p>
                    <p className="font-body-sm text-body-sm text-on-primary-container">Special offers and partner deals</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={marketingPromos}
                      onChange={() => setMarketingPromos(!marketingPromos)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]" />
                  </label>
                </div>

                {/* Streak Reminders */}
                <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                  <div>
                    <p className="font-body-md text-body-md text-white">Streak Reminders</p>
                    <p className="font-body-sm text-body-sm text-on-primary-container">Daily reminders to maintain your streak</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]" />
                  </label>
                </div>

                {/* Referral Activity */}
                <div className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors">
                  <div>
                    <p className="font-body-md text-body-md text-white">Referral Activity</p>
                    <p className="font-body-sm text-body-sm text-on-primary-container">Notify when referrals sign up or earn</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]" />
                  </label>
                </div>
              </div>
            </section>
          )}

          {/* ===== PREFERENCES SECTION ===== */}
          {activeTab === 'preferences' && (
            <section className="bg-primary-container rounded-xl p-6 lg:p-8 border border-outline-variant/20 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-secondary-fixed/5 rounded-full blur-2xl" />

              <div className="mb-8 border-b border-white/10 pb-4 relative z-10">
                <h3 className="font-h3 text-h3 text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#d4af37]">tune</span>
                  System Preferences
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                <div className="space-y-6">
                  {/* Language */}
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-primary-container">Language</label>
                    <div className="relative">
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body-md text-body-md text-white appearance-none focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors"
                      >
                        <option value="en" className="bg-primary-container text-white">English</option>
                        <option value="es" className="bg-primary-container text-white">Español</option>
                        <option value="fr" className="bg-primary-container text-white">Français</option>
                        <option value="yo" className="bg-primary-container text-white">Yorùbá</option>
                        <option value="ig" className="bg-primary-container text-white">Igbo</option>
                        <option value="ha" className="bg-primary-container text-white">Hausa</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-on-primary-container">
                        <span className="material-symbols-outlined">expand_more</span>
                      </div>
                    </div>
                  </div>

                  {/* Currency Display */}
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-primary-container">Currency Display</label>
                    <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                      <button
                        onClick={() => setCurrencyDisplay('usd')}
                        className={`flex-1 py-2 text-center rounded-md font-body-sm text-body-sm font-semibold transition-colors ${
                          currencyDisplay === 'usd'
                            ? 'bg-[#d4af37]/20 text-[#d4af37]'
                            : 'text-on-primary-container hover:text-white'
                        }`}
                      >
                        USD ($)
                      </button>
                      <button
                        onClick={() => setCurrencyDisplay('coins')}
                        className={`flex-1 py-2 text-center rounded-md font-body-sm text-body-sm font-semibold transition-colors ${
                          currencyDisplay === 'coins'
                            ? 'bg-[#d4af37]/20 text-[#d4af37]'
                            : 'text-on-primary-container hover:text-white'
                        }`}
                      >
                        CMP Coins
                      </button>
                    </div>
                  </div>

                  {/* Timezone */}
                  <div className="space-y-2">
                    <label className="font-label-caps text-label-caps text-on-primary-container">Timezone</label>
                    <div className="relative">
                      <select
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 font-body-md text-body-md text-white appearance-none focus:border-[#d4af37] focus:outline-none focus:ring-1 focus:ring-[#d4af37] transition-colors"
                      >
                        <option value="WAT" className="bg-primary-container text-white">West Africa Time (WAT)</option>
                        <option value="GMT" className="bg-primary-container text-white">GMT / UTC</option>
                        <option value="EST" className="bg-primary-container text-white">Eastern (EST)</option>
                        <option value="PST" className="bg-primary-container text-white">Pacific (PST)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-on-primary-container">
                        <span className="material-symbols-outlined">expand_more</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Data & Privacy */}
                  <div className="space-y-4">
                    <h4 className="font-body-md text-body-md font-semibold text-white">Data & Privacy</h4>

                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <div>
                        <p className="font-body-md text-body-md text-white">Analytics Tracking</p>
                        <p className="font-body-sm text-body-sm text-on-primary-container">Help us improve with usage data</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors">
                      <div>
                        <p className="font-body-md text-body-md text-white">Profile Visibility</p>
                        <p className="font-body-sm text-body-sm text-on-primary-container">Allow others to see your profile</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer shrink-0">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-11 h-6 bg-white/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d4af37]" />
                      </label>
                    </div>
                  </div>

                  {/* Logout */}
                  <div className="pt-4 border-t border-white/10">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 bg-white/10 text-white font-body-md text-body-md font-semibold py-3 rounded-lg hover:bg-white/20 border border-white/10 transition-colors"
                    >
                      <span className="material-symbols-outlined">logout</span>
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

        </div>
      </div>
    </main>
  );
}
