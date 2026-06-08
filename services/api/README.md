# CMPapp API Documentation

Base URL: `https://api.cmpapp.ng` (Production)

## Authentication

### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "phone": "+2348012345678",
  "password": "password123",
  "displayName": "John Doe",
  "username": "johndoe",
  "referralCode": "OPTIONAL123"
}
```

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Send OTP
```http
POST /api/auth/otp/send
Content-Type: application/json

{
  "phone": "+2348012345678"
}
```

### Verify OTP
```http
POST /api/auth/otp/verify
Content-Type: application/json

{
  "phone": "+2348012345678",
  "otp": "123456"
}
```

---

## User Routes

### Get Current User
```http
GET /api/users/me
Authorization: Bearer <access_token>
```

### Update Profile
```http
PATCH /api/users/me
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "displayName": "New Name"
}
```

### Submit KYC
```http
POST /api/users/kyc
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "bvn": "12345678901",
  "idNumber": "ABC123456",
  "idType": "national_id",
  "selfieUrl": "https://...",
  "idImageUrl": "https://..."
}
```

### Upgrade to Artist
```http
POST /api/users/upgrade/artist
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "stageName": "DJ Example",
  "bio": "Afrobeat artist",
  "genre": "Afrobeat"
}
```

### Upgrade to Business
```http
POST /api/users/upgrade/business
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "businessName": "Example Stores",
  "category": "Fashion",
  "location": "Lagos",
  "whatsappNumber": "+2348012345678"
}
```

---

## Wallet Routes

### Get Wallet Balance
```http
GET /api/wallet
Authorization: Bearer <access_token>
```

### Get Transaction History
```http
GET /api/wallet/transactions?page=1&limit=20&type=TASK_EARN
Authorization: Bearer <access_token>
```

### Top Up (Simulated)
```http
POST /api/wallet/topup
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "amount": 1000,
  "paymentMethod": "card"
}
```

### Withdraw
```http
POST /api/wallet/withdraw
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "coinsAmount": 100000,
  "method": "BANK",
  "bankAccount": "0123456789",
  "bankName": "First Bank",
  "pin": "1234"
}
```

### Get Withdrawal History
```http
GET /api/wallet/withdrawals?page=1&limit=20
Authorization: Bearer <access_token>
```

---

## Task Routes

### Get All Tasks
```http
GET /api/tasks?type=READ_ARTICLE
```

### Get Daily Tasks
```http
GET /api/tasks/daily
Authorization: Bearer <access_token>
```

### Complete Task
```http
POST /api/tasks/<task_id>/complete
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "adWatched": true,
  "proofData": {}
}
```

### Read Article
```http
POST /api/tasks/article/<article_id>/read
Authorization: Bearer <access_token>
```

### Claim Article Reward
```http
POST /api/tasks/article/<article_id>/claim
Authorization: Bearer <access_token>
```

---

## Music Routes

### Get All Songs
```http
GET /api/music/songs?page=1&limit=20&genre=Afrobeat&search=love
```

### Get Featured Songs
```http
GET /api/music/songs/featured
```

### Get Song
```http
GET /api/music/songs/<song_id>
```

### Stream Song
```http
POST /api/music/songs/<song_id>/stream
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "duration": 45
}
```

### Download Song
```http
POST /api/music/songs/<song_id>/download
Authorization: Bearer <access_token>
```

### Get Artist Profile
```http
GET /api/music/artists/<artist_id>
```

### Get My Artist Profile
```http
GET /api/music/me/profile
Authorization: Bearer <access_token>
```

### Upload Song
```http
POST /api/music/songs
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "My Song",
  "description": "A new track",
  "audioUrl": "https://...",
  "coverUrl": "https://...",
  "durationSeconds": 180,
  "genre": "Afrobeat",
  "isPublished": true
}
```

---

## Marketplace Routes

### Get Products
```http
GET /api/marketplace/products?page=1&limit=20&category=Fashion&search=shirt
```

### Get Featured Products
```http
GET /api/marketplace/products/featured
```

### Get Product
```http
GET /api/marketplace/products/<product_id>
```

### Get Categories
```http
GET /api/marketplace/categories
```

### Get Business Profile
```http
GET /api/marketplace/businesses/<business_id>
```

### Get My Business
```http
GET /api/marketplace/me/business
Authorization: Bearer <access_token>
```

### Create Business
```http
POST /api/marketplace/businesses
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "businessName": "My Shop",
  "category": "Fashion",
  "location": "Lagos",
  "whatsappNumber": "+2348012345678"
}
```

### Add Product
```http
POST /api/marketplace/products
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Product Name",
  "description": "Description",
  "priceNaira": 5000,
  "coinPrice": 500000,
  "imageUrls": ["https://..."],
  "category": "Fashion"
}
```

### Boost Product
```http
POST /api/marketplace/products/<product_id>/boost
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "days": 7
}
```

---

## Referral Routes

### Get My Referral Info
```http
GET /api/referrals
Authorization: Bearer <access_token>
```

### Get L1 Referrals
```http
GET /api/referrals/l1?page=1&limit=20
Authorization: Bearer <access_token>
```

### Get All Referrals
```http
GET /api/referrals/all
Authorization: Bearer <access_token>
```

### Get Referral Leaderboard
```http
GET /api/referrals/leaderboard?limit=10
```

---

## Contest Routes

### Get Active Contests
```http
GET /api/contests
```

### Get Contest
```http
GET /api/contests/<contest_id>
```

### Vote
```http
POST /api/contests/<contest_id>/vote/<entry_id>
Authorization: Bearer <access_token>
```

### Enter Contest
```http
POST /api/contests/<contest_id>/entries
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "description": "Vote for me!",
  "imageUrl": "https://..."
}
```

---

## VTU Routes

### Get VTU Rates
```http
GET /api/vtu/rates
```

### Purchase Airtime
```http
POST /api/vtu/airtime
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "phoneNumber": "+2348012345678",
  "amount": 1000,
  "network": "MTN"
}
```

### Purchase Data
```http
POST /api/vtu/data
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "phoneNumber": "+2348012345678",
  "bundle": "500MB",
  "network": "MTN"
}
```

### Purchase Electricity
```http
POST /api/vtu/electricity
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "meterNumber": "12345678901",
  "amount": 5000,
  "provider": "IKEDC"
}
```

### Get VTU History
```http
GET /api/vtu/history?page=1&limit=20&serviceType=AIRTIME
Authorization: Bearer <access_token>
```

---

## Notification Routes

### Get Notifications
```http
GET /api/notifications?page=1&limit=20
Authorization: Bearer <access_token>
```

### Mark as Read
```http
PATCH /api/notifications/<id>/read
Authorization: Bearer <access_token>
```

### Mark All as Read
```http
PATCH /api/notifications/read-all
Authorization: Bearer <access_token>
```

### Get Unread Count
```http
GET /api/notifications/unread-count
Authorization: Bearer <access_token>
```

---

## Article Routes

### Get Articles
```http
GET /api/articles?page=1&limit=20&category=news&search=update
```

### Get Article
```http
GET /api/articles/<id>
```

### Get Articles by Category
```http
GET /api/articles/category/<category>
```

### Get Categories
```http
GET /api/articles/meta/categories
```

---

## Admin Routes

### Get Stats
```http
GET /api/admin/stats
Authorization: Bearer <access_token> (Admin)
```

### Get Users
```http
GET /api/admin/users?page=1&limit=20&role=USER&search=john
Authorization: Bearer <access_token> (Admin)
```

### Get User
```http
GET /api/admin/users/<id>
Authorization: Bearer <access_token> (Admin)
```

### Update User Role
```http
PATCH /api/admin/users/<id>/role
Authorization: Bearer <access_token> (Admin)
Content-Type: application/json

{
  "role": "ADMIN"
}
```

### Get Pending KYC
```http
GET /api/admin/kyc/pending
Authorization: Bearer <access_token> (Admin)
```

### Review KYC
```http
PATCH /api/admin/kyc/<userId>
Authorization: Bearer <access_token> (Admin)
Content-Type: application/json

{
  "status": "VERIFIED",
  "reason": "Documents verified"
}
```

### Get Pending Withdrawals
```http
GET /api/admin/withdrawals/pending
Authorization: Bearer <access_token> (Admin)
```

### Process Withdrawal
```http
POST /api/admin/withdrawals/<id>/process
Authorization: Bearer <access_token> (Admin)
```

### Reject Withdrawal
```http
POST /api/admin/withdrawals/<id>/reject
Authorization: Bearer <access_token> (Admin)
Content-Type: application/json

{
  "reason": "Invalid bank account"
}
```

### Create Task
```http
POST /api/admin/tasks
Authorization: Bearer <access_token> (Admin)
Content-Type: application/json

{
  "title": "New Task",
  "description": "Do something",
  "type": "WATCH_VIDEO",
  "coinReward": 50,
  "dailyLimit": 5
}
```

### Create Contest
```http
POST /api/admin/contests
Authorization: Bearer <access_token> (Admin)
Content-Type: application/json

{
  "title": "Best Artist",
  "type": "ARTIST",
  "startsAt": "2024-01-01T00:00:00Z",
  "endsAt": "2024-12-31T23:59:59Z"
}
```

---

## Webhook Endpoints

### Paystack
```http
POST /webhooks/paystack
X-Paystack-Signature: <signature>
```

### Binance
```http
POST /webhooks/binance
```

### VTPass
```http
POST /webhooks/vtpass
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation failed",
  "details": [
    { "path": "email", "message": "Invalid email format" }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid token"
}
```

### 403 Forbidden
```json
{
  "error": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests, please try again later",
  "retryAfter": 900
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| Auth (login, register) | 5 requests / 15 min |
| API | 100 requests / min |
| Withdrawals | 10 requests / hour |

---

## Coin Economy

| Action | Coins |
|--------|-------|
| Sign Up Bonus | 500 |
| Read Article | 50 |
| Watch Ad | 30 |
| Share Task | 100 |
| Complete Survey | 200 |
| App Download | 500 |
| Vote | 20 |
| Music Stream (>30s) | 1 |
| Music Download | 3 |
| Day 7 Streak | 2,000 |
| Day 30 Streak | 10,000 |

### Conversion
- 100 coins = ₦1
- Min withdrawal: 100,000 coins (₦1,000)
- Withdrawal fee: 1.5%
- Top-up: ₦100 = 9,000 coins (10% fee)