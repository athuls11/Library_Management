import { Document } from 'mongoose';

export interface BooksInterface extends Document {
  title?: string;
  ISBN?: string;
  author?: string;
  stock?: number;
  description?: string;
  category?: string;
}
