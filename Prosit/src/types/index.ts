// Prosit/src/types/index.ts

export interface User {
  user_id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  institution?: string;
  country?: string;
  role: 'student' | 'teacher' | 'admin' | 'researcher';
  profile_picture?: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export interface Cer {
  cer_id: number;
  title: string;
  description: string;
  category_id?: number;
  category_name?: string;
  university_id?: number;
  university_name?: string;
  university_country?: string;
  author_id: number;
  author_username?: string;
  author_first_name?: string;
  author_last_name?: string;
  file_path?: string;
  file_type?: string;
  file_size?: number;
  thumbnail?: string;
  status: 'draft' | 'published' | 'archived' | 'pending_review';
  language: string;
  views_count: number;
  downloads_count: number;
  is_public: boolean;
  keywords?: string;
  publication_date?: string;
  created_at: string;
  updated_at: string;
  average_rating?: number;
  rating_count?: number;
  favorite_count?: number;
  tags?: Tag[];
}

export interface Category {
  category_id: number;
  name: string;
  description?: string;
  color_code: string;
  created_at: string;
}

export interface Tag {
  tag_id: number;
  name: string;
  usage_count: number;
  created_at: string;
}

export interface University {
  university_id: number;
  name: string;
  country: string;
  city?: string;
  website?: string;
  contact_email?: string;
  is_active: boolean;
  created_at: string;
}

export interface Favorite {
  favorite_id: number;
  user_id: number;
  cer_id: number;
  notes?: string;
  created_at: string;
  favorited_at?: string;
  // Informations du CER associé
  title?: string;
  description?: string;
  category_name?: string;
}

export interface Comment {
  comment_id: number;
  cer_id: number;
  user_id: number;
  parent_comment_id?: number;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  // Informations de l'utilisateur
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface Rating {
  rating_id: number;
  cer_id: number;
  user_id: number;
  rating: number;
  review?: string;
  created_at: string;
  updated_at: string;
  // Informations de l'utilisateur
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface UserPreferences {
  preference_id: number;
  user_id: number;
  language_code: string;
  theme: 'light' | 'dark';
  timezone: string;
  notifications_enabled: boolean;
  items_per_page: number;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  notification_id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
  page?: number;
}

export interface SearchParams extends PaginationParams {
  q?: string;
  category_id?: number;
  status?: string;
  language?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  institution?: string;
  country?: string;
  role?: 'student' | 'teacher' | 'researcher';
}