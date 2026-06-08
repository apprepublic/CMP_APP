import { prisma } from '../lib/prisma.js';
import { NotificationType } from '@prisma/client';

interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: NotificationType;
  metadata?: Record<string, unknown>;
}

export class NotificationService {
  /**
   * Create a notification for a user
   */
  static async create(params: CreateNotificationParams) {
    const { userId, title, message, type = 'INFO', metadata } = params;

    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        metadata
      }
    });

    // TODO: Send push notification via FCM if user has FCM token
    // await this.sendPushNotification(userId, title, message);

    return notification;
  }

  /**
   * Create multiple notifications (bulk)
   */
  static async createMany(notifications: CreateNotificationParams[]) {
    const results = await Promise.all(
      notifications.map(n => this.create(n))
    );
    return results;
  }

  /**
   * Get unread notification count for a user
   */
  static async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: {
        userId,
        isRead: false
      }
    });
  }

  /**
   * Get notifications for a user
   */
  static async getForUser(userId: string, page = 1, limit = 20) {
    const [notifications, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.notification.count({ where: { userId } }),
      this.getUnreadCount(userId)
    ]);

    return {
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
    return prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId
      },
      data: { isRead: true }
    });
  }

  /**
   * Mark all notifications as read
   */
  static async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: {
        userId,
        isRead: false
      },
      data: { isRead: true }
    });
  }

  /**
   * Delete old notifications (cleanup)
   */
  static async cleanupOlderThan(days: number = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return prisma.notification.deleteMany({
      where: {
        createdAt: { lt: cutoffDate }
      }
    });
  }

  // ============================================
  // Notification Templates
  // ============================================

  static async notifyTaskCompleted(userId: string, taskTitle: string, coinsEarned: number) {
    return this.create({
      userId,
      title: 'Task Completed! 🎉',
      message: `You earned ${coinsEarned} coins for completing "${taskTitle}"`,
      type: 'SUCCESS'
    });
  }

  static async notifyWithdrawal(userId: string, amount: number, status: 'pending' | 'approved' | 'rejected') {
    const messages = {
      pending: `Your withdrawal request of ${amount} coins has been submitted and is pending approval.`,
      approved: `Your withdrawal of ${amount} coins has been approved and processed!`,
      rejected: `Your withdrawal request of ${amount} coins was rejected. Coins have been refunded to your wallet.`
    };

    return this.create({
      userId,
      title: status === 'approved' ? 'Withdrawal Approved' : 'Withdrawal Update',
      message: messages[status],
      type: status === 'approved' ? 'SUCCESS' : status === 'rejected' ? 'ERROR' : 'INFO'
    });
  }

  static async notifyKycStatus(userId: string, status: 'pending' | 'verified' | 'rejected') {
    const messages = {
      pending: 'Your KYC documents have been submitted and are being reviewed.',
      verified: 'Congratulations! Your KYC has been verified. You can now withdraw funds.',
      rejected: 'Your KYC was rejected. Please resubmit with valid documents.'
    };

    return this.create({
      userId,
      title: 'KYC Status Update',
      message: messages[status],
      type: status === 'verified' ? 'SUCCESS' : status === 'rejected' ? 'ERROR' : 'INFO'
    });
  }

  static async notifyReferralEarning(userId: string, refereeUsername: string, coinsEarned: number) {
    return this.create({
      userId,
      title: 'Referral Bonus! 💰',
      message: `You earned ${coinsEarned} coins from your referral ${refereeUsername}`,
      type: 'SUCCESS'
    });
  }

  static async notifyStreakMilestone(userId: string, streakDays: number) {
    const messages: Record<number, string> = {
      7: 'Congratulations! You reached a 7-day streak! Bonus: 2,000 coins',
      14: 'Amazing! 14-day streak! Bonus: 5,000 coins',
      21: 'Incredible! 21-day streak! Bonus: 7,500 coins',
      30: 'Legendary! 30-day streak! Bonus: 10,000 coins'
    };

    return this.create({
      userId,
      title: '🔥 Streak Milestone!',
      message: messages[streakDays] || `You reached a ${streakDays}-day streak!`,
      type: 'SUCCESS'
    });
  }

  static async notifyContestVote(userId: string, contestTitle: string) {
    return this.create({
      userId,
      title: 'Vote Recorded! 🗳️',
      message: `Your vote in "${contestTitle}" has been recorded. You earned 20 coins!`,
      type: 'SUCCESS'
    });
  }

  static async notifyNewFollower(userId: string, followerName: string) {
    return this.create({
      userId,
      title: 'New Follower! 👤',
      message: `${followerName} started following you.`,
      type: 'INFO'
    });
  }
}

export default NotificationService;