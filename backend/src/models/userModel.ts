export default class User{
  user_id: number = 0;
  name: string = "";
  email: string = "";
  password_hash: string = "";
  google_id?: string;
}