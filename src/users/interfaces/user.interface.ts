import { Document } from 'mongoose';

export interface UserInterface extends Document {
  username?: string;
  email?: string;
  book_id?: [object];
  password?: string;
  role?: Role;
  accessToken?: string;
  refreshToken?: string;
}

export enum Role {
  ADMIN = 'admin',
  USER = 'user',
}
