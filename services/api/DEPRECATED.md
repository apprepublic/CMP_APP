# API Service - DEPRECATED

**Status**: Never deployed to production

**Date**: June 18, 2026

## Why Deprecated?

This API service was built with Express.js + Prisma but was **never deployed** to production. The frontend (`apps/web/`) uses:
- **Supabase Edge Functions** for backend logic (register-user, verify-registration, etc.)
- **Supabase JS Client** for direct database access
- **`profiles` table** for user data (not Prisma's `"User"` table)

## What Was Here?

- Express.js server with 15+ route handlers
- Prisma ORM with full schema (`schema.prisma`)
- Authentication, users, wallet, music, articles, tasks, contests, marketplace, VTU, referrals, admin routes
- Seed scripts and middleware

## Why Removed?

1. **Duplicate user tables**: Prisma created `"User"` table, but frontend used `profiles`
2. **Registration failures**: `"Wallet"` had FK constraint to `"User"`, causing errors
3. **Unused code**: Frontend never called this API - all logic in Edge Functions
4. **Domain never configured**: `api.cmpapp.ng` doesn't resolve

## Current Architecture

```
Frontend (Next.js) → Supabase Edge Functions → Supabase Database
                     ↓
                Direct Supabase Client calls
```

## If You Need Backend Logic

Use **Supabase Edge Functions** (in `/supabase/functions/`):
- Already integrated with frontend
- No separate deployment needed
- Uses same Supabase client as frontend
- No Prisma complexity

## Files Preserved

This directory is kept for reference only. To restore:
1. Remove this DEPRECATED.md file
2. Run `npm install` in this directory
3. Run `npx prisma generate`
4. Start with `npm run dev`

**But don't** - use Edge Functions instead.

---

**Migration Completed**: June 18, 2026
- Dropped `"User"` table (unused Prisma table)
- Removed FK constraint from `"Wallet"` to `"User"`
- Registration now works: `auth.users` → `profiles` → `"Wallet"`