// CMPapp Shared Types
// Based on Document 3: Data Schema & State Map

// ===========================================
// ENUMS
// ===========================================

export enum UserRole {
  USER = 'USER',
  ARTIST = 'ARTIST',
  BUSINESS = 'BUSINESS',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum KycStatus {
  NONE = 'NONE',
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum CoinTransactionType {
  TASK_EARN = 'TASK_EARN',
  READ_ARTICLE = 'READ_ARTICLE',
  WATCH_AD = 'WATCH_AD',
  SHARE_TASK = 'SHARE_TASK',
  SURVEY = 'SURVEY',
  APP_DOWNLOAD = 'APP_DOWNLOAD',
  VOTE = 'VOTE',
  MUSIC_STREAM = 'MUSIC_STREAM',
  MUSIC_DOWNLOAD = 'MUSIC_DOWNLOAD',
  STREAK_BONUS = 'STREAK_BONUS',
  REFERRAL_SIGNUP = 'REFERRAL_SIGNUP',
  REFERRAL_EARN = 'REFERRAL_EARN',
  TOPUP = 'TOPUP',
  WITHDRAWAL = 'WITHDRAWAL',
  AIRTIME_PURCHASE = 'AIRTIME_PURCHASE',
  DATA_PURCHASE = 'DATA_PURCHASE',
  ELECTRICITY_PURCHASE = 'ELECTRICITY_PURCHASE',
  PRODUCT_LISTING_BOOST = 'PRODUCT_LISTING_BOOST',
  SONG_PROMOTION = 'SONG_PROMOTION',
  BUSINESS_FEATURED = 'BUSINESS_FEATURED',
  PREMIUM_TASK_UNLOCK = 'PREMIUM_TASK_UNLOCK',
  STREAK_FREEZE = 'STREAK_FREEZE',
}

export enum TaskType {
  READ_ARTICLE = 'READ_ARTICLE',
  WATCH_VIDEO = 'WATCH_VIDEO',
  SHARE_SOCIAL = 'SHARE_SOCIAL',
  COMPLETE_SURVEY = 'COMPLETE_SURVEY',
  APP_DOWNLOAD = 'APP_DOWNLOAD',
  VOTE = 'VOTE',
}

export enum WithdrawalStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  REJECTED = 'REJECTED',
  FAILED = 'FAILED',
}

export enum WithdrawalMethod {
  BANK = 'BANK',
  CRYPTO = 'CRYPTO',
}

export enum Currency {
  NGN = 'NGN',
  USDT = 'USDT',
  BTC = 'BTC',
}

export enum ContestType {
  ARTIST = 'ARTIST',
  BUSINESS = 'BUSINESS',
}

export enum ContestEntryStatus {
  ACTIVE = 'ACTIVE',
  ELIMINATED = 'ELIMINATED',
  WINNER = 'WINNER',
}

// ===========================================
// USER & AUTH
// ===========================================

export interface User {
  id: string;
  email: string | null;
  phone: string;
  passwordHash: string | null;
  displayName: string;
  username: string;
  role: UserRole;
  kycStatus: KycStatus;
  referredById: string | null;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  phoneVerified: boolean;
  googleId: string | null;
}

export interface UserProfile extends User {
  wallet: Wallet;
  artistProfile: ArtistProfile | null;
  businessProfile: BusinessProfile | null;
  streakRecord: StreakRecord | null;
}

export interface KycRecord {
  id: string;
  userId: string;
  bvn: string | null;
  idNumber: string | null;
  idType: string | null;
  selfieUrl: string | null;
  idImageUrl: string | null;
  status: KycStatus;
  reviewedById: string | null;
  reviewedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ===========================================
// WALLET & TRANSACTIONS
// ===========================================

export interface Wallet {
  id: string;
  userId: string;
  coinBalance: bigint;
  pendingCoins: bigint;
  lifetimeEarned: bigint;
  lifetimeSpent: bigint;
  createdAt: Date;
  updatedAt: Date;
}

export interface CoinTransaction {
  id: string;
  walletId: string;
  type: CoinTransactionType;
  amount: bigint;
  balanceAfter: bigint;
  description: string;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

export interface WithdrawalRequest {
  id: string;
  walletId: string;
  coinsAmount: bigint;
  fiatAmount: number;
  currency: Currency;
  method: WithdrawalMethod;
  bankAccount: string | null;
  cryptoAddress: string | null;
  status: WithdrawalStatus;
  rejectionReason: string | null;
  processedById: string | null;
  processedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ===========================================
// TASKS & EARNINGS
// ===========================================

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  coinReward: number;
  dailyLimit: number;
  requiresAdGate: boolean;
  linkedArticleId: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskCompletion {
  id: string;
  userId: string;
  taskId: string;
  coinsEarned: number;
  proofData: Record<string, unknown> | null;
  adWatched: boolean;
  createdAt: Date;
}

export interface StreakRecord {
  id: string;
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  freezesOwned: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Article {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  coverImageUrl: string | null;
  authorId: string;
  category: string;
  tags: string[];
  readTimeMinutes: number;
  coinReward: number;
  isPublished: boolean;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// ===========================================
// MUSIC / ARTIST
// ===========================================

export interface ArtistProfile {
  id: string;
  userId: string;
  stageName: string;
  bio: string | null;
  genre: string | null;
  coverImageUrl: string | null;
  avatarUrl: string | null;
  followerCount: number;
  totalStreams: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Song {
  id: string;
  artistId: string;
  title: string;
  description: string | null;
  audioUrl: string;
  coverUrl: string | null;
  durationSeconds: number;
  genre: string | null;
  playCount: number;
  downloadCount: number;
  isPublished: boolean;
  isFeatured: boolean;
  featuredAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface SongStream {
  id: string;
  songId: string;
  userId: string | null;
  ipAddress: string | null;
  streamDuration: number;
  createdAt: Date;
}

// ===========================================
// MARKETPLACE / BUSINESS
// ===========================================

export interface BusinessProfile {
  id: string;
  userId: string;
  businessName: string;
  description: string | null;
  category: string;
  location: string | null;
  whatsappNumber: string | null;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  isVerified: boolean;
  rating: number;
  totalSales: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  description: string | null;
  priceNaira: number;
  coinPrice: number;
  imageUrls: string[];
  category: string;
  isFeatured: boolean;
  featuredUntil: Date | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  parentId: string | null;
  createdAt: Date;
}

export interface Order {
  id: string;
  buyerId: string;
  productId: string;
  quantity: number;
  totalNaira: number;
  totalCoins: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// ===========================================
// REFERRALS
// ===========================================

export interface Referral {
  id: string;
  referrerId: string;
  refereeId: string;
  level: number;
  commissionRate: number;
  isActive: boolean;
  createdAt: Date;
}

// ===========================================
// VOTING / CONTESTS
// ===========================================

export interface Contest {
  id: string;
  title: string;
  description: string | null;
  type: ContestType;
  coverImageUrl: string | null;
  startsAt: Date;
  endsAt: Date;
  isActive: boolean;
  prizeDescription: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContestEntry {
  id: string;
  contestId: string;
  userId: string;
  artistProfileId: string | null;
  businessProfileId: string | null;
  description: string | null;
  imageUrl: string | null;
  voteCount: number;
  status: ContestEntryStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface VoteCast {
  id: string;
  userId: string;
  entryId: string;
  contestId: string;
  coinsEarned: number;
  createdAt: Date;
}

// ===========================================
// VTU SERVICES
// ===========================================

export interface VtuTransaction {
  id: string;
  userId: string;
  serviceType: 'AIRTIME' | 'DATA' | 'ELECTRICITY';
  provider: string;
  phoneNumber: string;
  amount: number;
  coinsUsed: number;
  networkCode: string | null;
  bundleCode: string | null;
  meterNumber: string | null;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  externalRef: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ===========================================
// NOTIFICATIONS
// ===========================================

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

// ===========================================
// ADMIN
// ===========================================

export interface AdminAction {
  id: string;
  adminId: string;
  actionType: string;
  targetType: string;
  targetId: string;
  details: Record<string, unknown> | null;
  createdAt: Date;
}