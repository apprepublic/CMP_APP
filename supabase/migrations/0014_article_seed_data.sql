-- ===========================================
-- ARTICLE SEED DATA MIGRATION
-- Populates the articles table with sample content
-- for the tasks/reading section of the app
-- ===========================================

-- Insert sample articles
INSERT INTO articles (id, title, slug, excerpt, content, author_id, category, read_time_minutes, view_count, is_published, published_at, created_at, updated_at) VALUES
  (gen_random_uuid(), 
   'Beginner's Guide to Earning Coins Online', 
   'beginners-guide-earning-coins-online',
   'Learn the fundamentals of earning CMP Coins through various activities on our platform.',
   '# Beginner''s Guide to Earning Coins Online

Welcome to CMPapp, your gateway to the creative economy! Whether you''re a music lover, task enthusiast, or social butterfly, there are multiple ways to earn coins and build your wealth.

## 🎵 Stream to Earn

Did you know you can get paid to listen to music? Our Stream-to-Earn feature rewards you for discovering new African artists:

- **Earn 5 coins** per qualifying stream
- **Qualifying streams** are 30+ seconds of play time
- **Daily limit**: 50 streams per day
- **Pro tip**: Create playlists to maximize your earning potential

## ✅ Complete Micro-Tasks

Brands pay you for simple digital activities:

- **Survey participation**: 50-200 coins
- **Content tagging**: 25-75 coins
- **App testing**: 100-500 coins
- **Social media engagement**: 30-100 coins

Tasks refresh daily, so check back often!

## 👥 Build Your Referral Network

Our 3-tier referral program lets you earn passively:

- **Tier 1**: 10% of direct referrals'' earnings
- **Tier 2**: 5% of second-tier referrals'' earnings
- **Tier 3**: 2% of third-tier referrals'' earnings

Share your unique referral code and watch your network grow!

## 💡 Pro Tips for Maximum Earnings

1. **Consistency is key** - Log in daily for streak bonuses
2. **Diversify** - Don''t rely on just one earning method
3. **Refer actively** - Your network is your net worth
4. **Complete your profile** - Unlock bonus earning opportunities

Ready to start earning? Head over to the dashboard and pick your first activity!',
   NULL,
   'education',
   5,
   0,
   true,
   NOW(),
   NOW(),
   NOW()),

  (gen_random_uuid(), 
   'How to Maximize Your Referral Earnings', 
   'maximize-referral-earnings',
   'Advanced strategies for building a profitable referral network and earning passive income.',
   '# How to Maximize Your Referral Earnings

Building a strong referral network is one of the most lucrative ways to earn on CMPapp. Here''s how to become a referral master.

## Understanding the 3-Tier System

Our referral program rewards you at three levels:

### Tier 1 (Direct Referrals) - 10%
- People you directly invite
- You earn 10% of everything they earn
- Example: If they earn 1000 coins, you get 100 coins

### Tier 2 (Second Level) - 5%
- People your direct referrals invite
- You earn 5% of their earnings
- Passive income from your network''s growth

### Tier 3 (Third Level) - 2%
- People invited by your Tier 2 network
- You earn 2% of their earnings
- True passive income at scale

## Proven Strategies for Success

### 1. Target the Right Audience
Focus on:
- Music enthusiasts who''ll use the streaming feature
- Active social media users
- People interested in side hustles
- Students and young professionals

### 2. Create Valuable Content
- Share your earnings screenshots (with permission)
- Create tutorial videos
- Write blog posts about your experience
- Host webinars or live sessions

### 3. Leverage Social Media
- **Instagram**: Post success stories and testimonials
- **Twitter**: Share daily tips and earnings updates
- **Facebook**: Join relevant groups and communities
- **TikTok**: Create short, engaging videos about earning

### 4. Build a Community
- Create a WhatsApp or Telegram group
- Share tips and tricks regularly
- Celebrate your referrals'' successes
- Provide ongoing support

### 5. Lead by Example
- Be active on the platform yourself
- Share your personal earnings journey
- Show consistency and dedication
- Demonstrate multiple earning methods

## Common Mistakes to Avoid

❌ **Spamming** - Don''t just drop links everywhere
❌ **False promises** - Be honest about earning potential
❌ **Neglecting your network** - Support your referrals
❌ **Giving up too soon** - Network effects take time

## Success Story: Network Queen

*"I started by inviting 5 friends from my university. Within 3 months, I had 50 direct referrals and over 200 people in my network. Now I earn over 50,000 coins monthly just from referrals!"* - Network Queen, Berlin

## Ready to Start?

1. Go to your dashboard
2. Click on "Referrals"
3. Copy your unique referral code
4. Start sharing strategically

Remember: Quality over quantity. One active referrer is worth more than 10 inactive users!',
   NULL,
   'referrals',
   7,
   0,
   true,
   NOW(),
   NOW(),
   NOW()),

  (gen_random_uuid(), 
   'Music Streaming: Get Paid for What You Love', 
   'music-streaming-get-paid',
   'Discover how to earn coins while streaming music from emerging African artists.',
   '# Music Streaming: Get Paid for What You Love

Love music? Now you can earn coins while discovering amazing tracks from emerging African artists!

## How Stream-to-Earn Works

### The Basics
1. **Browse** our curated music library
2. **Play** songs that interest you
3. **Earn** 5 coins per qualifying stream
4. **Repeat** up to 50 times daily

### What Makes a Stream "Qualifying"?

To prevent abuse and ensure artists get real engagement:
- ✅ Listen for at least 30 seconds
- ✅ Don''t skip too frequently
- ✅ Interact with the song (like, add to playlist)
- ✅ Complete the full song for bonus points

## Discover Amazing Artists

Our platform features talented artists across genres:

### Afrobeats
- Upbeat, danceable rhythms from West Africa
- Artists like DJ Horizon, Bella Voices
- Perfect for workouts and parties

### Amapiano
- South African house music subgenre
- Deep bass, log drums, soulful melodies
- Growing global popularity

### Hip-Hop/Rap
- African rap and hip-hop artists
- Conscious lyrics and hard-hitting beats
- Authentic storytelling

### R&B/Soul
- Smooth vocals and emotional depth
- Contemporary African R&B
- Perfect for chill listening

## Maximizing Your Music Earnings

### Daily Strategy
1. **Morning**: 10 streams during commute
2. **Afternoon**: 10 streams during lunch break
3. **Evening**: 30 streams while relaxing

### Create Themed Playlists
- **Workout Mix**: High-energy tracks
- **Chill Vibes**: Relaxing melodies
- **Focus Mode**: Instrumental and ambient
- **Party Starter**: Dance and Afrobeats

### Engage with Artists
- Follow your favorite artists
- Like and comment on songs
- Share tracks on social media
- Attend virtual listening parties

## Artist Spotlight

### DJ Horizon (London, UK)
- **Genre**: Afrobeats/Electronic
- **Coins Earned**: 450K+
- **Top Track**: "Lagos Nights"
- **Why Listen**: Infectious beats that blend traditional African rhythms with modern production

### Bella Voices (Tokyo, JP)
- **Genre**: R&B/Soul
- **Coins Earned**: 190K+
- **Top Track**: "Midnight Dreams"
- **Why Listen**: Soulful vocals that transport you to another world

## Ready to Start Earning?

1. Go to the Music section
2. Browse by genre or artist
3. Hit play and start earning
4. Create playlists for repeat listening

**Remember**: You''re not just earning coins - you''re supporting emerging African artists and helping them reach global audiences!',
   NULL,
   'music',
   6,
   0,
   true,
   NOW(),
   NOW(),
   NOW()),

  (gen_random_uuid(), 
   'Task Completion Masterclass', 
   'task-completion-masterclass',
   'Learn strategies to maximize earnings from micro-tasks and brand partnerships.',
   '# Task Completion Masterclass

Micro-tasks are one of the most reliable ways to earn coins on CMPapp. Here''s how to become a task completion expert.

## Types of Available Tasks

### 📊 Surveys (50-200 coins)
- Brand opinion surveys
- Product feedback
- Market research
- User experience studies

**Tips**:
- Complete your profile for better matching
- Be honest and consistent
- Take your time - rushed answers get flagged

### 🏷️ Content Tagging (25-75 coins)
- Image categorization
- Hashtag suggestions
- Content moderation
- Data labeling

**Tips**:
- Read guidelines carefully
- Accuracy over speed
- Build a reputation for quality

### 📱 App Testing (100-500 coins)
- Download and test new apps
- Provide feedback on UX
- Report bugs
- Complete specific actions

**Tips**:
- Use a dedicated device if possible
- Take screenshots of issues
- Provide detailed feedback

### 📢 Social Media (30-100 coins)
- Like and share posts
- Comment on content
- Follow brand accounts
- Create user-generated content

**Tips**:
- Use relevant hashtags
- Engage authentically
- Follow brand guidelines

## Daily Task Strategy

### Morning Routine (15 minutes)
1. Check for new high-value tasks
2. Complete quick surveys (5-10 minutes)
3. Tag content while having coffee

### Lunch Break (20 minutes)
1. App testing sessions
2. Social media tasks
3. Quick surveys

### Evening Session (30 minutes)
1. Longer, higher-paying tasks
2. Content tagging marathons
3. Survey completion

## Quality Over Quantity

Brands value quality responses:
- ✅ **Thoughtful answers** get you invited to more tasks
- ✅ **Consistent performance** unlocks premium tasks
- ✅ **Good reputation** leads to higher rewards
- ❌ **Rushed work** gets you flagged or banned

## Avoiding Common Mistakes

### ❌ Contradictory Answers
- Don''t say you''re 25 in one survey and 35 in another
- Keep your demographics consistent

### ❌ Speed Running
- Completing a 10-minute survey in 2 minutes raises red flags
- Take the time the task requires

### ❌ Copy-Paste Responses
- Write unique answers for each task
- Generic responses get flagged

### ❌ Multiple Accounts
- One person, one account
- System detects and bans duplicate accounts

## Advanced Tips

### 1. Task Notifications
- Enable push notifications
- High-paying tasks fill up quickly
- First come, first served

### 2. Build Your Profile
- Complete all demographic questions
- Add interests and preferences
- Verify your identity if required

### 3. Track Your Performance
- Monitor completion rates
- Note which task types pay best
- Optimize your time accordingly

### 4. Peak Times
- **Tuesday-Thursday**: More surveys available
- **End of month**: Brands have budget to spend
- **Holiday seasons**: Increased marketing spend

## Success Metrics

Track these metrics to improve:
- **Tasks completed per day**
- **Average coins per task**
- **Completion rate**
- **Rejection rate** (aim for <5%)

## Ready to Start?

1. Navigate to the Tasks section
2. Browse available tasks
3. Filter by coin reward or time required
4. Start with easier tasks to build confidence
5. Work your way up to premium tasks

**Remember**: Consistency and quality are your keys to success. Start small, build your reputation, and watch your earnings grow!',
   NULL,
   'tasks',
   8,
   0,
   true,
   NOW(),
   NOW(),
   NOW());

-- Update view counts for some articles (simulate activity)
UPDATE articles SET view_count = 1250 WHERE slug = 'beginners-guide-earning-coins-online';
UPDATE articles SET view_count = 890 WHERE slug = 'maximize-referral-earnings';
UPDATE articles SET view_count = 2100 WHERE slug = 'music-streaming-get-paid';
UPDATE articles SET view_count = 675 WHERE slug = 'task-completion-masterclass';

COMMENT ON TABLE articles IS 'Educational content and guides for users to learn about earning opportunities';