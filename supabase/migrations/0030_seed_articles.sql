-- Migration: Seed articles for CMP App
-- Adds sample articles so the Earn > Articles section is populated

INSERT INTO articles (id, title, slug, excerpt, content, category, read_time_minutes, coin_reward, cover_image_url, is_published)
VALUES

(
  gen_random_uuid(),
  'The Future of Creative Finance in Africa',
  'future-of-creative-finance-africa',
  'Explore how blockchain and tokenized assets are reshaping the financial landscape for African creatives.',
  E'Across the continent, a silent revolution is brewing at the intersection of cultural exports and digital infrastructure. As the global appetite for Afrobeats, Nollywood, and African contemporary art reaches a fever pitch, the underlying financial mechanisms that support these creators are undergoing a radical transformation.\n\nThe Liquidity Gap\n\nFor decades, African creatives have faced a recurring barrier: the "Liquidity Gap." Traditional banking institutions, often risk-averse and optimized for tangible collateral like real estate or machinery, have struggled to value intellectual property. How do you collateralize a viral hit song or a digital fashion collection?\n\nEnter CMPapp''s Creative Equity Model. By leveraging blockchain-backed transparency and tokenized asset management, we are allowing artists to fractionalize their future earnings. This creates a direct bridge between institutional investors and creative entrepreneurs, ensuring that growth capital is available when it''s needed most — during the creation phase.\n\nTokenization: More Than a Buzzword\n\nWhen we talk about CMP Coins, we aren''t just talking about a rewards program. We are talking about a programmable currency that understands the nuances of the creative lifecycle. Smart contracts ensure that royalty payments are distributed instantly across borders, bypassing the bureaucratic friction that has traditionally seen creators waiting months for their hard-earned revenue.\n\nAs we look toward 2030, the projection for Africa''s creative economy suggests a valuation exceeding $20 billion. The winners in this space will not just be those with the best talent, but those with the most efficient financial rails. CMPapp is proud to be building that infrastructure, one block at a time.',
  'Finance',
  8,
  50,
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCc-7--9nnzDWkZCQxo5aIwCqNw6_l81K2eHxpM5iMNicuDcuA8VzftZ_XdRcDF5rjZ6qurkUA_5BrZkSbpWfqaWXkDBAzIUshYXdXfrMXBnlVlQbjDd8ktghuAK40_ppLJfPz5sSLF2rTGJkZAWvYXZHMdS5CmCKeOTKLRql2CTzOwTyHJsyxOxc3jXM0FwB5b0Rd9UzCxt6p2orX6Ba4mn8nfeHRHf78EAvOc8X-AwjZ2LHW_QsWeWM4TJWsEKH9V6hJEoT4MO6o',
  true
),

(
  gen_random_uuid(),
  'How to Maximize Your CMP Coin Earnings',
  'maximize-cmp-coin-earnings',
  'A practical guide to earning more CMP coins through tasks, streaming, referrals and daily streaks.',
  E'CMP coins are the lifeblood of the CMP App ecosystem. Whether you are a casual listener or a power user, understanding how coins flow through the platform is the key to unlocking consistent rewards.\n\nDaily Streaks: Your Biggest Multiplier\n\nThe most overlooked earning mechanism on CMP App is the daily streak. Logging in and completing at least one task every day maintains your streak. The longer your streak, the bigger the bonus multiplier on your task rewards. A 7-day streak can earn you up to 2x on standard task completions.\n\nStream to Earn\n\nEvery time you listen to a promoted track from a verified artist or partner on CMP App, you accumulate coins in real-time. The reward is typically credited after 30 seconds of continuous playback. Make it a habit to open the Music section during your daily commute and let the coins stack up.\n\nReferrals Are Passive Income\n\nYour referral code is a powerful tool. Each new user who signs up using your code and completes their first task credits your wallet with a referral bonus. Share your code on social media, WhatsApp groups, and among your creative network to build a steady passive income stream.\n\nTask Stacking Strategy\n\nThe most efficient earners on CMP App combine multiple task types in a single session: start with an article read, follow it with a social engagement task, then close with a streaming task. This "stack" approach maximizes the coins earned per minute of engagement.\n\nThe bottom line is simple: consistency beats intensity. A user who completes one task per day for 30 days will out-earn a user who completes 10 tasks in a single day and disappears.',
  'Tips',
  6,
  40,
  null,
  true
),

(
  gen_random_uuid(),
  'Understanding the CMP Withdrawal System',
  'understanding-cmp-withdrawal-system',
  'Everything you need to know about converting your CMP coins to real money and withdrawing to your bank.',
  E'One of the most frequently asked questions we receive is: "How do I get my money?" This article walks you through the complete withdrawal process on CMP App so you can access your earnings confidently.\n\nCoin to Fiat Conversion\n\nCMP coins have a fixed exchange rate that is displayed on your wallet page. Nigerian users see their balance converted to Naira (NGN), while users in other regions see the equivalent in US Dollars (USD). The app uses your device''s GPS location to determine which currency to display.\n\nThe current rate is: 1 CMP = ₦0.10 (NGN) or $0.000067 (USD).\n\nMinimum Withdrawal Threshold\n\nTo initiate a withdrawal, your wallet must meet the minimum threshold. This is in place to keep transaction fees reasonable. The minimum is typically 500 CMP coins, which equals ₦50 NGN or approximately $0.034 USD.\n\nBank Account Setup\n\nBefore your first withdrawal, you must add and verify a bank account in the Wallet section of the app. You will need your account number and bank name. This information is encrypted and stored securely.\n\nProcessing Time\n\nWithdrawal requests are reviewed by our finance team and processed within 24-72 business hours. You will receive an in-app notification when your request has been approved and funds have been transferred.\n\nTips for a Smooth Withdrawal\n\nAlways double-check your bank account number before submitting. Ensure your KYC (Know Your Customer) verification is complete in your profile settings, as unverified accounts have lower withdrawal limits.',
  'Wallet',
  5,
  35,
  null,
  true
),

(
  gen_random_uuid(),
  'The Rise of Afrobeats: A Cultural and Economic Phenomenon',
  'rise-of-afrobeats-cultural-economic-phenomenon',
  'Explore how Afrobeats became a global force and what it means for African creative entrepreneurs.',
  E'In less than a decade, Afrobeats has transformed from a regional West African sound to the defining global music genre of the 2020s. Artists like Burna Boy, Wizkid, Davido, and Tems are not just chart-toppers; they are cultural ambassadors and economic engines for an entire continent.\n\nThe Global Streaming Surge\n\nStreaming platforms have been the rocket fuel for Afrobeats'' global expansion. Songs that would previously have been limited to local radio airplay are now reaching listeners in London, Toronto, Lagos, and Los Angeles simultaneously. This has created an unprecedented opportunity for African artists to monetize their work across multiple markets at once.\n\nThe Creative Economy Dividend\n\nThe rise of Afrobeats has catalyzed a broader creative economy boom in Africa. Music video directors, choreographers, fashion designers, social media managers, and sound engineers are all benefiting from the increased investment flowing into African creative content. CMP App exists at this intersection — providing the financial tools that creatives need to thrive in this new economy.\n\nCommunity-Driven Success\n\nWhat makes Afrobeats unique is how deeply communal its success is. Fans are not passive consumers; they are active participants who stream songs, share content, attend shows, and advocate for their favorite artists. CMP App channels this energy into a rewards ecosystem where fans are recognized and compensated for their genuine engagement.\n\nThe future of the music industry is African, and the financial infrastructure to support it is being built right now.',
  'Music',
  7,
  45,
  null,
  true
),

(
  gen_random_uuid(),
  'Your Complete Guide to CMP App Referrals',
  'complete-guide-cmp-referrals',
  'Learn how to share your referral code, track your earnings, and build a passive income stream on CMP App.',
  E'The CMP App referral program is one of the most powerful ways to earn without actively completing tasks. When you invite a friend and they join the platform, both of you benefit. This guide explains everything you need to know.\n\nFinding Your Referral Code\n\nYour unique referral code is found in the Referrals section of the app. It is a short alphanumeric code that is permanently linked to your account. You can copy it with one tap or share the full registration link directly.\n\nHow Referral Rewards Work\n\nWhen a new user registers using your referral code and completes their first qualifying task, a referral bonus is automatically credited to your wallet. The new user also receives a sign-up bonus for using a referral code, making it a win-win.\n\nTracking Your Referrals\n\nThe Referrals dashboard shows you a complete breakdown of everyone who has joined using your code, their activity status, and the total coins you have earned from referrals. The weekly earnings chart helps you see trends and identify when your sharing campaigns are most effective.\n\nSharing Strategies That Work\n\nThe most successful referrers on CMP App treat it like a mini-marketing campaign. They share their code in context — for example, alongside a post about a song they discovered on the platform, or in a WhatsApp group discussion about earning money online. Authentic sharing always outperforms generic spam.\n\nPremium Referral Bonuses\n\nUsers who refer 10 or more active users within a 30-day period qualify for a premium referral bonus. These bonuses are credited automatically and can significantly boost your total earnings.',
  'Referrals',
  5,
  30,
  null,
  true
)

ON CONFLICT (slug) DO NOTHING;
