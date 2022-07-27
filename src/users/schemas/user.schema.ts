import mongoose from 'mongoose';

export const UserDetails = new mongoose.Schema({
  username: { type: String },
  email: { type: String, unique: true },
  password: { type: String, maxlength: 100, minlength: 8 },
  role: { type: String },
  accessToken: { type: String, default: '' },
  refreshToken: { type: String, default: '' },
});
