// CMPapp Utility Functions

// ===========================================
// COIN CONVERSION
// ===========================================

export const COIN_TO_NAIRA_RATE = 100; // 100 coins = ₦1
export const NAIRA_TO_COIN_RATE = 90; // ₦100 = 9000 coins (10% fee)
export const MIN_WITHDRAWAL_COINS = 100000; // ₦1,000 minimum
export const WITHDRAWAL_FEE_PERCENT = 1.5;

/**
 * Convert coins to Naira
 */
export function coinsToNaira(coins: number | bigint): number {
  const coinNum = typeof coins === 'bigint' ? Number(coins) : coins;
  return coinNum / COIN_TO_NAIRA_RATE;
}

/**
 * Convert Naira to coins (with 10% platform fee)
 */
export function nairaToCoins(naira: number): number {
  return Math.floor(naira * NAIRA_TO_COIN_RATE);
}

/**
 * Calculate withdrawal fee
 */
export function calculateWithdrawalFee(coins: number | bigint): number {
  const coinNum = typeof coins === 'bigint' ? Number(coins) : coins;
  return Math.floor(coinNum * (WITHDRAWAL_FEE_PERCENT / 100));
}

/**
 * Calculate coins after withdrawal fee
 */
export function coinsAfterWithdrawalFee(coins: number | bigint): number {
  const coinNum = typeof coins === 'bigint' ? Number(coins) : coins;
  return coinNum - calculateWithdrawalFee(coins);
}

// ===========================================
// REFERRAL COMMISSION RATES
// ===========================================

export const REFERRAL_LEVELS = {
  L1: { level: 1, rate: 0.20 }, // 20%
  L2: { level: 2, rate: 0.10 }, // 10%
  L3: { level: 3, rate: 0.05 }, // 5%
} as const;

/**
 * Calculate referral commission
 */
export function calculateReferralCommission(earnings: number, level: 1 | 2 | 3): number {
  const rate = REFERRAL_LEVELS[`L${level}` as keyof typeof REFERRAL_LEVELS].rate;
  return Math.floor(earnings * rate);
}

// ===========================================
// TASK REWARDS
// ===========================================

export const TASK_REWARDS = {
  READ_ARTICLE: 50,
  SHARE_AD: 100,
  REWARDED_VIDEO: 30,
  SURVEY: 200,
  APP_DOWNLOAD: 500,
  VOTE: 20,
  MUSIC_STREAM: 1,
  MUSIC_DOWNLOAD: 3,
  SIGNUP_BONUS: 500,
  REFERRAL_SIGNUP: 1000,
  STREAK_7_DAY: 2000,
  STREAK_30_DAY: 10000,
} as const;

// ===========================================
// VTU RATES
// ===========================================

export const VTU_RATES = {
  AIRTIME_100: 1000,
  DATA_500MB: 2500,
  ELECTRICITY_500: 5000,
  PRODUCT_LISTING_BOOST: 3000,
  STREAK_FREEZE: 500,
  SONG_PROMOTION: 5000,
  BUSINESS_FEATURED: 8000,
  PREMIUM_TASK_UNLOCK: 200,
} as const;

// ===========================================
// STREAK MILESTONES
// ===========================================

export const STREAK_MILESTONES = {
  7: 2000,
  14: 5000,
  21: 7500,
  30: 10000,
  60: 20000,
  90: 35000,
  180: 75000,
  365: 150000,
} as const;

// ===========================================
// VALIDATION HELPERS
// ===========================================

/**
 * Validate Nigerian phone number
 */
export function isValidNigerianPhone(phone: string): boolean {
  // Format: +234xxxxxxxxxx or 0xxxxxxxxxx
  const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
  return phoneRegex.test(phone);
}

/**
 * Normalize Nigerian phone number
 */
export function normalizePhoneNumber(phone: string): string {
  let normalized = phone.replace(/[\s\-\(\)]/g, '');

  if (normalized.startsWith('+234')) {
    normalized = normalized.substring(4);
  }

  if (normalized.startsWith('0')) {
    normalized = normalized.substring(1);
  }

  return `+234${normalized}`;
}

/**
 * Validate BVN (Bank Verification Number)
 */
export function isValidBVN(bvn: string): boolean {
  return /^\d{11}$/.test(bvn);
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate username (alphanumeric + underscore, 3-20 chars)
 */
export function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

// ===========================================
// DATE HELPERS
// ===========================================

/**
 * Check if date is today
 */
export function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if date is yesterday
 */
export function isYesterday(date: Date): boolean {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
}

/**
 * Get start of day
 */
export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * Get days between dates
 */
export function daysBetween(start: Date, end: Date): number {
  const startTime = startOfDay(start).getTime();
  const endTime = startOfDay(end).getTime();
  return Math.floor((endTime - startTime) / (1000 * 60 * 60 * 24));
}

// ===========================================
// STRING HELPERS
// ===========================================

/**
 * Generate referral code
 */
export function generateReferralCode(length: number = 8): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate OTP
 */
export function generateOTP(length: number = 6): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString();
  }
  return result;
}

/**
 * Mask phone number for display
 */
export function maskPhone(phone: string): string {
  if (phone.length < 10) return phone;
  return `${phone.substring(0, 4)}****${phone.substring(phone.length - 4)}`;
}

/**
 * Mask email for display
 */
export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  if (local.length <= 2) return email;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

// ===========================================
// PAGINATION
// ===========================================

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Create paginated result
 */
export function paginate<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    total,
    page,
    limit,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}