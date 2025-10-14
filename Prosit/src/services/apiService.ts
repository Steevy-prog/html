// Prosit/src/services/apiService.ts
const API_BASE_URL = 'http://localhost/backend/routes/api.php';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  csrf_token?: string;
}

class ApiService {
  private baseURL: string;
  private csrfToken: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async getCsrfToken(): Promise<string> {
    if (this.csrfToken) return this.csrfToken;

    try {
      const response = await fetch(this.baseURL, {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();
      this.csrfToken = data.csrf_token;
      return this.csrfToken;
    } catch (error) {
      console.error('Erreur lors de la récupération du token CSRF:', error);
      throw error;
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getCsrfToken();

      const config: RequestInit = {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
          ...options.headers,
        },
        credentials: 'include',
        body: options.body ? JSON.stringify(options.body) : null
      };

      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      const data: ApiResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Une erreur est survenue');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Exemple de méthode pour l'authentification
  public async login(email: string, password: string): Promise<{ user: any; token: string }> {
    const response = await this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: { email, password }
    });

    if (response.data?.token) {
      localStorage.setItem('auth_token', response.data.token);
    }

    return response.data!;
  }

  // Exemple de méthode pour récupérer le profil utilisateur
  public async getProfile(): Promise<any> {
    const response = await this.request<any>('/user/profile', {
      method: 'GET'
    });
    return response.data;
  }
}

export const apiService = new ApiService();