# CMPapp - Digital Ecosystem Platform

Nigeria's premier earning platform. Complete tasks, stream music, sell products, and earn CMP Coins!

## Features

- **Earn Coins**: Complete daily tasks, read articles, watch videos, share content
- **Music Streaming**: Upload and stream music, earn from plays and downloads
- **Marketplace**: Create stores, list products, reach thousands of customers
- **Referrals**: Multi-level referral system (L1: 20%, L2: 10%, L3: 5%)
- **Contests**: Vote for favorites and win prizes
- **VTU Services**: Airtime, data, electricity purchases with coins
- **Wallet**: Top up with Naira, withdraw to bank/crypto

## Tech Stack

### Backend
- Node.js + Express.js
- TypeScript
- Prisma ORM
- PostgreSQL (Supabase)
- Redis (Upstash)

### Frontend
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Zustand (State)
- TanStack Query

## Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (Supabase)
- Redis (Upstash)

### Backend Setup

```bash
cd services/api
cp .env.example .env
# Edit .env with your credentials

npm install
npx prisma migrate dev
npm run db:seed
npm run dev
```

### Frontend Setup

```bash
cd apps/web
npm install
npm run dev
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
SUPABASE_URL=...
JWT_SECRET=...
PAYSTACK_SECRET_KEY=...
TERMII_API_KEY=...
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Project Structure

```
cmpapp/
├── apps/
│   └── web/           # Next.js frontend
├── packages/
│   ├── types/         # Shared TypeScript types
│   └── utils/        # Shared utilities
├── services/
│   └── api/          # Express.js backend
│       ├── prisma/   # Database schema
│       └── src/
│           ├── routes/
│           ├── services/
│           └── middleware/
```

## Coin Economy

### Earn Rates
- Read article: 50 coins
- Watch ad: 30 coins
- Share task: 100 coins
- Complete survey: 200 coins
- App download: 500 coins
- Vote: 20 coins
- Music stream: 1 coin
- Music download: 3 coins

### Conversion
- 100 coins = ₦1
- Min withdrawal: 100,000 coins (₦1,000)
- Withdrawal fee: 1.5%

## API Endpoints

| Route | Description |
|-------|-------------|
| POST /api/auth/register | Register user |
| POST /api/auth/login | Login |
| GET /api/users/me | Get profile |
| GET /api/wallet | Get wallet |
| POST /api/wallet/topup | Top up |
| POST /api/wallet/withdraw | Withdraw |
| GET /api/tasks/daily | Get daily tasks |
| POST /api/tasks/:id/complete | Complete task |
| GET /api/music/songs | Get songs |
| GET /api/marketplace/products | Get products |
| GET /api/referrals | Get referrals |

## License

MIT