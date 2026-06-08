const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiService {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('accessToken', token);
      } else {
        localStorage.removeItem('accessToken');
      }
    }
  }

  getToken(): string | null {
    if (this.token) return this.token;
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    const authToken = token || this.getToken();
    if (authToken) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async register(data: {
    email?: string;
    phone: string;
    password: string;
    displayName: string;
    username: string;
    referralCode?: string;
  }) {
    return this.request<{ user: any; accessToken: string; refreshToken: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(credentials: { email?: string; phone?: string; password: string }) {
    return this.request<{ user: any; accessToken: string; refreshToken: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async refreshToken(refreshToken: string) {
    return this.request<{ accessToken: string; refreshToken: string }>('/api/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  }

  // User
  async getMe() {
    return this.request<{ user: any }>('/api/users/me');
  }

  async updateProfile(data: { displayName?: string }) {
    return this.request<{ user: any }>('/api/users/me', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async submitKyc(data: {
    bvn?: string;
    idNumber?: string;
    idType?: string;
    selfieUrl?: string;
    idImageUrl?: string;
  }) {
    return this.request<{ kyc: any }>('/api/users/kyc', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async upgradeToArtist(data: { stageName: string; bio?: string; genre?: string }) {
    return this.request<{ profile: any }>('/api/users/upgrade/artist', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async upgradeToBusiness(data: {
    businessName: string;
    description?: string;
    category: string;
    location?: string;
    whatsappNumber?: string;
  }) {
    return this.request<{ profile: any }>('/api/users/upgrade/business', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Wallet
  async getWallet() {
    return this.request<{ wallet: any }>('/api/wallet');
  }

  async getTransactions(page = 1, limit = 20, type?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (type) params.set('type', type);
    return this.request<{ transactions: any[]; pagination: any }>(`/api/wallet/transactions?${params}`);
  }

  async topUp(amount: number, paymentMethod: string) {
    return this.request<{ coinsReceived: number; newBalance: number }>('/api/wallet/topup', {
      method: 'POST',
      body: JSON.stringify({ amount, paymentMethod }),
    });
  }

  async withdraw(data: {
    coinsAmount: number;
    method: 'BANK' | 'CRYPTO';
    bankAccount?: string;
    bankName?: string;
    pin: string;
  }) {
    return this.request<{ withdrawal: any }>('/api/wallet/withdraw', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Tasks
  async getTasks(type?: string) {
    const params = type ? `?type=${type}` : '';
    return this.request<{ tasks: any[] }>(`/api/tasks${params}`);
  }

  async getDailyTasks() {
    return this.request<{ tasks: any[] }>('/api/tasks/daily');
  }

  async completeTask(taskId: string, adWatched = true) {
    return this.request<{ coinsEarned: number }>(`/api/tasks/${taskId}/complete`, {
      method: 'POST',
      body: JSON.stringify({ adWatched }),
    });
  }

  // Music
  async getSongs(page = 1, limit = 20, genre?: string, search?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (genre) params.set('genre', genre);
    if (search) params.set('search', search);
    return this.request<{ songs: any[]; pagination: any }>(`/api/music/songs?${params}`);
  }

  async getFeaturedSongs() {
    return this.request<{ songs: any[] }>('/api/music/songs/featured');
  }

  async streamSong(songId: string, duration: number) {
    return this.request<{ message: string }>(`/api/music/songs/${songId}/stream`, {
      method: 'POST',
      body: JSON.stringify({ duration }),
    });
  }

  async downloadSong(songId: string) {
    return this.request<{ downloadUrl: string }>(`/api/music/songs/${songId}/download`, {
      method: 'POST',
    });
  }

  // Marketplace
  async getProducts(page = 1, limit = 20, category?: string, search?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    return this.request<{ products: any[]; pagination: any }>(`/api/marketplace/products?${params}`);
  }

  async getCategories() {
    return this.request<{ categories: any[] }>('/api/marketplace/categories');
  }

  // Referrals
  async getReferrals() {
    return this.request<{ referral: any }>('/api/referrals');
  }

  async getL1Referrals(page = 1, limit = 20) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return this.request<{ referrals: any[]; pagination: any }>(`/api/referrals/l1?${params}`);
  }

  // Contests
  async getContests() {
    return this.request<{ contests: any[] }>('/api/contests');
  }

  async vote(contestId: string, entryId: string) {
    return this.request<{ coinsEarned: number }>(`/api/contests/${contestId}/vote/${entryId}`, {
      method: 'POST',
    });
  }

  // Notifications
  async getNotifications(page = 1, limit = 20) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    return this.request<{ notifications: any[]; unreadCount: number; pagination: any }>(
      `/api/notifications?${params}`
    );
  }

  async markNotificationRead(id: string) {
    return this.request<{ message: string }>(`/api/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  // Articles
  async getArticles(page = 1, limit = 20, category?: string, search?: string) {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (category) params.set('category', category);
    if (search) params.set('search', search);
    return this.request<{ articles: any[]; pagination: any }>(`/api/articles?${params}`);
  }

  async getArticle(id: string) {
    return this.request<{ article: any }>(`/api/articles/${id}`);
  }
}

export const api = new ApiService();