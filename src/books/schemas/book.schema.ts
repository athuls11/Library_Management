import mongoose from 'mongoose';

export const BooksDetails = new mongoose.Schema({
  title: { type: String, unique: true },
  ISBN: { type: String, unique: true },
  author: { type: String },
  stock: { type: Number, minlength: 0 },
  description: { type: String, maxlength: 100 },
  category: { type: String },
});
