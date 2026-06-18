-- Remove unused Prisma User table
-- The API service (services/api/) was never deployed to production
-- Frontend uses Supabase Edge Functions + profiles table instead
-- 
-- This eliminates:
-- - Data duplication between "User" and "profiles" tables
-- - FK constraint errors during registration
-- - Confusion about which user table to use

-- Drop the unused "User" table (Prisma-created, never used in production)
DROP TABLE IF EXISTS "User" CASCADE;

-- Note: Other Prisma tables remain but are unused:
-- "Article", "ArtistProfile", "BusinessProfile", "Contest", "ContestEntry", 
-- "Referral", "Song", "SongStream", "StreakRecord", "Task", "TaskCompletion",
-- "Product", "ProductCategory", "Order", "VoteCast", "VtuTransaction",
-- "KycRecord", "UserVerification", "AdminAction", "Notification",
-- "WithdrawalRequest", "CoinTransaction"
-- 
-- These can be removed in a future cleanup if the API service is officially deprecated