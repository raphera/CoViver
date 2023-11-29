export interface UserModel {
  user_id: number;
  name: string;
  email: string;
  password_hash: string;
  google_id?: string;
}