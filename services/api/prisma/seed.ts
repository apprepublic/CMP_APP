import { PrismaClient, UserRole, TaskType, ContestType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@cmpapp.ng' },
    update: {},
    create: {
      email: 'admin@cmpapp.ng',
      phone: '+2348000000000',
      passwordHash: adminPassword,
      displayName: 'CMP Admin',
      username: 'admin',
      role: UserRole.SUPER_ADMIN,
      referralCode: 'ADMIN001',
      phoneVerified: true,
      emailVerified: true
    }
  });

  // Create admin wallet
  await prisma.wallet.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      coinBalance: 1000000n // 1M coins for testing
    }
  });

  // Create test users
  const testPassword = await bcrypt.hash('password123', 12);

  const user1 = await prisma.user.upsert({
    where: { phone: '+2348012345678' },
    update: {},
    create: {
      email: 'chisom@test.com',
      phone: '+2348012345678',
      passwordHash: testPassword,
      displayName: 'Chisom Adebayo',
      username: 'chisom',
      referralCode: 'CHISOM01',
      phoneVerified: true
    }
  });

  const user2 = await prisma.user.upsert({
    where: { phone: '+2348012345679' },
    update: {},
    create: {
      email: 'dele@test.com',
      phone: '+2348012345679',
      passwordHash: testPassword,
      displayName: 'Dele Music',
      username: 'dele',
      role: UserRole.ARTIST,
      referralCode: 'DELE01',
      phoneVerified: true
    }
  });

  const user3 = await prisma.user.upsert({
    where: { phone: '+2348012345680' },
    update: {},
    create: {
      email: 'amaka@test.com',
      phone: '+2348012345680',
      passwordHash: testPassword,
      displayName: 'Amaka Stores',
      username: 'amaka',
      role: UserRole.BUSINESS,
      referralCode: 'AMAKA01',
      phoneVerified: true
    }
  });

  // Create wallets for test users
  for (const user of [user1, user2, user3]) {
    await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        coinBalance: 5000n
      }
    });

    await prisma.streakRecord.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        currentStreak: Math.floor(Math.random() * 7),
        longestStreak: Math.floor(Math.random() * 30)
      }
    });
  }

  // Create artist profiles
  await prisma.artistProfile.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      userId: user2.id,
      stageName: 'Dele Beats',
      bio: 'Upcoming Afrobeat artist from Ibadan',
      genre: 'Afrobeat',
      isVerified: false
    }
  });

  // Create business profiles
  await prisma.businessProfile.upsert({
    where: { userId: user3.id },
    update: {},
    create: {
      userId: user3.id,
      businessName: 'Amaka Fashion',
      description: 'Quality clothing and accessories',
      category: 'Fashion',
      location: 'Abuja',
      whatsappNumber: '+2348012345680'
    }
  });

  // Create tasks
  const tasks = [
    {
      title: 'Read Latest News',
      description: 'Read a news article to earn coins',
      type: TaskType.READ_ARTICLE,
      coinReward: 50,
      dailyLimit: 5,
      requiresAdGate: true
    },
    {
      title: 'Watch Video Ad',
      description: 'Watch a short video ad',
      type: TaskType.WATCH_VIDEO,
      coinReward: 30,
      dailyLimit: 10,
      requiresAdGate: false
    },
    {
      title: 'Share on Social Media',
      description: 'Share content on your social media',
      type: TaskType.SHARE_SOCIAL,
      coinReward: 100,
      dailyLimit: 3,
      requiresAdGate: true
    },
    {
      title: 'Complete Survey',
      description: 'Fill out a short survey',
      type: TaskType.COMPLETE_SURVEY,
      coinReward: 200,
      dailyLimit: 1,
      requiresAdGate: true
    },
    {
      title: 'Download App',
      description: 'Download and try a new app',
      type: TaskType.APP_DOWNLOAD,
      coinReward: 500,
      dailyLimit: 1,
      requiresAdGate: false
    },
    {
      title: 'Vote in Contest',
      description: 'Vote for your favorite artist or business',
      type: TaskType.VOTE,
      coinReward: 20,
      dailyLimit: 5,
      requiresAdGate: false
    }
  ];

  for (const task of tasks) {
    await prisma.task.upsert({
      where: { id: task.title.toLowerCase().replace(/ /g, '_') },
      update: {},
      create: {
        ...task,
        id: task.title.toLowerCase().replace(/ /g, '_')
      }
    });
  }

  // Create product categories
  const categories = [
    { name: 'Fashion', slug: 'fashion', icon: '👗' },
    { name: 'Electronics', slug: 'electronics', icon: '📱' },
    { name: 'Food & Drinks', slug: 'food-drinks', icon: '🍔' },
    { name: 'Home & Garden', slug: 'home-garden', icon: '🏠' },
    { name: 'Health & Beauty', slug: 'health-beauty', icon: '💄' },
    { name: 'Sports', slug: 'sports', icon: '⚽' },
    { name: 'Books', slug: 'books', icon: '📚' },
    { name: 'Services', slug: 'services', icon: '🔧' }
  ];

  for (const cat of categories) {
    await prisma.productCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat
    });
  }

  // Create sample products
  const business = await prisma.businessProfile.findUnique({
    where: { userId: user3.id }
  });

  if (business) {
    await prisma.product.upsert({
      where: { id: 'sample_dress' },
      update: {},
      create: {
        id: 'sample_dress',
        businessId: business.id,
        name: 'Ankara Dress',
        description: 'Beautiful handmade Ankara dress',
        priceNaira: 15000,
        coinPrice: 1500000,
        imageUrls: ['https://example.com/dress.jpg'],
        category: 'Fashion'
      }
    });
  }

  // Create a contest
  const now = new Date();
  const contestStart = new Date(now);
  contestStart.setDate(contestStart.getDate() - 1);
  const contestEnd = new Date(now);
  contestEnd.setDate(contestEnd.getDate() + 7);

  await prisma.contest.upsert({
    where: { id: 'artist_contest_001' },
    update: {},
    create: {
      id: 'artist_contest_001',
      title: 'Best New Artist 2024',
      description: 'Vote for the best upcoming artist',
      type: ContestType.ARTIST,
      startsAt: contestStart,
      endsAt: contestEnd,
      isActive: true,
      prizeDescription: '1st Place: 100,000 coins + featured profile'
    }
  });

  // Add contest entries
  const artist = await prisma.artistProfile.findUnique({
    where: { userId: user2.id }
  });

  if (artist) {
    await prisma.contestEntry.upsert({
      where: { id: 'entry_001' },
      update: {},
      create: {
        id: 'entry_001',
        contestId: 'artist_contest_001',
        userId: user2.id,
        artistProfileId: artist.id,
        description: 'Talented Afrobeat artist from Ibadan'
      }
    });
  }

  console.log('Seed data created successfully!');
  console.log(`
Test Accounts:
- Admin: admin@cmpapp.ng / admin123
- User: chisom@test.com / password123
- Artist: dele@test.com / password123
- Business: amaka@test.com / password123
  `);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });