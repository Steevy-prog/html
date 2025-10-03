// Prosit/src/services/apiService.ts

const API_BASE_URL = 'http://localhost/backend/routes/api.php';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      credentials: 'include', // Important pour les sessions PHP
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // ============================================
  // AUTH ENDPOINTS
  // ============================================
  
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    institution?: string;
    country?: string;
  }) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me', {
      method: 'GET',
    });
  }

  // ============================================
  // CER ENDPOINTS
  // ============================================
  
  async getCers(params?: {
    limit?: number;
    offset?: number;
    status?: string;
    category_id?: number;
    search?: string;
  }) {
    const queryString = new URLSearchParams(
      params as Record<string, string>
    ).toString();
    
    return this.request(`/cers?${queryString}`, {
      method: 'GET',
    });
  }

  async getCer(id: number) {
    return this.request(`/cers/${id}`, {
      method: 'GET',
    });
  }

  async createCer(cerData: {
    title: string;
    description: string;
    category_id?: number;
    university_id?: number;
    language?: string;
    keywords?: string;
    tags?: number[];
    file_path?: string;
    file_type?: string;
    file_size?: number;
  }) {
    return this.request('/cers', {
      method: 'POST',
      body: JSON.stringify(cerData),
    });
  }

  async updateCer(id: number, cerData: Partial<{
    title: string;
    description: string;
    category_id: number;
    status: string;
  }>) {
    return this.request(`/cers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(cerData),
    });
  }

  async deleteCer(id: number) {
    return this.request(`/cers/${id}`, {
      method: 'DELETE',
    });
  }

  async searchCers(query: string, limit: number = 10, offset: number = 0) {
    const params = new URLSearchParams({
      q: query,
      limit: limit.toString(),
      offset: offset.toString(),
    });
    
    return this.request(`/cers/search?${params}`, {
      method: 'GET',
    });
  }

  async getUserCers(limit: number = 10, offset: number = 0) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    
    return this.request(`/users/me/cers?${params}`, {
      method: 'GET',
    });
  }

  // ============================================
  // FAVORITES ENDPOINTS
  // ============================================
  
  async getFavorites(limit: number = 10, offset: number = 0) {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });
    
    return this.request(`/favorites?${params}`, {
      method: 'GET',
    });
  }

  async addFavorite(cerId: number, notes?: string) {
    return this.request('/favorites', {
      method: 'POST',
      body: JSON.stringify({ cer_id: cerId, notes }),
    });
  }

  async removeFavorite(cerId: number) {
    return this.request(`/favorites/${cerId}`, {
      method: 'DELETE',
    });
  }

  async checkFavorite(cerId: number) {
    return this.request(`/favorites/check/${cerId}`, {
      method: 'GET',
    });
  }

  // ============================================
  // USER PREFERENCES
  // ============================================
  
  async getPreferences() {
    return this.request('/users/me/preferences', {
      method: 'GET',
    });
  }

  async updatePreferences(preferences: {
    language_code?: string;
    theme?: string;
    timezone?: string;
    notifications_enabled?: boolean;
    items_per_page?: number;
  }) {
    return this.request('/users/me/preferences', {
      method: 'PUT',
      body: JSON.stringify(preferences),
    });
  }

  // ============================================
  // CATEGORIES, TAGS, UNIVERSITIES
  // ============================================
  
  async getCategories() {
    return this.request('/categories', {
      method: 'GET',
    });
  }

  async getTags() {
    return this.request('/tags', {
      method: 'GET',
    });
  }

  async getUniversities() {
    return this.request('/universities', {
      method: 'GET',
    });
  }

  // ============================================
  // FILE UPLOAD
  // ============================================
  
  async uploadFile(file: File, cerId?: number) {
    const formData = new FormData();
    formData.append('file', file);
    if (cerId) {
      formData.append('cer_id', cerId.toString());
    }

    const url = 'http://localhost/backend/routes/upload.php';
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de l\'upload');
      }
      
      return data;
    } catch (error) {
      console.error('Upload Error:', error);
      throw error;
    }
  }

  async deleteFile(filePath: string) {
    const url = 'http://localhost/backend/routes/upload.php';
    
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file_path: filePath }),
        credentials: 'include',
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la suppression');
      }
      
      return data;
    } catch (error) {
      console.error('Delete Error:', error);
      throw error;
    }
  }

  // ============================================
  // NOTIFICATIONS
  // ============================================
  
  async getNotifications(params?: {
    limit?: number;
    offset?: number;
    unread_only?: boolean;
  }) {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.offset) queryParams.append('offset', params.offset.toString());
    if (params?.unread_only) queryParams.append('unread_only', 'true');
    
    return this.request(`/notifications?${queryParams}`, {
      method: 'GET',
    });
  }

  async markNotificationAsRead(notificationId: number) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async markAllNotificationsAsRead() {
    return this.request('/notifications/read-all', {
      method: 'PUT',
    });
  }

  async deleteNotification(notificationId: number) {
    return this.request(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // COMMENTS & RATINGS
  // ============================================
  
  async getComments(cerId: number) {
    return this.request(`/cers/${cerId}/comments`, {
      method: 'GET',
    });
  }

  async addComment(cerId: number, content: string) {
    return this.request(`/cers/${cerId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async deleteComment(commentId: number) {
    return this.request(`/comments/${commentId}`, {
      method: 'DELETE',
    });
  }

  async getRatings(cerId: number) {
    return this.request(`/cers/${cerId}/ratings`, {
      method: 'GET',
    });
  }

  async addRating(cerId: number, rating: number, review?: string) {
    return this.request(`/cers/${cerId}/ratings`, {
      method: 'POST',
      body: JSON.stringify({ rating, review }),
    });
  }

  async deleteRating(ratingId: number) {
    return this.request(`/ratings/${ratingId}`, {
      method: 'DELETE',
    });
  }
}

// Export une instance unique
export const apiService = new ApiService();
export default apiService;