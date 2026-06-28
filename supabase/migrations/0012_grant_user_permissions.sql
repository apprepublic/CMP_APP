-- Grant service_role access to Prisma-created tables
-- Wrapped in DO blocks so each GRANT is skipped gracefully on fresh projects
-- where these camelCase Prisma tables may not exist

DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'User') THEN GRANT ALL ON "User" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Wallet') THEN GRANT ALL ON "Wallet" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Referral') THEN GRANT ALL ON "Referral" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Article') THEN GRANT ALL ON "Article" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'TaskCompletion') THEN GRANT ALL ON "TaskCompletion" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Product') THEN GRANT ALL ON "Product" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ProductCategory') THEN GRANT ALL ON "ProductCategory" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'BusinessProfile') THEN GRANT ALL ON "BusinessProfile" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ArtistProfile') THEN GRANT ALL ON "ArtistProfile" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'VoteCast') THEN GRANT ALL ON "VoteCast" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ContestEntry') THEN GRANT ALL ON "ContestEntry" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Contest') THEN GRANT ALL ON "Contest" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'CoinTransaction') THEN GRANT ALL ON "CoinTransaction" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Notification') THEN GRANT ALL ON "Notification" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Order') THEN GRANT ALL ON "Order" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'VtuTransaction') THEN GRANT ALL ON "VtuTransaction" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'AdminAction') THEN GRANT ALL ON "AdminAction" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'KycRecord') THEN GRANT ALL ON "KycRecord" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'UserVerification') THEN GRANT ALL ON "UserVerification" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'StreakRecord') THEN GRANT ALL ON "StreakRecord" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Song') THEN GRANT ALL ON "Song" TO service_role; END IF; END $$;
DO $$ BEGIN IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'SongStream') THEN GRANT ALL ON "SongStream" TO service_role; END IF; END $$;