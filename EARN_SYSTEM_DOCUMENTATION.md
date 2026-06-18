# CMPapp Earn/Tasks System Documentation

## Overview

The Earn section allows users to complete tasks and read articles to earn CMP Coins. The system includes daily tasks, streak rewards, and educational content.

---

## 1. Task System Architecture

### Database Schema (Prisma)

```prisma
model Task {
  id              String   @id @default(cuid())
  title           String
  description     String
  type            TaskType
  coinReward      Int
  dailyLimit      Int      @default(1)
  requiresAdGate  Boolean  @default(true)
  linkedArticleId String?  @unique
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  linkedArticle   Article?         @relation(fields: [linkedArticleId], references: [id])
  completions     TaskCompletion[]
}

model TaskCompletion {
  id          String   @id @default(cuid())
  userId      String
  taskId      String
  coinsEarned Int
  proofData   Json?
  adWatched   Boolean  @default(false)
  createdAt   DateTime @default(now())

  user User @relation(fields: [userId], references: [id])
  task Task @relation(fields: [taskId], references: [id])

  @@unique([userId, taskId, createdAt])  // Prevents duplicate completions
}
```

### Task Types

Tasks are categorized by type:
- **SURVEY** - Opinion surveys and market research
- **SOCIAL** - Social media engagement tasks
- **CONTENT** - Content creation and tagging
- **READING** - Article reading tasks (linked to articles)
- **ONBOARDING** - New user setup tasks
- **ENGAGEMENT** - General platform engagement

---

## 2. How Daily Tasks Work

### Task Identification for the Day

Tasks are **NOT** pre-assigned to specific days. Instead:

1. **All active tasks** are available every day
2. **Daily limits** control how many times a user can complete each task per day
3. **Completion tracking** uses timestamps to determine "today's" completions

```typescript
// From /services/api/src/routes/tasks.ts
const today = new Date();
today.setHours(0, 0, 0, 0);
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

// Query completions within today's date range
completions: {
  where: {
    userId: authReq.user!.id,
    createdAt: {
      gte: today,    // Midnight today
      lt: tomorrow   // Midnight tomorrow
    }
  }
}
```

### Daily Task Flow

1. **User visits /tasks page** → API fetches all active tasks
2. **Backend checks completions** → Counts how many times user completed each task TODAY
3. **Frontend displays status**:
   - `canComplete`: true if completions < dailyLimit
   - `isLocked`: true if completions >= dailyLimit
   - `completedToday`: Number showing X/Y completions

### Example

```javascript
{
  id: "task123",
  title: "Complete Survey",
  dailyLimit: 3,
  completedToday: 2,
  isLocked: false,      // Can still complete 1 more
  canComplete: true
}
```

---

## 3. Task Categorization

### Categories vs Types

- **Type** (Database): Technical classification for rewards logic
  - Defined in `TaskType` enum
  - Used for reward calculations
  
- **Category** (Frontend): Display grouping for UI
  - SURVEY, SOCIAL, CONTENT, READING, etc.
  - Used for filter tabs on tasks page

### Category Filtering

```typescript
// Frontend filtering in /apps/web/app/(app)/tasks/page.tsx
const [activeCategory, setActiveCategory] = useState<string>('All');

const filteredTasks = useMemo(() => {
  if (activeCategory === 'All') return tasks;
  return tasks.filter((t) => t.category === activeCategory);
}, [tasks, activeCategory]);
```

### Premium Tasks

Tasks are marked as "PREMIUM" based on coin reward:
```typescript
const isPremium = task.coin_reward >= 100; // Arbitrary threshold
```

Premium tasks get:
- Gold border styling
- "PREMIUM" badge
- Higher visibility

---

## 4. Task-Article Relationship

### Linked Articles

Tasks can be linked to articles for "Read-to-Earn" functionality:

```prisma
model Task {
  linkedArticleId String?  @unique  // One-to-one relationship
  linkedArticle   Article? @relation(fields: [linkedArticleId], references: [id])
}

model Article {
  id    String @id @default(cuid())
  slug  String @unique
  title String
  // ... other fields
}
```

### How It Works

1. **Admin creates article** in articles table
2. **Admin creates task** with `linkedArticleId` = article's ID
3. **User clicks task** → Redirected to `/tasks/article/[slug]`
4. **User reads article** → Progress tracked via scroll position
5. **User reaches 95%** → "Claim Rewards" button appears
6. **User claims** → Task marked as completed, coins awarded

### Reading Progress Tracking

```typescript
// From ArticleReaderClient.tsx
useEffect(() => {
  const handleScroll = () => {
    const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolledPercentage = (window.scrollY / scrollableHeight) * 100;
    setReadingProgress(Math.min(scrolledPercentage, 100));

    if (scrolledPercentage >= 95) {
      setShowClaim(true); // Show claim button at 95% scroll
    }
  };

  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### Example Data Flow

```
Article: "Beginner's Guide to Earning Coins"
  ├─ id: "abc123"
  └─ slug: "beginners-guide-earning-coins-online"

Task: "Read Beginner's Guide"
  ├─ id: "task456"
  ├─ type: "READING"
  ├─ coinReward: 50
  └─ linkedArticleId: "abc123"  ← Links to article

User Journey:
1. Clicks "Read Beginner's Guide" task
2. Navigates to /tasks/article/beginners-guide-earning-coins-online
3. Scrolls through article (progress bar at top)
4. Reaches 95% → "Claim 50 Coins" button appears
5. Claims → TaskCompletion record created
6. Wallet credited with 50 coins
```

---

## 5. Task Completion Flow

### API Endpoint

```typescript
// POST /api/tasks/:id/complete
router.post('/:id/complete', authenticate, async (req, res) => {
  const task = await prisma.task.findUnique({ where: { id } });
  
  // Check daily limit
  const completionsToday = await prisma.taskCompletion.count({
    where: {
      userId: authReq.user.id,
      taskId: id,
      createdAt: { gte: today, lt: tomorrow }
    }
  });

  if (completionsToday >= task.dailyLimit) {
    throw new AppError('Daily limit reached', 400);
  }

  // Create completion record
  const completion = await prisma.taskCompletion.create({
    data: {
      userId: authReq.user.id,
      taskId: task.id,
      coinsEarned: task.coinReward,
      adWatched: data.adWatched,
      proofData: data.proofData
    }
  });

  // Credit wallet
  await prisma.wallet.update({
    where: { userId: authReq.user.id },
    data: { coinBalance: { increment: task.coinReward } }
  });

  res.json({ completion, coinsEarned: task.coinReward });
});
```

### Completion Validation

1. **Task exists and is active**
2. **Daily limit not exceeded**
3. **AdGate requirement met** (if `requiresAdGate` = true)
4. **Proof data provided** (for certain task types)
5. **Unique constraint**: `[userId, taskId, createdAt]` prevents duplicates

---

## 6. Streak System

### Streak Tracking

```prisma
model StreakRecord {
  id             String    @id @default(cuid())
  userId         String    @unique
  currentStreak  Int       @default(0)
  longestStreak  Int       @default(0)
  lastActiveDate DateTime?
  freezesOwned   Int       @default(0)
}
```

### How Streaks Work

1. **Daily login** → Check if user completed tasks today
2. **If yes** → Increment `currentStreak`
3. **If no** → Reset `currentStreak` to 0 (unless freeze used)
4. **Update `longestStreak`** if `currentStreak` exceeds it

### Streak Rewards

- **7-day streak**: Bonus coins
- **30-day streak**: Special badge
- **60-day streak**: Premium rewards
- **Freeze tokens**: Protect streak on missed days

---

## 7. Adding New Tasks

### Via Database (Admin)

```sql
-- Add new task
INSERT INTO "Task" (id, title, description, type, "coinReward", "dailyLimit", "requiresAdGate", "isActive")
VALUES (
  gen_random_uuid(),
  'Complete Daily Survey',
  'Answer 10 questions about music preferences',
  'SURVEY',
  75,
  2,
  true,
  true
);

-- Link task to article (optional)
UPDATE "Task" 
SET "linkedArticleId" = (SELECT id FROM "Article" WHERE slug = 'survey-tips')
WHERE title = 'Complete Daily Survey';
```

### Task Creation Best Practices

1. **Set appropriate coin rewards**:
   - Simple tasks: 10-25 coins
   - Medium tasks: 25-75 coins
   - Premium tasks: 100+ coins

2. **Configure daily limits**:
   - Survey tasks: 2-3 per day
   - Reading tasks: 1-2 per day
   - Social tasks: 5-10 per day

3. **Enable AdGate for high rewards**:
   - Tasks with 100+ coins should have `requiresAdGate = true`

4. **Link articles when applicable**:
   - Reading tasks MUST have `linkedArticleId`
   - Educational tasks benefit from article links

---

## 8. Frontend Components

### Key Files

- **`/apps/web/app/(app)/tasks/page.tsx`** - Task marketplace listing
- **`/apps/web/app/(app)/tasks/streak/page.tsx`** - Streak tracking UI
- **`/apps/web/app/(app)/tasks/article/[id]/page.tsx`** - Article reader
- **`/services/api/src/routes/tasks.ts`** - API endpoints

### Task Card Display

```typescript
// Premium styling based on coin reward
const isPremium = task.coin_reward >= 100;

<div className={isPremium ? 'border-2 border-[#B8860B]' : 'border border-outline-variant/20'}>
  {isPremium && <div className="bg-[#B8860B]">PREMIUM</div>}
  
  <div className="coin-reward">
    {task.coin_reward} coins
  </div>
  
  <h3>{task.title}</h3>
  <p>{task.description}</p>
  
  {task.completedToday}/{task.dailyLimit} completed today
</div>
```

---

## Summary

**Earn System Flow:**
1. Admin creates tasks (optionally linked to articles)
2. Tasks displayed on /tasks page with category filters
3. Users complete tasks within daily limits
4. Completions tracked with timestamps
5. Coins awarded to wallet
6. Streaks tracked for consistent engagement
7. Articles serve as educational content AND earnable tasks

**Key Features:**
- ✅ Daily task limits prevent abuse
- ✅ Timestamp-based completion tracking
- ✅ Article integration for Read-to-Earn
- ✅ Premium task highlighting
- ✅ Streak rewards for retention
- ✅ Category filtering for UX