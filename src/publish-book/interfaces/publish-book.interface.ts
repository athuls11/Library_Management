import mongoose from 'mongoose';
import { Document } from 'mongoose';

export interface PublishBookInterface extends Document {
  user_id: {
    id: {
      type: mongoose.Schema.Types.ObjectId;
      ref: 'User';
    },
    username: String;
  };
  book_info: {
    id: {
      type: mongoose.Schema.Types.ObjectId;
      ref: 'Books';
    };
    title: String;
    ISBN: String;
    author: String;
    stock: Number;
    description: String;
    category: String;
  };
}
