export interface User {
  id: string; // UUID
  email: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  email_verified: boolean;
  email_verified_at: Date | null;
  is_active: boolean;
  last_login_at: Date | null;
  login_count: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}